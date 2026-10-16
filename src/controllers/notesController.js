const prisma = require('../utils/prisma');

exports.getNotes = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    const notes = await prisma.topicNote.findFirst({
      where: {
        OR: [
          { topicId },
          { topic: { slug: topicId } }
        ]
      },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            topicNumber: true,
            keyTakeaway: true,
            module: { select: { title: true, moduleNumber: true } }
          }
        }
      }
    });

    if (!notes) {
      return res.status(404).json({ success: false, message: 'Notes not found for this topic.' });
    }

    res.json({
      success: true,
      notes: {
        id: notes.id,
        topic: notes.topic,
        simpleExplanation: notes.simpleExplanation,
        coreConcepts: JSON.parse(notes.coreConceptsJson || '[]'),
        internalsExplanation: notes.internalsExplanation,
        architectureSvg: notes.architectureSvg,
        cliExamples: JSON.parse(notes.cliExamplesJson || '[]'),
        bestPractices: JSON.parse(notes.bestPracticesJson || '[]'),
        securityNotes: notes.securityNotes,
        costImplications: notes.costImplications,
        commonMistakes: JSON.parse(notes.commonMistakesJson || '[]'),
        quickRevision: JSON.parse(notes.quickRevisionJson || '[]'),
        updatedAt: notes.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.markNotesRead = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const userId = req.user.id;
    const { timeSpentSeconds = 60 } = req.body;

    // Resolve true topicId
    const topic = await prisma.topic.findFirst({
      where: { OR: [{ id: topicId }, { slug: topicId }] }
    });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found.' });

    const currentProgress = await prisma.userTopicProgress.findUnique({
      where: { userId_topicId: { userId, topicId: topic.id } }
    });

    const isComplete = (currentProgress?.labCompleted && currentProgress?.quizPassed) || false;

    const updated = await prisma.userTopicProgress.upsert({
      where: { userId_topicId: { userId, topicId: topic.id } },
      update: {
        notesRead: true,
        status: isComplete ? 'COMPLETED' : 'IN_PROGRESS',
        timeSpentSeconds: { increment: parseInt(timeSpentSeconds) || 60 }
      },
      create: {
        userId,
        topicId: topic.id,
        notesRead: true,
        status: 'IN_PROGRESS',
        timeSpentSeconds: parseInt(timeSpentSeconds) || 60
      }
    });

    await prisma.learningActivity.create({
      data: {
        userId,
        actionType: 'READ_NOTES',
        metadataJson: JSON.stringify({ topicId: topic.id, title: topic.title })
      }
    });

    res.json({ success: true, message: 'Notes marked as read.', progress: updated });
  } catch (err) {
    next(err);
  }
};

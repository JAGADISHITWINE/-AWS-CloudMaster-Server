const prisma = require('../utils/prisma');

exports.getModules = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;

    const modules = await prisma.learningModule.findMany({
      orderBy: { moduleNumber: 'asc' },
      include: {
        topics: {
          orderBy: { topicNumber: 'asc' },
          include: {
            labs: {
              select: { id: true, costRiskLevel: true, freeTierEligible: true }
            },
            ...(userId && {
              userProgress: {
                where: { userId }
              }
            })
          }
        }
      }
    });

    const formattedModules = modules.map(m => {
      const totalTopics = m.topics.length;
      let completedTopics = 0;
      let inProgressTopics = 0;

      const topicsWithProgress = m.topics.map(t => {
        const progress = t.userProgress && t.userProgress[0] ? t.userProgress[0] : null;
        if (progress && progress.status === 'COMPLETED') completedTopics++;
        else if (progress && progress.status === 'IN_PROGRESS') inProgressTopics++;

        return {
          id: t.id,
          topicNumber: t.topicNumber,
          title: t.title,
          slug: t.slug,
          summary: t.summary,
          difficulty: t.difficulty,
          estimatedMinutes: t.estimatedMinutes,
          keyTakeaway: t.keyTakeaway,
          hasLab: t.labs.length > 0,
          costRisk: t.labs[0] ? t.labs[0].costRiskLevel : 'LOW',
          status: progress ? progress.status : 'NOT_STARTED',
          notesRead: progress ? progress.notesRead : false,
          labCompleted: progress ? progress.labCompleted : false,
          quizPassed: progress ? progress.quizPassed : false
        };
      });

      const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      return {
        id: m.id,
        moduleNumber: m.moduleNumber,
        title: m.title,
        slug: m.slug,
        description: m.description,
        icon: m.icon,
        level: m.level,
        totalTopics,
        completedTopics,
        inProgressTopics,
        completionPercentage,
        topics: topicsWithProgress
      };
    });

    res.json({ success: true, modules: formattedModules });
  } catch (err) {
    next(err);
  }
};

exports.getTopicById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const topic = await prisma.topic.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      },
      include: {
        module: {
          select: { id: true, moduleNumber: true, title: true, slug: true }
        },
        notes: true,
        labs: {
          include: {
            steps: { orderBy: { stepNumber: 'asc' } },
            ...(userId && {
              userProgress: {
                where: { userId }
              }
            })
          }
        },
        ...(userId && {
          userProgress: {
            where: { userId }
          }
        })
      }
    });

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found.' });
    }

    // Question stats
    const questionCounts = await prisma.question.groupBy({
      by: ['type'],
      where: { topicId: topic.id },
      _count: { id: true }
    });

    const questionStats = {
      scenarios: 0,
      interviews: 0,
      quizzes: 0
    };

    questionCounts.forEach(q => {
      if (q.type === 'SCENARIO') questionStats.scenarios = q._count.id;
      else if (q.type === 'INTERVIEW') questionStats.interviews = q._count.id;
      else questionStats.quizzes += q._count.id;
    });

    const userProgress = topic.userProgress && topic.userProgress[0] ? topic.userProgress[0] : null;

    res.json({
      success: true,
      topic: {
        id: topic.id,
        moduleId: topic.moduleId,
        module: topic.module,
        topicNumber: topic.topicNumber,
        title: topic.title,
        slug: topic.slug,
        summary: topic.summary,
        difficulty: topic.difficulty,
        estimatedMinutes: topic.estimatedMinutes,
        keyTakeaway: topic.keyTakeaway,
        notes: topic.notes,
        lab: topic.labs[0] || null,
        questionStats,
        userProgress: userProgress || {
          status: 'NOT_STARTED',
          notesRead: false,
          labCompleted: false,
          quizPassed: false,
          timeSpentSeconds: 0
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

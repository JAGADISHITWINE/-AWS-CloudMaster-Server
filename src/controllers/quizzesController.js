const prisma = require('../utils/prisma');

exports.getTopicQuiz = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    const topic = await prisma.topic.findFirst({
      where: {
        OR: [{ id: topicId }, { slug: topicId }]
      }
    });

    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found.' });

    const questions = await prisma.question.findMany({
      where: {
        topicId: topic.id,
        type: { in: ['MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'CLI_OUTPUT'] }
      },
      include: {
        options: {
          select: {
            id: true,
            optionKey: true,
            optionText: true
          }
        }
      }
    });

    const formatted = questions.map(q => ({
      id: q.id,
      type: q.type,
      difficulty: q.difficulty,
      title: q.title,
      prompt: q.prompt,
      hints: q.hintsJson ? JSON.parse(q.hintsJson) : [],
      options: q.options
    }));

    res.json({
      success: true,
      topic: { id: topic.id, title: topic.title, topicNumber: topic.topicNumber },
      totalQuestions: formatted.length,
      passingScorePercentage: 70,
      questions: formatted
    });
  } catch (err) {
    next(err);
  }
};

exports.submitQuiz = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const { answers, timeSpentSeconds = 60 } = req.body; // answers = [{ questionId, selectedOption, textAnswer }]
    const userId = req.user.id;

    const topic = await prisma.topic.findFirst({
      where: { OR: [{ id: topicId }, { slug: topicId }] }
    });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found.' });

    const questions = await prisma.question.findMany({
      where: {
        topicId: topic.id,
        type: { in: ['MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'CLI_OUTPUT'] }
      },
      include: {
        options: true
      }
    });

    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: 'No assessment questions found for this topic.' });
    }

    let correctCount = 0;
    const detailedResults = [];

    const answerMap = {};
    (answers || []).forEach(a => {
      answerMap[a.questionId] = a;
    });

    questions.forEach(q => {
      const userSubmission = answerMap[q.id];
      const correctOption = q.options.find(o => o.isCorrect);

      let isCorrect = false;
      let selectedOptionKey = userSubmission ? userSubmission.selectedOption : null;

      if (correctOption && selectedOptionKey === correctOption.optionKey) {
        isCorrect = true;
        correctCount++;
      }

      detailedResults.push({
        questionId: q.id,
        title: q.title,
        prompt: q.prompt,
        explanation: q.explanation,
        selectedOption: selectedOptionKey,
        correctOptionKey: correctOption ? correctOption.optionKey : null,
        isCorrect,
        options: q.options.map(o => ({
          optionKey: o.optionKey,
          optionText: o.optionText,
          isCorrect: o.isCorrect
        }))
      });
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= 70;

    // Save QuizAttempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        topicId: topic.id,
        score: scorePercentage,
        totalQuestions: questions.length,
        passed,
        timeSpentSeconds: parseInt(timeSpentSeconds) || 60
      }
    });

    // Save individual answers
    for (const r of detailedResults) {
      await prisma.userAnswer.create({
        data: {
          userId,
          questionId: r.questionId,
          quizAttemptId: attempt.id,
          selectedOption: r.selectedOption,
          isCorrect: r.isCorrect,
          scoreGiven: r.isCorrect ? 100 : 0
        }
      });
    }

    // Update user topic progress
    const currentProgress = await prisma.userTopicProgress.findUnique({
      where: { userId_topicId: { userId, topicId: topic.id } }
    });

    const allFinished = passed && currentProgress?.notesRead && currentProgress?.labCompleted;

    await prisma.userTopicProgress.upsert({
      where: { userId_topicId: { userId, topicId: topic.id } },
      update: {
        quizPassed: passed,
        status: allFinished ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: allFinished ? new Date() : currentProgress?.completedAt
      },
      create: {
        userId,
        topicId: topic.id,
        quizPassed: passed,
        status: allFinished ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: allFinished ? new Date() : null
      }
    });

    // Schedule revision if score < 70 or for spaced repetition
    const nextReviewDays = passed ? 3 : 1;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextReviewDays);

    await prisma.revisionSchedule.upsert({
      where: { userId_topicId: { userId, topicId: topic.id } },
      update: {
        nextReviewDate: nextDate,
        status: 'DUE',
        repetitions: { increment: 1 }
      },
      create: {
        userId,
        topicId: topic.id,
        nextReviewDate: nextDate,
        status: 'DUE',
        intervalDays: nextReviewDays
      }
    });

    await prisma.learningActivity.create({
      data: {
        userId,
        actionType: passed ? 'PASSED_QUIZ' : 'FAILED_QUIZ',
        metadataJson: JSON.stringify({ topicId: topic.id, score: scorePercentage, passed })
      }
    });

    res.json({
      success: true,
      score: scorePercentage,
      passed,
      correctCount,
      totalQuestions: questions.length,
      passingScore: 70,
      attemptId: attempt.id,
      detailedResults
    });
  } catch (err) {
    next(err);
  }
};

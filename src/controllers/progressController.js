const prisma = require('../utils/prisma');

exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total topics count
    const totalTopics = await prisma.topic.count();

    // User topic progress records
    const progressRecords = await prisma.userTopicProgress.findMany({
      where: { userId },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            topicNumber: true,
            module: { select: { title: true, moduleNumber: true } }
          }
        }
      }
    });

    let completedTopicsCount = 0;
    let inProgressTopicsCount = 0;
    let notesReadCount = 0;
    let labsCompletedCount = 0;
    let quizzesPassedCount = 0;
    let totalTimeSpentSeconds = 0;

    progressRecords.forEach(p => {
      if (p.status === 'COMPLETED') completedTopicsCount++;
      else if (p.status === 'IN_PROGRESS') inProgressTopicsCount++;

      if (p.notesRead) notesReadCount++;
      if (p.labCompleted) labsCompletedCount++;
      if (p.quizPassed) quizzesPassedCount++;
      totalTimeSpentSeconds += p.timeSpentSeconds || 0;
    });

    const overallPercentage = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

    // Recent Quiz attempts
    const recentQuizzes = await prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        topic: { select: { title: true, topicNumber: true } }
      }
    });

    const averageQuizScore = recentQuizzes.length > 0
      ? Math.round(recentQuizzes.reduce((sum, q) => sum + q.score, 0) / recentQuizzes.length)
      : 0;

    // Pending lab cleanups
    const pendingCleanups = await prisma.labCleanupRecord.count({
      where: { userId, status: 'PENDING' }
    });

    // Recent learning activities
    const recentActivities = await prisma.learningActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 6
    });

    // Spaced repetition due reviews
    const dueRevisions = await prisma.revisionSchedule.count({
      where: {
        userId,
        status: 'DUE',
        nextReviewDate: { lte: new Date() }
      }
    });

    res.json({
      success: true,
      stats: {
        overallPercentage,
        totalTopics,
        completedTopicsCount,
        inProgressTopicsCount,
        notesReadCount,
        labsCompletedCount,
        quizzesPassedCount,
        averageQuizScore,
        streakDays: req.user.streakDays || 1,
        totalTimeSpentMinutes: Math.round(totalTimeSpentSeconds / 60),
        pendingCleanups,
        dueRevisions
      },
      recentQuizzes,
      recentActivities: recentActivities.map(a => ({
        id: a.id,
        actionType: a.actionType,
        metadata: a.metadataJson ? JSON.parse(a.metadataJson) : {},
        createdAt: a.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
};

exports.getProgressAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const allTopics = await prisma.topic.findMany({
      include: {
        module: { select: { title: true, moduleNumber: true } },
        userProgress: {
          where: { userId }
        },
        quizAttempts: {
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { topicNumber: 'asc' }
    });

    const topicMastery = allTopics.map(t => {
      const progress = t.userProgress[0];
      const latestQuiz = t.quizAttempts[0];

      let score = 0;
      if (progress?.notesRead) score += 30;
      if (progress?.labCompleted) score += 35;
      if (progress?.quizPassed) score += 35;

      return {
        topicId: t.id,
        topicNumber: t.topicNumber,
        title: t.title,
        moduleNumber: t.module.moduleNumber,
        moduleTitle: t.module.title,
        status: progress ? progress.status : 'NOT_STARTED',
        masteryPercentage: score,
        notesRead: progress ? progress.notesRead : false,
        labCompleted: progress ? progress.labCompleted : false,
        quizPassed: progress ? progress.quizPassed : false,
        latestQuizScore: latestQuiz ? latestQuiz.score : null
      };
    });

    // Identify weak topics (attempted quiz with score < 70 or in progress with low mastery)
    const weakTopics = topicMastery.filter(t => (t.latestQuizScore !== null && t.latestQuizScore < 70) || (t.status === 'IN_PROGRESS' && t.masteryPercentage < 50));

    res.json({
      success: true,
      topicMastery,
      weakTopics
    });
  } catch (err) {
    next(err);
  }
};

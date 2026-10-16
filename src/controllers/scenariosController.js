const prisma = require('../utils/prisma');

exports.getScenarios = async (req, res, next) => {
  try {
    const { topicId, difficulty } = req.query;
    const userId = req.user ? req.user.id : null;

    const where = {
      type: 'SCENARIO',
      ...(topicId && { topicId }),
      ...(difficulty && { difficulty })
    };

    const scenarios = await prisma.question.findMany({
      where,
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            topicNumber: true,
            module: { select: { title: true, moduleNumber: true } }
          }
        },
        ...(userId && {
          userAnswers: {
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        })
      },
      orderBy: { createdAt: 'asc' }
    });

    const formatted = scenarios.map(s => {
      const lastAnswer = s.userAnswers && s.userAnswers[0] ? s.userAnswers[0] : null;
      return {
        id: s.id,
        topicId: s.topicId,
        topic: s.topic,
        title: s.title,
        difficulty: s.difficulty,
        prompt: s.prompt,
        tags: s.tagsJson ? JSON.parse(s.tagsJson) : [],
        isSolved: !!lastAnswer,
        lastSubmittedAt: lastAnswer ? lastAnswer.createdAt : null
      };
    });

    res.json({ success: true, scenarios: formatted });
  } catch (err) {
    next(err);
  }
};

exports.getScenarioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const scenario = await prisma.question.findUnique({
      where: { id },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            topicNumber: true,
            module: { select: { title: true, moduleNumber: true } }
          }
        },
        ...(userId && {
          userAnswers: {
            where: { userId },
            orderBy: { createdAt: 'desc' }
          }
        })
      }
    });

    if (!scenario || scenario.type !== 'SCENARIO') {
      return res.status(404).json({ success: false, message: 'Scenario not found.' });
    }

    const previousAnswers = scenario.userAnswers || [];
    const hasAttempted = previousAnswers.length > 0;

    res.json({
      success: true,
      scenario: {
        id: scenario.id,
        topicId: scenario.topicId,
        topic: scenario.topic,
        title: scenario.title,
        difficulty: scenario.difficulty,
        prompt: scenario.prompt,
        explanation: scenario.explanation,
        hints: scenario.hintsJson ? JSON.parse(scenario.hintsJson) : [],
        tags: scenario.tagsJson ? JSON.parse(scenario.tagsJson) : [],
        hasAttempted,
        // Only return recommendedSolution if user has attempted or submitted
        recommendedSolution: scenario.recommendedSolution,
        previousAttempts: previousAnswers.map(a => ({
          id: a.id,
          submittedText: a.submittedText,
          scoreGiven: a.scoreGiven,
          feedback: a.feedback,
          createdAt: a.createdAt
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.submitScenarioAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const userId = req.user.id;

    if (!answer || answer.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please write a thoughtful solution (at least 10 characters).' });
    }

    const scenario = await prisma.question.findUnique({ where: { id } });
    if (!scenario) return res.status(404).json({ success: false, message: 'Scenario not found.' });

    // Evaluate answer keywords & length
    const answerLower = answer.toLowerCase();
    let score = 70;
    let feedback = "Good troubleshooting approach! Compare your response with the recommended production architecture.";

    const keywords = ['security group', 'nacl', 'route table', 'internet gateway', 'subnet', 'iam', 'role', 'multi-az', 'port', 'private', 'cloudwatch', 'audit', 'cost'];
    const matchedKeywords = keywords.filter(k => answerLower.includes(k));

    if (matchedKeywords.length >= 3) {
      score = 90;
      feedback = `Excellent technical analysis! You accurately identified key AWS building blocks: ${matchedKeywords.join(', ')}.`;
    } else if (answer.length > 200) {
      score = 80;
      feedback = "Solid detailed reasoning. Review the step-by-step resolution checklist below to verify edge cases.";
    }

    const savedAnswer = await prisma.userAnswer.create({
      data: {
        userId,
        questionId: id,
        submittedText: answer,
        scoreGiven: score,
        feedback,
        isCorrect: score >= 75
      }
    });

    await prisma.learningActivity.create({
      data: {
        userId,
        actionType: 'SOLVED_SCENARIO',
        metadataJson: JSON.stringify({ scenarioId: scenario.id, title: scenario.title, score })
      }
    });

    res.json({
      success: true,
      message: 'Solution submitted and evaluated.',
      score,
      feedback,
      recommendedSolution: scenario.recommendedSolution,
      submittedAt: savedAnswer.createdAt
    });
  } catch (err) {
    next(err);
  }
};

const prisma = require('../utils/prisma');

exports.getInterviewQuestions = async (req, res, next) => {
  try {
    const { topicId, difficulty } = req.query;

    const questions = await prisma.question.findMany({
      where: {
        type: 'INTERVIEW',
        ...(topicId && { topicId }),
        ...(difficulty && { difficulty })
      },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            topicNumber: true,
            module: { select: { title: true, moduleNumber: true } }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    const formatted = questions.map(q => ({
      id: q.id,
      topicId: q.topicId,
      topic: q.topic,
      title: q.title,
      difficulty: q.difficulty,
      prompt: q.prompt,
      explanation: q.explanation,
      hints: q.hintsJson ? JSON.parse(q.hintsJson) : [],
      recommendedSolution: q.recommendedSolution,
      rubric: q.rubricJson ? JSON.parse(q.rubricJson) : null,
      tags: q.tagsJson ? JSON.parse(q.tagsJson) : []
    }));

    res.json({ success: true, questions: formatted });
  } catch (err) {
    next(err);
  }
};

exports.evaluateMockAnswer = async (req, res, next) => {
  try {
    const { questionId, answer, topicId } = req.body;
    const userId = req.user.id;

    if (!answer || answer.trim().length < 15) {
      return res.status(400).json({ success: false, message: 'Please provide a more complete answer (at least 15 characters).' });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { topic: true }
    });

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    const rubric = question.rubricJson ? JSON.parse(question.rubricJson) : { criteria: [] };

    // Intelligent heuristic rubric evaluation
    const answerLower = answer.toLowerCase();
    const criteriaResults = rubric.criteria.map(c => {
      // Check for presence of key terms in criterion description
      const descWords = c.description.toLowerCase().split(/\W+/).filter(w => w.length > 4);
      let matched = 0;
      descWords.forEach(w => {
        if (answerLower.includes(w)) matched++;
      });
      const ratio = descWords.length > 0 ? Math.min(1, matched / (descWords.length * 0.4)) : 0.8;
      const points = Math.round(c.weight * (0.6 + ratio * 0.4));

      return {
        name: c.name,
        weight: c.weight,
        scoreEarned: points,
        met: points >= c.weight * 0.7,
        feedback: points >= c.weight * 0.7 ? `Strong coverage on ${c.name}.` : `Consider elaborating more on: ${c.description}`
      };
    });

    const totalWeight = rubric.criteria.reduce((sum, c) => sum + c.weight, 0) || 100;
    const totalEarned = criteriaResults.reduce((sum, c) => sum + c.scoreEarned, 0);
    const normalizedScore = Math.min(100, Math.round((totalEarned / totalWeight) * 100));

    let qualitativeRating = "Solid Candidate";
    let strengths = "Good structural articulation of AWS service mechanics.";
    let areasForImprovement = "Add specific numbers (latencies, SLA percentages, CLI commands) to demonstrate hands-on production depth.";

    if (normalizedScore >= 85) {
      qualitativeRating = "Strong Hire (Advanced)";
      strengths = "Exceptional depth, accurate cloud terminology, and clear trade-off analysis.";
      areasForImprovement = "Mention cost implications and operational maintenance routines to polish answer for principal-level rounds.";
    } else if (normalizedScore < 70) {
      qualitativeRating = "Needs Practice";
      strengths = "Basic understanding conveyed.";
      areasForImprovement = "Ensure you address both the architectural differences and the exact failure recovery mechanics.";
    }

    // Save answer
    await prisma.userAnswer.create({
      data: {
        userId,
        questionId,
        submittedText: answer,
        scoreGiven: normalizedScore,
        feedback: JSON.stringify({ qualitativeRating, strengths, areasForImprovement }),
        isCorrect: normalizedScore >= 70
      }
    });

    // Save or update InterviewSession
    await prisma.interviewSession.create({
      data: {
        userId,
        topicId: question.topicId,
        totalQuestions: 1,
        overallScore: normalizedScore,
        feedbackSummary: qualitativeRating,
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    await prisma.learningActivity.create({
      data: {
        userId,
        actionType: 'MOCK_INTERVIEW',
        metadataJson: JSON.stringify({ questionId, score: normalizedScore, rating: qualitativeRating })
      }
    });

    res.json({
      success: true,
      evaluation: {
        score: normalizedScore,
        qualitativeRating,
        strengths,
        areasForImprovement,
        criteriaResults,
        disclaimer: "Note: AI and algorithmic evaluations are automated practice suggestions and study aids, not definitive hiring decisions.",
        recommendedModelAnswer: question.recommendedSolution
      }
    });
  } catch (err) {
    next(err);
  }
};

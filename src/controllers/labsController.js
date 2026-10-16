const prisma = require('../utils/prisma');

exports.getLab = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const lab = await prisma.lab.findFirst({
      where: {
        OR: [
          { id },
          { topicId: id },
          { topic: { slug: id } }
        ]
      },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            topicNumber: true,
            module: { select: { title: true, moduleNumber: true } }
          }
        },
        steps: {
          orderBy: { stepNumber: 'asc' }
        },
        ...(userId && {
          userProgress: {
            where: { userId }
          },
          cleanupRecords: {
            where: { userId }
          }
        })
      }
    });

    if (!lab) {
      return res.status(404).json({ success: false, message: 'Lab not found.' });
    }

    const progress = lab.userProgress && lab.userProgress[0] ? lab.userProgress[0] : null;
    let completedSteps = [];
    if (progress && progress.completedStepsJson) {
      try {
        completedSteps = JSON.parse(progress.completedStepsJson);
      } catch (e) {
        completedSteps = [];
      }
    }

    res.json({
      success: true,
      lab: {
        id: lab.id,
        topicId: lab.topicId,
        topic: lab.topic,
        title: lab.title,
        level: lab.level,
        estimatedMinutes: lab.estimatedMinutes,
        freeTierEligible: lab.freeTierEligible,
        costRiskLevel: lab.costRiskLevel,
        paidAlternativeWarning: lab.paidAlternativeWarning,
        prerequisites: lab.prerequisites,
        requiredPermissions: lab.requiredPermissions,
        cleanupGuide: lab.cleanupGuide,
        safeSimulationScript: lab.safeSimulationScript,
        steps: lab.steps,
        userProgress: {
          status: progress ? progress.status : 'NOT_STARTED',
          completedSteps,
          isCleanedUp: progress ? progress.isCleanedUp : false,
          cleanupRecords: lab.cleanupRecords || []
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.toggleStep = async (req, res, next) => {
  try {
    const { id, stepNumber } = req.params;
    const userId = req.user.id;
    const stepNum = parseInt(stepNumber);

    const lab = await prisma.lab.findUnique({
      where: { id },
      include: { steps: true }
    });
    if (!lab) return res.status(404).json({ success: false, message: 'Lab not found.' });

    let labProgress = await prisma.userLabProgress.findUnique({
      where: { userId_labId: { userId, labId: id } }
    });

    let completedSteps = [];
    if (labProgress && labProgress.completedStepsJson) {
      try {
        completedSteps = JSON.parse(labProgress.completedStepsJson);
      } catch (e) {
        completedSteps = [];
      }
    }

    const index = completedSteps.indexOf(stepNum);
    if (index > -1) {
      completedSteps.splice(index, 1);
    } else {
      completedSteps.push(stepNum);
    }

    const allStepsCompleted = lab.steps.length > 0 && completedSteps.length >= lab.steps.length;
    const status = allStepsCompleted ? 'COMPLETED' : 'IN_PROGRESS';

    labProgress = await prisma.userLabProgress.upsert({
      where: { userId_labId: { userId, labId: id } },
      update: {
        completedStepsJson: JSON.stringify(completedSteps),
        status,
        ...(allStepsCompleted && { completedAt: new Date() })
      },
      create: {
        userId,
        labId: id,
        completedStepsJson: JSON.stringify(completedSteps),
        status,
        ...(allStepsCompleted && { completedAt: new Date() })
      }
    });

    if (allStepsCompleted) {
      // Update overall UserTopicProgress
      await prisma.userTopicProgress.upsert({
        where: { userId_topicId: { userId, topicId: lab.topicId } },
        update: {
          labCompleted: true,
          status: 'IN_PROGRESS'
        },
        create: {
          userId,
          topicId: lab.topicId,
          labCompleted: true,
          status: 'IN_PROGRESS'
        }
      });

      await prisma.learningActivity.create({
        data: {
          userId,
          actionType: 'COMPLETED_LAB',
          metadataJson: JSON.stringify({ labId: lab.id, title: lab.title })
        }
      });
    }

    res.json({
      success: true,
      message: 'Step updated successfully.',
      completedSteps,
      status: labProgress.status
    });
  } catch (err) {
    next(err);
  }
};

exports.markCleanupComplete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const labProgress = await prisma.userLabProgress.upsert({
      where: { userId_labId: { userId, labId: id } },
      update: { isCleanedUp: true },
      create: {
        userId,
        labId: id,
        isCleanedUp: true,
        status: 'IN_PROGRESS'
      }
    });

    // Mark any cleanup records as VERIFIED
    await prisma.labCleanupRecord.updateMany({
      where: { userId, labId: id },
      data: { status: 'VERIFIED', verifiedAt: new Date() }
    });

    res.json({ success: true, message: 'Resource cleanup verified and logged.', isCleanedUp: true });
  } catch (err) {
    next(err);
  }
};

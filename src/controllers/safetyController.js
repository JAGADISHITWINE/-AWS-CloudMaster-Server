const prisma = require('../utils/prisma');

exports.getSafetyCenterData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let settings = await prisma.budgetSafetySetting.findUnique({
      where: { userId }
    });

    if (!settings) {
      settings = await prisma.budgetSafetySetting.create({
        data: {
          userId,
          monthlyBudgetLimit: 5.0,
          alertEmail: req.user.email,
          isFreeTierOnlyMode: true
        }
      });
    }

    // Fetch all user cleanup records
    const cleanupRecords = await prisma.labCleanupRecord.findMany({
      where: { userId },
      include: {
        lab: { select: { title: true, costRiskLevel: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // High cost risk resources warning checklist
    const commonCostPitfalls = [
      {
        resource: "NAT Gateway",
        hourlyCost: "$0.045 / hr (~$32.40 / mo)",
        freeTierEligible: false,
        warning: "NOT included in Free Tier. Even 1 idle NAT Gateway costs ~$32/month. Always use local simulations or delete immediately."
      },
      {
        resource: "Public IPv4 Addresses",
        hourlyCost: "$0.005 / hr (~$3.60 / mo per IP)",
        freeTierEligible: "750 hours/month for Free Tier EC2 only",
        warning: "Unattached Elastic IPs or multiple public IPs incur charges per hour."
      },
      {
        resource: "Application Load Balancer (ALB)",
        hourlyCost: "$0.0225 / hr (~$16.20 / mo)",
        freeTierEligible: "750 hours for 12 months",
        warning: "Shareable free tier hours during year 1, but delete after labs to prevent accidental overages."
      },
      {
        resource: "Multi-AZ RDS Database",
        hourlyCost: "Double standard db.t3.micro rate",
        freeTierEligible: false,
        warning: "Multi-AZ runs two DB instances simultaneously and is NOT covered under the 750 free Single-AZ hours."
      },
      {
        resource: "EKS Control Plane",
        hourlyCost: "$0.10 / hr (~$73.00 / mo)",
        freeTierEligible: false,
        warning: "EKS cluster control plane incurs strict hourly charges. Use ECS or local Minikube for learning."
      }
    ];

    res.json({
      success: true,
      settings,
      cleanupRecords,
      commonCostPitfalls,
      officialLinks: {
        awsFreeTierGuide: "https://aws.amazon.com/free/",
        awsBillingDashboard: "https://console.aws.amazon.com/billing/home",
        awsBudgetsConsole: "https://console.aws.amazon.com/billing/home#/budgets",
        awsCostExplorer: "https://console.aws.amazon.com/costmanagement/home#/cost-explorer"
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSafetySettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { monthlyBudgetLimit, alertEmail, isFreeTierOnlyMode } = req.body;

    const updated = await prisma.budgetSafetySetting.upsert({
      where: { userId },
      update: {
        ...(monthlyBudgetLimit !== undefined && { monthlyBudgetLimit: parseFloat(monthlyBudgetLimit) }),
        ...(alertEmail && { alertEmail }),
        ...(isFreeTierOnlyMode !== undefined && { isFreeTierOnlyMode: Boolean(isFreeTierOnlyMode) }),
        lastChecked: new Date()
      },
      create: {
        userId,
        monthlyBudgetLimit: parseFloat(monthlyBudgetLimit) || 5.0,
        alertEmail: alertEmail || req.user.email,
        isFreeTierOnlyMode: isFreeTierOnlyMode !== undefined ? Boolean(isFreeTierOnlyMode) : true
      }
    });

    res.json({ success: true, message: 'Free tier safety settings updated.', settings: updated });
  } catch (err) {
    next(err);
  }
};

exports.verifyCleanup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const record = await prisma.labCleanupRecord.findFirst({
      where: { id, userId }
    });

    if (!record) return res.status(404).json({ success: false, message: 'Cleanup record not found.' });

    const updated = await prisma.labCleanupRecord.update({
      where: { id },
      data: {
        status: 'VERIFIED',
        verifiedAt: new Date()
      }
    });

    res.json({ success: true, message: 'Resource cleanup status verified.', record: updated });
  } catch (err) {
    next(err);
  }
};

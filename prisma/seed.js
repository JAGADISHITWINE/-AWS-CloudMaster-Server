const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const modulesData = require('./data/modulesData');
const notesData = require('./data/notesData');
const labsData = require('./data/labsData');
const scenariosData = require('./data/scenariosData');
const interviewsData = require('./data/interviewsData');
const quizzesData = require('./data/quizzesData');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for AWS Learning Platform...');

  // 1. Create or upsert default learner user
  const passwordHash = await bcrypt.hash('AwsCloudPass123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'learner@example.com' },
    update: {},
    create: {
      email: 'learner@example.com',
      passwordHash,
      name: 'Cloud Engineer',
      role: 'USER',
      dailyGoalMinutes: 45,
      streakDays: 3,
      lastActiveDate: new Date()
    }
  });
  console.log(`👤 User ready: ${user.email} (Password: AwsCloudPass123!)`);

  // 2. Upsert Budget Safety Settings
  await prisma.budgetSafetySetting.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      monthlyBudgetLimit: 5.0,
      alertEmail: 'learner@example.com',
      currentEstimatedSpend: 0.0,
      isFreeTierOnlyMode: true
    }
  });

  // Map to store topic IDs by moduleNumber
  const topicMap = {};

  // 3. Seed Modules, Topics, Notes, and Labs
  for (const mod of modulesData) {
    const learningModule = await prisma.learningModule.upsert({
      where: { moduleNumber: mod.moduleNumber },
      update: {
        title: mod.title,
        slug: mod.slug,
        description: mod.description,
        icon: mod.icon,
        level: mod.level
      },
      create: {
        moduleNumber: mod.moduleNumber,
        title: mod.title,
        slug: mod.slug,
        description: mod.description,
        icon: mod.icon,
        level: mod.level
      }
    });

    for (const t of mod.topics) {
      const topic = await prisma.topic.upsert({
        where: { slug: t.slug },
        update: {
          title: t.title,
          summary: t.summary,
          difficulty: t.difficulty,
          estimatedMinutes: t.estimatedMinutes,
          keyTakeaway: t.keyTakeaway
        },
        create: {
          moduleId: learningModule.id,
          topicNumber: t.topicNumber,
          title: t.title,
          slug: t.slug,
          summary: t.summary,
          difficulty: t.difficulty,
          estimatedMinutes: t.estimatedMinutes,
          keyTakeaway: t.keyTakeaway
        }
      });

      topicMap[mod.moduleNumber] = topic.id;

      // Seed TopicNote
      const note = notesData[mod.moduleNumber];
      if (note) {
        await prisma.topicNote.upsert({
          where: { topicId: topic.id },
          update: {
            simpleExplanation: note.simpleExplanation,
            coreConceptsJson: note.coreConceptsJson,
            internalsExplanation: note.internalsExplanation,
            architectureSvg: note.architectureSvg,
            cliExamplesJson: note.cliExamplesJson,
            bestPracticesJson: note.bestPracticesJson,
            securityNotes: note.securityNotes,
            costImplications: note.costImplications,
            commonMistakesJson: note.commonMistakesJson,
            quickRevisionJson: note.quickRevisionJson
          },
          create: {
            topicId: topic.id,
            simpleExplanation: note.simpleExplanation,
            coreConceptsJson: note.coreConceptsJson,
            internalsExplanation: note.internalsExplanation,
            architectureSvg: note.architectureSvg,
            cliExamplesJson: note.cliExamplesJson,
            bestPracticesJson: note.bestPracticesJson,
            securityNotes: note.securityNotes,
            costImplications: note.costImplications,
            commonMistakesJson: note.commonMistakesJson,
            quickRevisionJson: note.quickRevisionJson
          }
        });
      }

      // Seed Lab
      const lab = labsData[mod.moduleNumber];
      if (lab) {
        const existingLab = await prisma.lab.findFirst({ where: { topicId: topic.id } });
        let createdLab = existingLab;
        if (!existingLab) {
          createdLab = await prisma.lab.create({
            data: {
              topicId: topic.id,
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
              steps: {
                create: lab.steps.map(s => ({
                  stepNumber: s.stepNumber,
                  title: s.title,
                  description: s.description,
                  consoleInstruction: s.consoleInstruction,
                  cliCommand: s.cliCommand,
                  expectedOutput: s.expectedOutput,
                  verificationTip: s.verificationTip,
                  troubleshooting: s.troubleshooting
                }))
              }
            }
          });

          // Add a sample cleanup tracker record for the user
          await prisma.labCleanupRecord.create({
            data: {
              userId: user.id,
              labId: createdLab.id,
              resourceName: `lab-${mod.moduleNumber}-resource-check`,
              serviceName: mod.title.split(' ')[0],
              region: 'us-east-1',
              status: 'VERIFIED',
              verifiedAt: new Date()
            }
          });
        }
      }
    }
  }
  console.log('✅ 20 Modules, Topics, Notes, and Practical Labs seeded.');

  // 4. Seed Scenarios
  for (const s of scenariosData) {
    const topicId = topicMap[s.moduleNumber];
    if (topicId) {
      const existing = await prisma.question.findFirst({
        where: { topicId, title: s.title }
      });
      if (!existing) {
        await prisma.question.create({
          data: {
            topicId,
            type: 'SCENARIO',
            difficulty: s.difficulty,
            title: s.title,
            prompt: s.prompt,
            explanation: s.explanation,
            hintsJson: s.hintsJson,
            recommendedSolution: s.recommendedSolution,
            tagsJson: s.tagsJson
          }
        });
      }
    }
  }
  console.log('✅ Real-world Troubleshooting Scenarios seeded.');

  // 5. Seed Interview Questions
  for (const i of interviewsData) {
    const topicId = topicMap[i.moduleNumber];
    if (topicId) {
      const existing = await prisma.question.findFirst({
        where: { topicId, title: i.title }
      });
      if (!existing) {
        await prisma.question.create({
          data: {
            topicId,
            type: 'INTERVIEW',
            difficulty: i.difficulty,
            title: i.title,
            prompt: i.prompt,
            explanation: i.explanation,
            hintsJson: i.hintsJson,
            rubricJson: i.rubricJson,
            recommendedSolution: i.recommendedSolution,
            tagsJson: i.tagsJson
          }
        });
      }
    }
  }
  console.log('✅ AWS & DevOps Technical Interview Questions & Rubrics seeded.');

  // 6. Seed Quiz Assessments
  for (const q of quizzesData) {
    const topicId = topicMap[q.moduleNumber];
    if (topicId) {
      const existing = await prisma.question.findFirst({
        where: { topicId, title: q.title }
      });
      if (!existing) {
        await prisma.question.create({
          data: {
            topicId,
            type: q.type,
            difficulty: q.difficulty,
            title: q.title,
            prompt: q.prompt,
            explanation: q.explanation,
            hintsJson: q.hintsJson,
            options: {
              create: q.options.map(o => ({
                optionKey: o.optionKey,
                optionText: o.optionText,
                isCorrect: o.isCorrect
              }))
            }
          }
        });
      }
    }
  }
  console.log('✅ Topic Quizzes, Assessments & Options seeded.');

  // 7. Seed initial User Progress to demonstrate dynamic progress tracking immediately
  const topic1Id = topicMap[1];
  const topic2Id = topicMap[2];

  if (topic1Id) {
    await prisma.userTopicProgress.upsert({
      where: { userId_topicId: { userId: user.id, topicId: topic1Id } },
      update: {},
      create: {
        userId: user.id,
        topicId: topic1Id,
        status: 'COMPLETED',
        notesRead: true,
        labCompleted: true,
        quizPassed: true,
        timeSpentSeconds: 1850,
        completedAt: new Date()
      }
    });

    await prisma.learningActivity.create({
      data: {
        userId: user.id,
        actionType: 'COMPLETED_TOPIC',
        metadataJson: JSON.stringify({ topicNumber: 1, title: 'AWS Global Infrastructure' })
      }
    });
  }

  if (topic2Id) {
    await prisma.userTopicProgress.upsert({
      where: { userId_topicId: { userId: user.id, topicId: topic2Id } },
      update: {},
      create: {
        userId: user.id,
        topicId: topic2Id,
        status: 'IN_PROGRESS',
        notesRead: true,
        labCompleted: false,
        quizPassed: false,
        timeSpentSeconds: 940
      }
    });
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

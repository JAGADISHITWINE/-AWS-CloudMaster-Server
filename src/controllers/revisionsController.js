const prisma = require('../utils/prisma');

exports.getDueRevisions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const schedules = await prisma.revisionSchedule.findMany({
      where: {
        userId
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
      },
      orderBy: { nextReviewDate: 'asc' }
    });

    res.json({ success: true, revisions: schedules });
  } catch (err) {
    next(err);
  }
};

exports.completeRevision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { easeRating = 3 } = req.body; // 1 (hard), 2 (good), 3 (easy)
    const userId = req.user.id;

    const schedule = await prisma.revisionSchedule.findFirst({
      where: { id, userId }
    });

    if (!schedule) return res.status(404).json({ success: false, message: 'Revision schedule not found.' });

    // Spaced repetition interval calculation
    let nextInterval = schedule.intervalDays || 1;
    if (easeRating === 1) nextInterval = 1;
    else if (easeRating === 2) nextInterval = Math.round(nextInterval * 1.5) + 1;
    else nextInterval = Math.round(nextInterval * 2.2) + 2;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextInterval);

    const updated = await prisma.revisionSchedule.update({
      where: { id },
      data: {
        nextReviewDate: nextDate,
        intervalDays: nextInterval,
        repetitions: { increment: 1 },
        status: 'COMPLETED'
      }
    });

    res.json({ success: true, message: `Revision recorded! Next review in ${nextInterval} days.`, schedule: updated });
  } catch (err) {
    next(err);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, bookmarks });
  } catch (err) {
    next(err);
  }
};

exports.toggleBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemType, itemId, notes } = req.body;

    if (!itemType || !itemId) {
      return res.status(400).json({ success: false, message: 'itemType and itemId are required.' });
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_itemType_itemId: { userId, itemType, itemId }
      }
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return res.json({ success: true, message: 'Bookmark removed.', isBookmarked: false });
    } else {
      const created = await prisma.bookmark.create({
        data: {
          userId,
          itemType,
          itemId,
          notes: notes || null
        }
      });
      return res.json({ success: true, message: 'Bookmark added.', isBookmarked: true, bookmark: created });
    }
  } catch (err) {
    next(err);
  }
};

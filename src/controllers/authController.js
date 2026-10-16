const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const { JWT_SECRET } = require('../middleware/auth');

exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        safetySettings: {
          create: {
            monthlyBudgetLimit: 5.0,
            alertEmail: email.toLowerCase(),
            isFreeTierOnlyMode: true
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        streakDays: true,
        dailyGoalMinutes: true
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        safetySettings: true
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update streak and last active
    const today = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    let newStreak = user.streakDays || 1;

    if (lastActive) {
      const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        streakDays: newStreak,
        lastActiveDate: today
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        streakDays: newStreak,
        dailyGoalMinutes: user.dailyGoalMinutes,
        targetDate: user.targetDate,
        safetySettings: user.safetySettings
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        streakDays: true,
        dailyGoalMinutes: true,
        targetDate: true,
        safetySettings: true,
        createdAt: true
      }
    });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, dailyGoalMinutes, targetDate } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(dailyGoalMinutes && { dailyGoalMinutes: parseInt(dailyGoalMinutes) }),
        ...(targetDate && { targetDate: new Date(targetDate) })
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        streakDays: true,
        dailyGoalMinutes: true,
        targetDate: true
      }
    });

    res.json({ success: true, message: 'Profile updated.', user: updated });
  } catch (err) {
    next(err);
  }
};

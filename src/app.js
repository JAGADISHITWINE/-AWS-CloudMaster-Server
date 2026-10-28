const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const modulesRoutes = require('./routes/modules');
const notesRoutes = require('./routes/notes');
const labsRoutes = require('./routes/labs');
const scenariosRoutes = require('./routes/scenarios');
const interviewsRoutes = require('./routes/interviews');
const quizzesRoutes = require('./routes/quizzes');
const progressRoutes = require('./routes/progress');
const safetyRoutes = require('./routes/safety');
const revisionsRoutes = require('./routes/revisions');
const aiRoutes = require('./routes/ai');

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Rate limiting for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' }
});
app.use('/api/auth', authLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AWS Learning and Practice Platform API',
    database: 'MySQL (Prisma ORM)'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/labs', labsRoutes);
app.use('/api/scenarios', scenariosRoutes);
app.use('/api/interviews', interviewsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/revisions', revisionsRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

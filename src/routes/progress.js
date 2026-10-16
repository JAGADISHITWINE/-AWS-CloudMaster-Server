const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticate } = require('../middleware/auth');

router.get('/dashboard', authenticate, progressController.getDashboardSummary);
router.get('/analytics', authenticate, progressController.getProgressAnalytics);

module.exports = router;

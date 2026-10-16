const express = require('express');
const router = express.Router();
const labsController = require('../controllers/labsController');
const { authenticate, optionalAuth } = require('../middleware/auth');

router.get('/:id', optionalAuth, labsController.getLab);
router.post('/:id/steps/:stepNumber', authenticate, labsController.toggleStep);
router.post('/:id/cleanup', authenticate, labsController.markCleanupComplete);

module.exports = router;

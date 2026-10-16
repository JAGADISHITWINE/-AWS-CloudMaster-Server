const express = require('express');
const router = express.Router();
const safetyController = require('../controllers/safetyController');
const { authenticate } = require('../middleware/auth');

router.get('/center', authenticate, safetyController.getSafetyCenterData);
router.put('/settings', authenticate, safetyController.updateSafetySettings);
router.post('/cleanup/:id/verify', authenticate, safetyController.verifyCleanup);

module.exports = router;

const express = require('express');
const router = express.Router();
const scenariosController = require('../controllers/scenariosController');
const { authenticate, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, scenariosController.getScenarios);
router.get('/:id', optionalAuth, scenariosController.getScenarioById);
router.post('/:id/submit', authenticate, scenariosController.submitScenarioAnswer);

module.exports = router;

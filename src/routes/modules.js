const express = require('express');
const router = express.Router();
const modulesController = require('../controllers/modulesController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, modulesController.getModules);
router.get('/topics/:id', optionalAuth, modulesController.getTopicById);

module.exports = router;

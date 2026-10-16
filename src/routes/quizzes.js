const express = require('express');
const router = express.Router();
const quizzesController = require('../controllers/quizzesController');
const { authenticate } = require('../middleware/auth');

router.get('/topic/:topicId', authenticate, quizzesController.getTopicQuiz);
router.post('/topic/:topicId/submit', authenticate, quizzesController.submitQuiz);

module.exports = router;

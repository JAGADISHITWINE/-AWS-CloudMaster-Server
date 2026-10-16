const express = require('express');
const router = express.Router();
const interviewsController = require('../controllers/interviewsController');
const { authenticate } = require('../middleware/auth');

router.get('/questions', interviewsController.getInterviewQuestions);
router.post('/evaluate', authenticate, interviewsController.evaluateMockAnswer);

module.exports = router;

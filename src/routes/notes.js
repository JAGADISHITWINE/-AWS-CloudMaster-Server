const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const { authenticate, optionalAuth } = require('../middleware/auth');

router.get('/:topicId', optionalAuth, notesController.getNotes);
router.post('/:topicId/read', authenticate, notesController.markNotesRead);

module.exports = router;

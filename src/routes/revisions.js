const express = require('express');
const router = express.Router();
const revisionsController = require('../controllers/revisionsController');
const { authenticate } = require('../middleware/auth');

router.get('/due', authenticate, revisionsController.getDueRevisions);
router.post('/complete/:id', authenticate, revisionsController.completeRevision);
router.get('/bookmarks', authenticate, revisionsController.getBookmarks);
router.post('/bookmarks/toggle', authenticate, revisionsController.toggleBookmark);

module.exports = router;

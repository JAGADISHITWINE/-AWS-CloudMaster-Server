const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Check Ollama status & connectivity
router.get('/health', aiController.getHealth);

// List available Ollama models or catalog
router.get('/models', aiController.getModels);

// Live interactive chat with AI Trainer
router.post('/chat', aiController.chat);

module.exports = router;

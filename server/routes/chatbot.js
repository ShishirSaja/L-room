const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/ask', authMiddleware, chatbotController.ask);

module.exports = router;
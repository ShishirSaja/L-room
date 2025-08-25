const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');

// Note: Multer is handled inside the controller for better error handling
router.post('/upload', authMiddleware, fileController.uploadFile);
router.get('/topic/:topicId/quiz', authMiddleware, fileController.getQuiz);
router.get('/topic/:topicId/flashcards', authMiddleware, fileController.getFlashcards);

module.exports = router;
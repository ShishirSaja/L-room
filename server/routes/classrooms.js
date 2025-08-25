const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, classroomController.createClassroom);
router.get('/', authMiddleware, classroomController.getClassrooms);
router.get('/:id', authMiddleware, classroomController.getClassroomById);

module.exports = router;
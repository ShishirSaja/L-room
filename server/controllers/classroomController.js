const db = require('../models');
const Classroom = db.Classroom;
const Document = db.Document;
const Topic = db.Topic;

exports.createClassroom = async (req, res) => {
    try {
        const { name } = req.body;
        const classroom = await Classroom.create({ name, userId: req.user.id });
        res.status(201).json(classroom);
    } catch (error) {
        res.status(500).json({ message: 'Error creating classroom.', error: error.message });
    }
};

exports.getClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.findAll({ where: { userId: req.user.id } });
        res.status(200).json(classrooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classrooms.', error: error.message });
    }
};

exports.getClassroomById = async (req, res) => {
    try {
        const classroom = await Classroom.findByPk(req.params.id, {
            include: [{
                model: Document,
                as: 'documents',
                include: [{
                    model: Topic,
                    as: 'topics'
                }]
            }]
        });
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found.' });
        }
        res.status(200).json(classroom);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classroom details.', error: error.message });
    }
};
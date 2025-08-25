const multer = require('multer');
const { processPdf } = require('../utils/pdfProcessor');
const { generateTopicsForText, generateQuizForTopic, generateFlashcardsForTopic } = require('../utils/gemini');
const db = require('../models');
const Document = db.Document;
const Topic = db.Topic;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

exports.uploadFile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ message: 'File upload failed.', error: err.message });
        try {
            const { classroomId } = req.body;
            if (!req.file) return res.status(400).json({ message: "No file uploaded." });

            const textContent = await processPdf(req.file.buffer);
            const document = await Document.create({
                fileName: req.file.originalname,
                content: textContent,
                classroomId: classroomId,
            });

            const topics = await generateTopicsForText(textContent);
            const topicCreationPromises = topics.map(topicName => Topic.create({ name: topicName, documentId: document.id }));
            await Promise.all(topicCreationPromises);

            res.status(201).json({ message: 'File uploaded and processed successfully.', documentId: document.id, topics });
        } catch (error) {
            res.status(500).json({ message: 'Error processing file.', error: error.message });
        }
    });
};

exports.getQuiz = async (req, res) => {
    try {
        const topic = await Topic.findByPk(req.params.topicId, { include: { model: Document, as: 'document' }});
        if (!topic) return res.status(404).json({ message: 'Topic not found.' });

        const quizData = await generateQuizForTopic(topic.name, topic.document.content);
        res.status(200).json(quizData);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz.', error: error.message });
    }
};

exports.getFlashcards = async (req, res) => {
    try {
        const topic = await Topic.findByPk(req.params.topicId, { include: { model: Document, as: 'document' }});
        if (!topic) return res.status(404).json({ message: 'Topic not found.' });

        const flashcards = await generateFlashcardsForTopic(topic.name, topic.document.content);
        res.status(200).json(flashcards);
    } catch (error) {
        res.status(500).json({ message: 'Error creating flashcards.', error: error.message });
    }
};
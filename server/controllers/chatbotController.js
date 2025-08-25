const { answerQuestionFromDocument } = require('../utils/gemini');
const db = require('../models');
const Document = db.Document;

exports.ask = async (req, res) => {
    try {
        const { documentId, question } = req.body;
        const document = await Document.findByPk(documentId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found.' });
        }

        const answer = await answerQuestionFromDocument(question, document.content);
        res.status(200).json({ answer });
    } catch (error) {
        res.status(500).json({ message: 'Error getting answer from chatbot.', error: error.message });
    }
};
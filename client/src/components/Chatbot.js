import React, { useState } from 'react';
import api from '../services/api';

const Chatbot = ({ documentId }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;
        setLoading(true);
        setAnswer('');
        try {
            const response = await api.post('/chatbot/ask', { documentId, question });
            setAnswer(response.data.answer);
            setQuestion('');
        } catch (error) {
            setAnswer("Sorry, I couldn't get an answer. Please try again.");
            console.error("Error asking chatbot", error);
        }
        setLoading(false);
    };

    return (
        <div className="chatbot-panel">
            <div>
                <h4 style={{ margin: '0 0 4px' }}>Document Chatbot</h4>
                <small>Ask any question about this upload.</small>
            </div>
            <form className="chatbot-form" onSubmit={handleAsk}>
                <input
                    className="input-control"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask about key concepts, summaries, or definitions"
                />
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Asking...' : 'Ask'}
                </button>
            </form>
            {answer && (
                <div className="chatbot-answer">
                    <strong>Answer:</strong> {answer}
                </div>
            )}
        </div>
    );
};

export default Chatbot;
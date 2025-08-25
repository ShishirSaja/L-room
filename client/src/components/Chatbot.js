import React, { useState } from 'react';
import api from '../services/api';

const Chatbot = ({ documentId }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAnswer('');
        try {
            const response = await api.post('/chatbot/ask', { documentId, question });
            setAnswer(response.data.answer);
        } catch (error) {
            setAnswer("Sorry, I couldn't get an answer. Please try again.");
            console.error("Error asking chatbot", error);
        }
        setLoading(false);
    };

    return (
        <div style={{marginTop: '20px', padding: '20px', border: '1px solid orange'}}>
            <h4>Document Chatbot</h4>
            <form onSubmit={handleAsk}>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about this document"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Asking...' : 'Ask'}
                </button>
            </form>
            {answer && (
                <div>
                    <p><strong>Answer:</strong> {answer}</p>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
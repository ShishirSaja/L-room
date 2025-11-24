import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Quiz = ({ topicId }) => {
    const [quiz, setQuiz] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/files/topic/${topicId}/quiz`);
                setQuiz(response.data);
                setScore(null);
                setAnswers({});
            } catch (error) {
                console.error("Error fetching quiz", error);
            }
            setLoading(false);
        };
        fetchQuiz();
    }, [topicId]);

    const handleAnswerChange = (questionIndex, option) => {
        setAnswers({
            ...answers,
            [questionIndex]: option
        });
    };

    const handleSubmit = () => {
        let newScore = 0;
        quiz.forEach((q, index) => {
            if (answers[index] === q.answer) {
                newScore++;
            }
        });
        setScore(newScore);
    };

    if (loading) return <p>Loading quiz...</p>;
    if (!quiz.length) return <p>No quiz available for this topic.</p>;

    return (
        <div className="quiz-panel">
            <h4 style={{ marginTop: 0 }}>Quiz</h4>
            {score !== null ? (
                <div className="quiz-score">
                    <p>Great work!</p>
                    <h2>{score} / {quiz.length}</h2>
                    <button className="btn btn-secondary" onClick={() => setScore(null)}>
                        Retake quiz
                    </button>
                </div>
            ) : (
                <>
                    <div className="quiz-list">
                        {quiz.map((q, qIndex) => (
                            <div className="quiz-question" key={qIndex}>
                                <p>
                                    <strong>{qIndex + 1}.</strong> {q.question}
                                </p>
                                <div className="quiz-options">
                                    {Object.keys(q.options).map((optionKey) => (
                                        <label key={optionKey} className="quiz-option">
                                            <input
                                                type="radio"
                                                name={`question-${qIndex}`}
                                                value={optionKey}
                                                onChange={() => handleAnswerChange(qIndex, optionKey)}
                                                checked={answers[qIndex] === optionKey}
                                            />
                                            <span>
                                                {optionKey}. {q.options[optionKey]}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Submit quiz
                    </button>
                </>
            )}
        </div>
    );
};

export default Quiz;

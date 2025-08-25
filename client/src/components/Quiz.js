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
        <div style={{marginTop: '20px', padding: '20px', border: '1px solid green'}}>
            <h4>Quiz</h4>
            {score !== null ? (
                <div>
                    <h5>Your Score: {score} / {quiz.length}</h5>
                </div>
            ) : (
                <div>
                    {quiz.map((q, qIndex) => (
                        <div key={qIndex}>
                            <p>{qIndex + 1}. {q.question}</p>
                            {Object.keys(q.options).map(optionKey => (
                                <div key={optionKey}>
                                    <input
                                        type="radio"
                                        id={`q${qIndex}-${optionKey}`}
                                        name={`question-${qIndex}`}
                                        value={optionKey}
                                        onChange={() => handleAnswerChange(qIndex, optionKey)}
                                        checked={answers[qIndex] === optionKey}
                                    />
                                    <label htmlFor={`q${qIndex}-${optionKey}`}>{optionKey}: {q.options[optionKey]}</label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button onClick={handleSubmit}>Submit Quiz</button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
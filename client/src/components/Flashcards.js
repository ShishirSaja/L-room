import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Flashcards = ({ topicId }) => {
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashcards = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/files/topic/${topicId}/flashcards`);
                setFlashcards(response.data);
                setCurrentIndex(0);
                setIsFlipped(false);
            } catch (error) {
                console.error("Error fetching flashcards", error);
            }
            setLoading(false);
        };
        fetchFlashcards();
    }, [topicId]);

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    if (loading) return <p>Loading flashcards...</p>;
    if (!flashcards.length) return <p>No flashcards available for this topic.</p>;

    const currentCard = flashcards[currentIndex];

    return (
        <div className="flashcards-panel">
            <div className="flashcard" onClick={handleFlip}>
                {isFlipped ? currentCard.answer : currentCard.question}
            </div>
            <p style={{ margin: '16px 0 12px', color: 'var(--text-muted)' }}>
                Card {currentIndex + 1} of {flashcards.length} • tap to flip
            </p>
            <div className="segment-buttons">
                <button className="segment-button" onClick={handlePrev} disabled={currentIndex === 0}>
                    Previous
                </button>
                <button className="segment-button" onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Flashcards;

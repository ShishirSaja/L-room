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
        <div style={{marginTop: '20px', padding: '20px', border: '1px solid blue'}}>
            <h4>Flashcards</h4>
            <div onClick={handleFlip} style={{border: '1px solid black', padding: '20px', minHeight: '100px', cursor: 'pointer'}}>
                {isFlipped ? currentCard.answer : currentCard.question}
            </div>
            <p>Card {currentIndex + 1} of {flashcards.length}</p>
            <button onClick={handlePrev} disabled={currentIndex === 0}>Prev</button>
            <button onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>Next</button>
        </div>
    );
};

export default Flashcards;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Quiz from './Quiz';
import Flashcards from './Flashcards';
import Chatbot from './Chatbot';

const Classroom = () => {
    const { id } = useParams();
    const [classroom, setClassroom] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [activeUtil, setActiveUtil] = useState('quiz'); // 'quiz', 'flashcards'

    useEffect(() => {
        fetchClassroomData();
    }, [id]);

    const fetchClassroomData = async () => {
        try {
            const classRes = await api.get(`/classrooms/${id}`);
            setClassroom(classRes.data);
        } catch (error) {
            console.error("Error fetching classroom data", error);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('classroomId', id);
        try {
            await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchClassroomData(); // Refresh data
            setSelectedFile(null);
        } catch (error) {
            console.error("Error uploading file", error);
        }
    };

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
    };

    if (!classroom) return <div className="app-shell">Loading classroom...</div>;

    return (
        <div className="app-shell">
            <Link className="back-link" to="/dashboard">
                Back to dashboard
            </Link>

            <div className="page-header">
                <div>
                    <h2>{classroom.name}</h2>
                    <p>Upload PDFs, explore topics, and drill with interactive tools.</p>
                </div>
            </div>

            <div className="page-layout">
                <section className="section">
                    <h3>Documents & topics</h3>
                    <div className="upload-dropzone">
                        <p>Upload a new PDF to extract topics and power the learning tools.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input className="input-control" type="file" onChange={handleFileChange} accept=".pdf" />
                            <button className="btn btn-primary" onClick={handleFileUpload} disabled={!selectedFile}>
                                Upload PDF
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        {classroom.documents && classroom.documents.length > 0 ? (
                            classroom.documents.map((doc) => (
                                <div className="document-card" key={doc.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 4px' }}>{doc.fileName}</h4>
                                            <small>{doc.topics ? doc.topics.length : 0} topics detected</small>
                                        </div>
                                    </div>
                                    <div className="topics-list">
                                        {doc.topics && doc.topics.length > 0 ? (
                                            doc.topics.map((topic) => (
                                                <div
                                                    key={topic.id}
                                                    className={`topic-pill ${selectedTopic && selectedTopic.id === topic.id ? 'active' : ''}`}
                                                    onClick={() => handleTopicSelect(topic)}
                                                >
                                                    {topic.name}
                                                </div>
                                            ))
                                        ) : (
                                            <small style={{ color: 'var(--text-muted)' }}>No topics generated yet.</small>
                                        )}
                                    </div>
                                    <div className="tool-card" style={{ marginTop: '16px' }}>
                                        <Chatbot documentId={doc.id} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <h4>No documents uploaded yet</h4>
                                <p>Upload your first PDF to unlock quiz, flashcard, and chatbot tools.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="section">
                    <h3>Learning tools</h3>
                    {!selectedTopic ? (
                        <div className="empty-state" style={{ padding: '32px 20px' }}>
                            <p>Select a topic from the left to start practicing.</p>
                        </div>
                    ) : (
                        <>
                            <p style={{ marginTop: 0, color: 'var(--text-muted)' }}>
                                Working on <strong>{selectedTopic.name}</strong>
                            </p>
                            <div className="segment-buttons">
                                <button
                                    className={`segment-button ${activeUtil === 'quiz' ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => setActiveUtil('quiz')}
                                >
                                    Quiz
                                </button>
                                <button
                                    className={`segment-button ${activeUtil === 'flashcards' ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => setActiveUtil('flashcards')}
                                >
                                    Flashcards
                                </button>
                            </div>

                            <div className="tool-card">
                                {activeUtil === 'quiz' && <Quiz topicId={selectedTopic.id} />}
                                {activeUtil === 'flashcards' && <Flashcards topicId={selectedTopic.id} />}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Classroom;
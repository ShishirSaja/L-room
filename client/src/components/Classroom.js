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
    const [activeUtil, setActiveUtil] = useState(''); // 'quiz', 'flashcards', 'chatbot'

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
        } catch (error) {
            console.error("Error uploading file", error);
        }
    };

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
        setActiveUtil(''); // Reset active utility
    };

    if (!classroom) return <div>Loading classroom...</div>;

    return (
        <div>
            <Link to="/dashboard">Back to Dashboard</Link>
            <h2>{classroom.name}</h2>
            
            <h3>Upload New Document</h3>
            <input type="file" onChange={handleFileChange} accept=".pdf" />
            <button onClick={handleFileUpload}>Upload PDF</button>
            
            <hr />

            <h3>Documents and Topics</h3>
            {classroom.documents && classroom.documents.map(doc => (
                <div key={doc.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                    <h4>{doc.fileName}</h4>
                    <ul>
                        {doc.topics.map(topic => (
                            <li key={topic.id} onClick={() => handleTopicSelect(topic)} style={{cursor: 'pointer', color: 'blue'}}>
                                {topic.name}
                            </li>
                        ))}
                    </ul>
                     <Chatbot documentId={doc.id}/>
                </div>
            ))}
            
            <hr />

            {selectedTopic && (
                <div>
                    <h3>Selected Topic: {selectedTopic.name}</h3>
                    <button onClick={() => setActiveUtil('quiz')}>Take Quiz</button>
                    <button onClick={() => setActiveUtil('flashcards')}>Study Flashcards</button>
                    
                    {activeUtil === 'quiz' && <Quiz topicId={selectedTopic.id} />}
                    {activeUtil === 'flashcards' && <Flashcards topicId={selectedTopic.id} />}
                </div>
            )}
        </div>
    );
};

export default Classroom;
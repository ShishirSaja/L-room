import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [className, setClassName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const response = await api.get('/classrooms');
                setClassrooms(response.data);
            } catch (error) {
                console.error("Error fetching classrooms", error);
            }
        };
        fetchClassrooms();
    }, []);

    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/classrooms', { name: className });
            setClassrooms([...classrooms, response.data]);
            setClassName('');
        } catch (error) {
            console.error("Error creating classroom", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const totalDocuments = classrooms.reduce((sum, room) => {
        if (!room.documents) return sum;
        return sum + room.documents.length;
    }, 0);

    const totalTopics = classrooms.reduce((sum, room) => {
        if (!room.documents) return sum;
        const topicsInRoom = room.documents.reduce((topicSum, doc) => {
            if (!doc.topics) return topicSum;
            return topicSum + doc.topics.length;
        }, 0);
        return sum + topicsInRoom;
    }, 0);

    return (
        <div className="app-shell">
            <div className="surface-card">
                <div className="page-header">
                    <div>
                        <h2>Learning Room</h2>
                        <p>Simple hub to create classrooms and keep students engaged.</p>
                    </div>
                    <button className="btn btn-secondary" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                <div className="stats-row">
                    <div className="stat-card">
                        <h4>Classrooms</h4>
                        <p>{classrooms.length}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Documents</h4>
                        <p>{totalDocuments}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Topics</h4>
                        <p>{totalTopics}</p>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="create-card">
                        <h3>Create a new classroom</h3>
                        <p>Set up a space and start sharing learning material instantly.</p>
                        <form onSubmit={handleCreateClassroom}>
                            <input
                                id="create-classroom-input"
                                className="input-control"
                                type="text"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                placeholder="Give your classroom a friendly name"
                                required
                            />
                            <button className="btn btn-primary" type="submit">
                                Create Classroom
                            </button>
                        </form>
                    </div>

                    <div className="section">
                        <h3>Your classrooms</h3>
                        {classrooms.length === 0 ? (
                            <div className="empty-state">
                                <h4>No classrooms yet</h4>
                                <p>Create your first classroom to start inviting students.</p>
                                <button
                                    className="btn btn-secondary"
                                    type="button"
                                    onClick={() => {
                                        if (typeof document !== 'undefined') {
                                            document.getElementById('create-classroom-input')?.focus();
                                        }
                                    }}
                                >
                                    Start building
                                </button>
                            </div>
                        ) : (
                            <div className="classroom-grid">
                                {classrooms.map((room) => {
                                    const documentCount = room.documents ? room.documents.length : 0;
                                    const topicCount = room.documents
                                        ? room.documents.reduce((sum, doc) => {
                                              if (!doc.topics) return sum;
                                              return sum + doc.topics.length;
                                          }, 0)
                                        : 0;
                                    return (
                                        <div className="classroom-card" key={room.id}>
                                            <div>
                                                <h4>{room.name}</h4>
                                                <small>{documentCount} docs • {topicCount} topics</small>
                                            </div>
                                            <Link className="btn btn-primary" to={`/classroom/${room.id}`}>
                                                Open classroom
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
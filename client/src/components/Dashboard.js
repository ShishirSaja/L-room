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

    return (
        <div>
            <h2>Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <h3>Create a New Classroom</h3>
            <form onSubmit={handleCreateClassroom}>
                <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Classroom Name"
                    required
                />
                <button type="submit">Create Classroom</button>
            </form>
            <hr/>
            <h3>Your Classrooms</h3>
            <ul>
                {classrooms.map(room => (
                    <li key={room.id}>
                        <Link to={`/classroom/${room.id}`}>{room.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
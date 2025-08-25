import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/signup', { username, email, password, role });
            navigate('/login');
        } catch (err) {
            setError('Signup failed. Please try again.');
            console.error("Signup failed", err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSignup}>
                <h2>Sign Up</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <div>
                    <label>
                        Role:
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                        </select>
                    </label>
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <div className="auth-links">
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default SignupPage;
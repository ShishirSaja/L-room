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
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-card-inner">
                    <form onSubmit={handleSignup}>
                        <h2>Create an account</h2>
                        <p>Join Learning Room as a student or lecturer.</p>
                        {error && <p className="error-text">{error}</p>}

                        <div className="form-field">
                            <label htmlFor="signup-username">Username</label>
                            <input
                                id="signup-username"
                                className="input-control"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Pick a display name"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="signup-email">Email</label>
                            <input
                                id="signup-email"
                                className="input-control"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="signup-password">Password</label>
                            <input
                                id="signup-password"
                                className="input-control"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a secure password"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="signup-role">Role</label>
                            <select
                                id="signup-role"
                                className="input-control"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="student">Student</option>
                                <option value="lecturer">Lecturer</option>
                            </select>
                        </div>

                        <button className="btn btn-primary" type="submit">
                            Create account
                        </button>
                    </form>
                    <div className="auth-links">
                        <p>
                            Already have an account? <Link to="/login">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

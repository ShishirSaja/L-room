import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error("Login failed", err);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-card-inner">
                    <form onSubmit={handleLogin}>
                        <h2>Welcome back</h2>
                        <p>Log in to access your classrooms and study tools.</p>
                        {error && <p className="error-text">{error}</p>}

                        <div className="form-field">
                            <label htmlFor="login-email">Email</label>
                            <input
                                id="login-email"
                                className="input-control"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                className="input-control"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button className="btn btn-primary" type="submit">
                            Login
                        </button>
                    </form>
                    <div className="auth-links">
                        <p>
                            Don't have an account? <Link to="/signup">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

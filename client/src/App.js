import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './components/Dashboard';
import Classroom from './components/Classroom';

function App() {
    const token = localStorage.getItem('token');
    
    return (
        <Router>
            <div className="App container">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/classroom/:id" element={token ? <Classroom /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
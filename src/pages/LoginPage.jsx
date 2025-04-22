import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:8001/api'; // Define your backend URL
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage(''); // Clear any previous error messages
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, { // Use the correct backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                console.log("Frontend received token on login:", token);
                localStorage.setItem('authToken', token);
                navigate('/'); // Or navigate to your dashboard
            } else {
                const errorData = await response.json();
                console.error("Login failed:", errorData.message);
                setErrorMessage(errorData.message || 'Login failed. Please check your credentials.');
                // Handle login error (e.g., display message to user)
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage('Network error. Please try again later.');
            // Handle network error
        }
    };

    return (
        <div className="bg-light d-flex justify-content-center align-items-center vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card p-4 shadow-lg rounded">
                            <h2 className="text-center mb-4">Login</h2>
                            {errorMessage && <div className="alert alert-danger mb-3">{errorMessage}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
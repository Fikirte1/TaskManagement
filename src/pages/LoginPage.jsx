import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:8001/api'; // Define your backend URL

    const handleSubmit = async (event) => {
        event.preventDefault();
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
                // Handle login error (e.g., display message to user)
            }
        } catch (error) {
            console.error("Login error:", error);
            // Handle network error
        }
    };

    return (
        // Your login form JSX
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginPage;
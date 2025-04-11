import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Implement your logout logic here
        localStorage.removeItem('authToken'); // Example: Remove token from local storage
        // You might want to make an API call to invalidate the token on the server as well

        // Redirect to the login page after logout
        navigate('/login');
    }, [navigate]);

    return (
        <div>
            <h2>Logging Out...</h2>
            <p>You will be redirected shortly.</p>
        </div>
    );
};

export default LogoutPage;
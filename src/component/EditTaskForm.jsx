// EditTaskForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './CreateTaskForm.css'; // You can reuse or create a specific CSS

const EditTaskForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:8001/api';
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('low');
    const [status, setStatus] = useState('active');

    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/task/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    // Handle error
                    throw new Error('Failed to fetch task for editing');
                }
                const data = await response.json();
                setTask(data);
                setTitle(data.title || '');
                setDescription(data.description || '');
                setDueDate(data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '');
                setPriority(data.priority || 'low');
                setStatus(data.status || 'active');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/task/${id}`, {
                method: 'PUT', // Or PATCH
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, dueDate, priority, status }),
            });
            if (response.ok) {
                navigate('/tasks');
            } else {
                // Handle error
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update task');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading task details...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!task) return <div>Task not found</div>;

    return (
        <div className="formContainer">
            <h2 className="heading">Edit Task</h2>
            <form onSubmit={handleSubmit}>
                {/* Form fields similar to CreateTaskForm, pre-filled with task data */}
                {/* ... */}
                <button type="submit" className="button">Update Task</button>
            </form>
            <p style={{ marginTop: '20px' }}>
                <Link to="/tasks" className="link">Back to Task List</Link>
            </p>
        </div>
    );
};

export default EditTaskForm;
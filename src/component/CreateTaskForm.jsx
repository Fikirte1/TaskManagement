import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTaskForm.css'; // Import your CSS file

const CreateTaskForm = ({ onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [priority, setPriority] = useState('low');
    const [status, setStatus] = useState('pending');
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:8001/api';

    useEffect(() => {
        // Automatically set initial status based on dates when the component mounts or dates change
        const now = new Date();
        const start = startDate ? new Date(startDate) : null;
        const due = dueDate ? new Date(dueDate) : null;

        if (start && start <= now && due && due >= now) {
            setStatus('active');
        } else if (due && due < now) {
            setStatus('inactive');
        } else if (start && start > now) {
            setStatus('pending');
        } else {
            setStatus('pending'); // Default if no start date is set
        }
    }, [startDate, dueDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/v1/task/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, dueDate, startDate, priority, status }),
            });

            if (response.status === 201) {
                setTitle('');
                setDescription('');
                setDueDate('');
                setStartDate('');
                setPriority('low');
                setStatus('pending'); // Reset status for the next task
                if (onTaskCreated) {
                    onTaskCreated();
                }
                navigate('/tasks/list');
            } else {
                const errorData = await response.json();
                console.error('Failed to create task:', errorData.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div className="formContainer">
            <h2 className="heading">Create New Task</h2>
            <form onSubmit={handleSubmit}>
                <div className="inputGroup">
                    <label htmlFor="title" className="label">Title:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="input" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="description" className="label">Description:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="input" rows="4" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="dueDate" className="label">Due Date:</label>
                    <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="startDate" className="label">Start Date:</label>
                    <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="priority" className="label">Priority:</label>
                    <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="select">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="inputGroup">
                    <label htmlFor="status" className="label">Status:</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="select" disabled>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="completed">Completed</option>
                    </select>
                    <small className="form-text text-muted">Status is automatically determined based on Start and Due Dates.</small>
                </div>
                <button type="submit" className="button">Create Task</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '25px' }}>
                <button onClick={() => navigate('/tasks/list')} className="button backButton">Back to Task List</button>
            </p>
        </div>
    );
};

export default CreateTaskForm;
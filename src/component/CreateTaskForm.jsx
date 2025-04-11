import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTaskForm.css'; // Import your CSS file

const CreateTaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('low');
    const [status, setStatus] = useState('active');
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:8001/api';

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
                body: JSON.stringify({ title, description, dueDate, priority, status }),
            });

            if (response.status === 201) {
                setTitle('');
                setDescription('');
                setDueDate('');
                setPriority('low');
                setStatus('active');
                navigate('/tasks');
            } else {
                const errorData = await response.json();
                console.error('Failed to create task:', errorData.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div className="formContainer"> {/* Use class name as a string */}
            <h2 className="heading">Create New Task</h2> {/* Use class name as a string */}
            <form onSubmit={handleSubmit}>
                <div className="inputGroup"> {/* Use class name as a string */}
                    <label htmlFor="title" className="label">Title:</label> {/* Use class name as a string */}
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="input" /> {/* Use class name as a string */}
                </div>
                <div className="inputGroup"> {/* Use class name as a string */}
                    <label htmlFor="description" className="label">Description:</label> {/* Use class name as a string */}
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="input" rows="4" /> {/* Use class name as a string */}
                </div>
                <div className="inputGroup"> {/* Use class name as a string */}
                    <label htmlFor="dueDate" className="label">Due Date:</label> {/* Use class name as a string */}
                    <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" /> {/* Use class name as a string */}
                </div>
                <div className="inputGroup"> {/* Use class name as a string */}
                    <label htmlFor="priority" className="label">Priority:</label> {/* Use class name as a string */}
                    <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="select"> {/* Use class name as a string */}
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="hign">High</option>
                    </select>
                </div>
                <div className="inputGroup"> {/* Use class name as a string */}
                    <label htmlFor="status" className="label">Status:</label> {/* Use class name as a string */}
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="select"> {/* Use class name as a string */}
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <button type="submit" className="button">Create Task</button> {/* Use class name as a string */}
            </form>
            <p style={{ textAlign: 'center', marginTop: '25px' }}>
                <button onClick={() => navigate('/tasks')} className="button backButton">Back to Task List</button> {/* Use class names as strings */}
            </p>
        </div>
    );
};

export default CreateTaskForm;
import React, { useState, useEffect } from 'react';

const EditTaskModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('low');
    const [status, setStatus] = useState('active');
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setDueDate(task.dueDate ? task.dueDate.substring(0, 10) : '');
            setPriority(task.priority || 'low');
            setStatus(task.status || 'active');
            setCompleted(task.completed || false);
        }
    }, [task]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!task?._id) return;

        const updatedTask = { title, description, dueDate, priority, status, completed };

        try {
            const token = localStorage.getItem('authToken'); // Replace with your auth method
            const response = await fetch(`/api/task/${task._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update task');
            }

            onTaskUpdated();
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Edit Task</h2>
                <form id="editTaskForm" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="editTitle">Title:</label>
                        <input type="text" id="editTitle" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="editDescription">Description:</label>
                        <textarea id="editDescription" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="editDueDate">Due Date:</label>
                        <input type="date" id="editDueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="editPriority">Priority:</label>
                        <select id="editPriority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="hign">High</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="editStatus">Status:</label>
                        <select id="editStatus" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="editCompleted">Completed:</label>
                        <input type="checkbox" id="editCompleted" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
                    </div>
                    <button type="submit">Save Changes</button>
                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;
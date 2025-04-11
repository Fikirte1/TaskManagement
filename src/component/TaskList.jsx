import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './TaskList.css'; // Import base TaskList styles
import './EditTaskModal.css'; // Import styles specific to the edit modal
import './Alert.css'; // Import CSS for the alert component

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:8001/api';

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editDueDate, setEditDueDate] = useState('');
    const [editPriority, setEditPriority] = useState('low');
    const [editStatus, setEditStatus] = useState('active');

    const [alert, setAlert] = useState(null); // State for the alert message

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/tasks`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError('Unauthorized - Invalid token. Please log in again.');
                        navigate('/login');
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Failed to fetch tasks');
                    }
                }
                const data = await response.json();
                setTasks(data.tasks);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [navigate]);

    const openEditModal = (task) => {
        setTaskToEdit(task);
        setEditTitle(task.title || '');
        setEditDescription(task.description || '');
        setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        setEditPriority(task.priority || 'low');
        setEditStatus(task.status || 'active');
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setTaskToEdit(null);
        setAlert(null); // Clear any existing alert when closing
    };

    const handleEditInputChange = (e, field) => {
        switch (field) {
            case 'title':
                setEditTitle(e.target.value);
                break;
            case 'description':
                setEditDescription(e.target.value);
                break;
            case 'dueDate':
                setEditDueDate(e.target.value);
                break;
            case 'priority':
                setEditPriority(e.target.value);
                break;
            case 'status':
                setEditStatus(e.target.value);
                break;
            default:
                break;
        }
    };

    const handleUpdateTask = async () => {
        if (!taskToEdit) return;
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/task/${taskToEdit._id}`, {
                method: 'PUT', // Or PATCH
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                    dueDate: editDueDate,
                    priority: editPriority,
                    status: editStatus,
                }),
            });

            if (response.ok) {
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task._id === taskToEdit._id
                            ? { ...task, title: editTitle, description: editDescription, dueDate: editDueDate, priority: editPriority, status: editStatus }
                            : task
                    )
                );
                setAlert({ type: 'success', message: 'Task updated successfully!' });
                setTimeout(closeEditModal, 1500); // Close modal after a short delay
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update task');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
                    setAlert({ type: 'success', message: 'Task deleted successfully!' });
                    setTimeout(() => setAlert(null), 1500); // Clear alert after a short delay
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete task');
                }
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className="taskListContainer">
            <h2 className="heading">Task List</h2>
            {loading && <div className="loading">Loading tasks...</div>}
            {error && <div className="error">Error: {error}</div>}
            {alert && (
                <div className={`alert ${alert.type}`}>
                    {alert.message}
                </div>
            )}
            {!loading && !error && (
                tasks.length === 0 ? (
                    <p className="noTasks">No tasks yet. <Link to="/tasks/create" className="link">Create one?</Link></p>
                ) : (
                    <ul className="taskList">
                        {tasks.map(task => (
                            <li key={task._id} className="taskItem">
                                <div className="taskInfo">
                                    <h3 style={{ marginBottom: '8px', fontSize: '1.4em', color: '#333' }}>{task.title}</h3>
                                    <p style={{ color: '#666', marginBottom: '10px', fontSize: '1em' }}>{task.description}</p>
                                    {task.dueDate && <p className="headerInfo">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>}
                                    <p className="headerInfo">Priority: <span className={`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`}>{task.priority.toUpperCase()}</span></p>
                                    <p className="headerInfo">Status: <span className={`status${task.status.charAt(0).toUpperCase() + task.status.slice(1)}`}>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span></p>
                                </div>
                                <div className="taskActions">
                                    <button onClick={() => openEditModal(task)} className="actionButton">Edit</button>
                                    <button onClick={() => handleDeleteTask(task._id)} className="actionButton deleteButton">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )
            )}
            <p style={{ marginTop: '30px', textAlign: 'center' }}>
                <Link to="/tasks/create" className="link">Create New Task</Link> | <Link to="/" className="link">Back to Dashboard</Link>
            </p>

            {/* Edit Modal */}
            {isEditModalOpen && taskToEdit && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="heading">Edit Task</h2>
                        {alert && (
                            <div className={`alert ${alert.type}`}>
                                {alert.message}
                            </div>
                        )}
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="inputGroup">
                                <label htmlFor="editTitle" className="label">Title:</label>
                                <input type="text" id="editTitle" value={editTitle} onChange={(e) => handleEditInputChange(e, 'title')} className="input" />
                            </div>
                            <div className="inputGroup">
                                <label htmlFor="editDescription" className="label">Description:</label>
                                <textarea id="editDescription" value={editDescription} onChange={(e) => handleEditInputChange(e, 'description')} className="input" rows="4" />
                            </div>
                            <div className="inputGroup">
                                <label htmlFor="editDueDate" className="label">Due Date:</label>
                                <input type="date" id="editDueDate" value={editDueDate} onChange={(e) => handleEditInputChange(e, 'dueDate')} className="input" />
                            </div>
                            <div className="inputGroup">
                                <label htmlFor="editPriority" className="label">Priority:</label>
                                <select id="editPriority" value={editPriority} onChange={(e) => handleEditInputChange(e, 'priority')} className="select">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="hign">High</option>
                                </select>
                            </div>
                            <div className="inputGroup">
                                <label htmlFor="editStatus" className="label">Status:</label>
                                <select id="editStatus" value={editStatus} onChange={(e) => handleEditInputChange(e, 'status')} className="select">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={handleUpdateTask} className="actionButton">Update</button>
                                <button type="button" onClick={closeEditModal} className="actionButton deleteButton">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;
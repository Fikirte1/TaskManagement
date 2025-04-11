import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TaskItem = ({ task, onEdit, onDelete }) => {
    return (
        <li className="task-item">
            <div>
                <h3>{task.title}</h3>
                <p>{task.description || 'No description'}</p>
                <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
                <p>Priority: <span className={`priority-${task.priority}`}>{task.priority}</span></p>
                <p>Status: <span className={`status-${task.status}`}>{task.status}</span></p>
                {task.completed && <span className="completed">(Completed)</span>}
            </div>
            <div className="task-actions">
                <button className="edit-btn" onClick={onEdit}>
                    <FaEdit /> Edit
                </button>
                <button className="delete-btn" onClick={() => onDelete(task._id)}>
                    <FaTrash /> Delete
                </button>
            </div>
        </li>
    );
};

export default TaskItem;
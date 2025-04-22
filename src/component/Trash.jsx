// src/component/Trash.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import './Trash.css'; // You might want to create a specific CSS file for this
import './Alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashRestore, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const Trash = () => {
  const [trashedTasks, setTrashedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8001/api';
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchTrashedTasks = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/trash`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch trashed tasks');
          }
        }
        const data = await response.json();
        setTrashedTasks(data.tasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrashedTasks();
  }, [navigate]);

  const handleRestoreTask = async (taskId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/task/${taskId}/restore`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTrashedTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        setAlert({ type: 'success', message: 'Task restored successfully!' });
        setTimeout(() => setAlert(null), 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to restore task');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  const handlePermanentDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/task/${taskId}/permanent`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setTrashedTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
          setAlert({ type: 'success', message: 'Task permanently deleted!' });
          setTimeout(() => setAlert(null), 1500);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to permanently delete task');
        }
      } catch (error) {
        setError(error.message || 'An error occurred');
      }
    }
  };

  return (
    <div className="trashContainer container mt-4">
      <h2 className="text-center mb-4">Trash</h2>
      {alert && <div className={`alert ${alert.type} text-center`}>{alert.message}</div>}
      {loading ? (
        <p className="text-center">Loading trashed tasks...</p>
      ) : error ? (
        <p className="text-danger text-center">Error: {error}</p>
      ) : trashedTasks.length === 0 ? (
        <p className="text-center">No tasks in the trash.</p>
      ) : (
        <div className="row">
          {trashedTasks.map(task => (
            <div key={task._id} className="col-12 col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-muted">{task.title}</h5>
                  <p className="card-text text-muted">{task.description}</p>
                  {task.dueDate && (
                    <p className="card-text text-muted">
                      <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  <p className="card-text text-muted">
                    <strong>Priority:</strong> {task.priority.toUpperCase()}
                  </p>
                  <p className="card-text text-muted">
                    <strong>Status:</strong> {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <div>
                    <button
                      onClick={() => handleRestoreTask(task._id)}
                      className="btn btn-sm btn-success me-2"
                    >
                      <FontAwesomeIcon icon={faTrashRestore} /> Restore
                    </button>
                    <button
                      onClick={() => handlePermanentDeleteTask(task._id)}
                      className="btn btn-sm btn-danger"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} /> Delete Permanently
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-center mt-4">
        <Link to="/tasks/list" className="link">Back to Task List</Link>
      </p>
    </div>
  );
};

export default Trash;
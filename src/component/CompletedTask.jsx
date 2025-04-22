import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8001/api';

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch tasks');
        }

        const data = await response.json();
        const completedTasks = data.tasks.filter(task => task.status === 'completed');
        setTasks(completedTasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Completed Tasks</h2>

      {loading && <div className="text-center">Loading tasks...</div>}
      {error && <div className="text-danger text-center">Error: {error}</div>}
      {!loading && !error && tasks.length === 0 && (
        <p className="text-center">No completed tasks. <Link to="/tasks/create">Create one?</Link></p>
      )}

      <div className="row">
        {tasks.map(task => (
          <div key={task._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{task.title}</h5>
                <p className="card-text">{task.description}</p>
                {task.dueDate && (
                  <p className="card-text text-muted">
                    <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
                <p className="card-text">
                  <strong>Priority:</strong>
                  <span className={`badge bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'} ms-2`}>
                    {task.priority.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedTasks;

// src/pages/InactiveTasks.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InactiveTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8001/api';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
          } else {
            throw new Error('Failed to fetch tasks');
          }
        }

        const data = await response.json();
        const inactiveTasks = data.tasks.filter(task => task.status === 'inactive');
        setTasks(inactiveTasks);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h3 className="text-center">Inactive Tasks</h3>
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center">No inactive tasks found.</p>
      ) : (
        <div className="row">
          {tasks.map(task => (
            <div key={task._id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5>{task.title}</h5>
                  <p>{task.description}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                  <p><strong>Priority:</strong> {task.priority}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InactiveTasks;

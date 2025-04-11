import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import '../style/TasksPage.css';

const API_BASE_URL = "http://localhost:8001/api";

const TasksPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setTasks([]); // In case the API response is not as expected
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]); // Ensure tasks is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/tasks/${taskId}`,
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(task => task._id === taskId ? response.data : task));
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="content-wrapper">
          <div className="tasks-header">
            <h2>Your Tasks</h2>
            <div className="task-filters">
              <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Tasks</button>
              <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
              <button className={`filter-btn ${filter === 'incomplete' ? 'active' : ''}`} onClick={() => setFilter('incomplete')}>Incomplete</button>
            </div>
            <button className="create-task-btn" onClick={() => navigate('/createtask')}>+ Create New Task</button>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="no-tasks"><p>No tasks found. Create your first task!</p></div>
          ) : (
            <div className="tasks-container">
              {filteredTasks.map(task => (
                <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  <div className="task-main">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskStatus(task._id, task.completed)}
                      className="task-checkbox"
                      aria-label="Mark task as completed"
                    />
                    <div className="task-content">
                      <h3 className="task-title">{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                      <div className="task-meta">
                        <span className={`task-priority ${task.priority}`}>{task.priority}</span>
                        <span className="task-date">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="task-actions">
                    <button className="edit-btn" onClick={() => navigate(`/edittask/${task._id}`)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(task._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Add a footer to the page
<div className="footer">
  <p>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</p>
</div>
export default TasksPage;

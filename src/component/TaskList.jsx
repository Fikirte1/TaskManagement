import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './TaskList.css';
import './EditTaskModal.css';
import './Alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faStar as solidStar ,} from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import faTrash
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8001/api';
  const [statusFilter, setStatusFilter] = useState('all'); // State for the status filter
  const [filteredTasks, setFilteredTasks] = useState([]); // State for tasks filtered by status

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState('low');
  const [editStatus, setEditStatus] = useState('active');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // const fetchTasks = async () => {
    //   setLoading(true);
    //   setError('');
    //   try {
    //     const token = localStorage.getItem('authToken');
    //     const response = await fetch(`${API_BASE_URL}/tasks`, {
    //       headers: {
    //         'Authorization': `Bearer ${token}`,
    //       },
    //     });

    //     if (!response.ok) {
    //       if (response.status === 401) {
    //         navigate('/login');
    //       } else {
    //         const errorData = await response.json();
    //         throw new Error(errorData.message || 'Failed to fetch tasks');
    //       }
    //     }
    //     const data = await response.json();
    //     setTasks(data.tasks);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
// //     const fetchTasks = async () => {
// //         setLoading(true);
// //         setError('');
// //         try {
// //           const token = localStorage.getItem('authToken');
// //           const response = await fetch(`${API_BASE_URL}/tasks?trashed=false`, { // <--- IMPORTANT: Check this line
// //             headers: {
// //               'Authorization': `Bearer ${token}`,
// //             },
// //           });
      
// //           // ... rest of your fetch logic ...
// //           const data = await response.json();
// //           setTasks(data.tasks);
// //         } catch (err) {
// //           setError(err.message);
// //         } finally {
// //           setLoading(false);
// //         }
// //       };
// //     fetchTasks();
// //   }, [navigate]);

// //   useEffect(() => {
// //     // Filter tasks whenever the statusFilter or tasks change
// //     if (statusFilter === 'all') {
// //       setFilteredTasks(tasks);
// //     } else {
// //       setFilteredTasks(tasks.filter(task => task.status === statusFilter));
// //     }
// //   }, [tasks, statusFilter]);
// useEffect(() => {
    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/tasks?trashed=false`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
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

useEffect(() => {
    if (statusFilter === 'all') {
        setFilteredTasks(tasks);
    } else {
        setFilteredTasks(tasks.filter(task => task.status === statusFilter));
    }
}, [tasks, statusFilter]);

const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
};
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
    setAlert(null);
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
        method: 'PUT',
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
        setTimeout(closeEditModal, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update task');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTrashTask = async (taskId) => { // New function to move to trash
    if (window.confirm('Are you sure you want to move this task to the trash?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/task/${taskId}/trash`,  {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId)); // Optimistically remove from current list
          setAlert({ type: 'success', message: 'Task moved to trash!' });
          setTimeout(() => {
            setAlert(null);
            // Optionally navigate to the trash immediately or just show the alert
            // navigate('/trash');
          }, 1500);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to move task to trash');
        }
      } catch (error) {
        setError(error.message || 'An error occurred');
      }
    }
  };

  const handleDeleteTask = async (taskId) => { // Keep this for permanent delete if needed elsewhere
    if (window.confirm('Are you sure you want to permanently delete this task?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/task/</span>{taskId}/permanent`, { // Use permanent delete endpoint
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
          setAlert({ type: 'success', message: 'Task permanently deleted!' });
          setTimeout(() => setAlert(null), 1500);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to delete task');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };
  const toggleComplete = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const updatedStatus = task.status === 'completed' ? 'active' : 'completed';

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (response.ok) {
        setTasks(prevTasks =>
          prevTasks.map(t =>
            t._id === taskId ? { ...t, status: updatedStatus } : t
          )
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update task status');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleFavorite = (taskId) => {
    setTasks(prev =>
      prev.map(task =>
        task._id === taskId ? { ...task, favorite: !task.favorite } : task
      )
    );
  };

  

  return (
    <div className="taskListContainer">
    <div className="container-fluid">
        <h2 className="heading text-center my-4">Task List</h2>

        <div className="mb-3">
            <label htmlFor="statusFilter" className="form-label">Filter by Status:</label>
            <select
                className="form-select"
                id="statusFilter"
                value={statusFilter}
                onChange={handleStatusFilterChange}
            >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
            </select>
        </div>

        {loading && <div className="loading text-center">Loading tasks...</div>}
        {error && <div className="error text-center">Error: {error}</div>}
        {alert && <div className={`alert ${alert.type} text-center`}>{alert.message}</div>}
        {!loading && !error && filteredTasks.length === 0 && (
            <p className="noTasks text-center">
                No tasks found with the selected status. <Link to="/tasks/create" className="link">Create one?</Link>
            </p>
        )}

        <div className="row">
            {filteredTasks.map(task => (
                <div key={task._id} className="col-12 col-md-6 col-lg-3 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">{task.title}</h5>
                            <p className="card-text">{task.description}</p>
                            {task.dueDate && (
                                <p className="card-text text-muted">
                                    <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                            )}
                            {task.startDate && (
                                <p className="card-text text-muted">
                                    <strong>Start:</strong> {new Date(task.startDate).toLocaleDateString()}
                                </p>
                            )}
                            <p className="card-text">
                                <strong>Priority:</strong>
                                <span className={`badge bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'}`}>
                                    {task.priority.toUpperCase()}
                                </span>
                            </p>
                            <p className="card-text">
                                <strong>Status:</strong>
                                <span className={`badge bg-${task.status === 'pending' ? 'info' : task.status === 'active' ? 'success' : task.status === 'inactive' ? 'warning' : 'secondary'}`}>
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </span>
                            </p>
                        </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <div>
                    <button onClick={() => openEditModal(task)} className="btn btn-sm btn-primary me-1">Edit</button>
                    <button onClick={() => handleTrashTask(task._id)} className="btn btn-sm btn-warning me-1">
  <FontAwesomeIcon icon={faTrash} /> Trash
</button>               </div>
                  <div className="icon-group d-flex gap-2">
                    <FontAwesomeIcon
                      icon={task.status === 'completed' ? faCheckSquare : faSquare}
                      className={`text-${task.status === 'completed' ? 'success' : 'secondary'} icon-action`}
                      title={task.status === 'completed' ? 'Completed' : 'Mark as Complete'}
                      role="button"
                      onClick={() => toggleComplete(task._id)}
                    />
                    <FontAwesomeIcon
                      icon={task.favorite ? solidStar : regularStar}
                      className={`text-warning icon-action`}
                      title={task.favorite ? 'Unmark Favorite' : 'Mark Favorite'}
                      role="button"
                      onClick={() => toggleFavorite(task._id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Task Button Card */}
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm text-center">
              <div className="card-body">
                <Link to="/tasks/create" className="btn btn-success">Add Task</Link>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center my-4">
          <Link to="/" className="link">Back to Dashboard</Link>
        </p>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && taskToEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Task</h2>
            {alert && <div className={`alert ${alert.type}`}>{alert.message}</div>}
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="inputGroup">
                <label>Title:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => handleEditInputChange(e, 'title')}
                />
              </div>
              <div className="inputGroup">
                <label>Description:</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => handleEditInputChange(e, 'description')}
                />
              </div>
              <div className="inputGroup">
                <label>Due Date:</label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => handleEditInputChange(e, 'dueDate')}
                />
              </div>
              <div className="inputGroup">
                <label>Priority:</label>
                <select value={editPriority} onChange={(e) => handleEditInputChange(e, 'priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="inputGroup">
                <label>Status:</label>
                <select value={editStatus} onChange={(e) => handleEditInputChange(e, 'status')}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleUpdateTask} className="btn btn-primary">Update</button>
                <button type="button" onClick={closeEditModal} className="btn btn-danger">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
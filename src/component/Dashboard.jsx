import React, { useState, useEffect } from 'react';
import CreateTaskForm from './CreateTaskForm';
import TaskList from './TaskList';
import EditTaskModal from './EditTaskModal';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import './Sidebar.css';
import './Navbar.css';
import './TaskSummaryCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faBars, faTasks, faHome, faUser, faCheckSquare,faCog, faSignOutAlt, faPlusCircle, faListAlt, faCalendarCheck, faChartBar, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'; // Ensure faClock is included
// Added more icons
const Dashboard = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [refreshTasks, setRefreshTasks] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [taskSummary, setTaskSummary] = useState({ total: 0, active: 0, completed: 0, overdue: 0 });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        // ... inside your useEffect in Dashboard.jsx ...
if (token) {
    setIsAuthenticated(true);
    // Mock API response
    const mockSummaryData = { total: 15, active: 5, completed: 7, overdue: 3 };
    setTaskSummary(mockSummaryData);
    // ... comment out the actual fetch call ...
}
        // if (token) {
        //     setIsAuthenticated(true);
        //     fetch('/api/tasks/summary', {
        //         headers: { 'Authorization': `Bearer ${token}` },
        //     })
        //     .then(response => response.json())
        //     .then(data => setTaskSummary(data))
        //     .catch(error => console.error("Error fetching task summary:", error));
        // } else {
        //     navigate('/login');
        // }
    }, [navigate]);

    const toggleMenu = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleOpenEditModal = (task) => {
        setSelectedTask(task);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedTask(null);
    };

    const handleTaskCreated = () => {
        setRefreshTasks(prev => !prev);
    };

    const handleTaskUpdated = () => {
        setRefreshTasks(prev => !prev);
        handleCloseEditModal();
    };

    const handleTaskDeleted = async (taskId) => {
        if (window.confirm('Are you sure...?')) {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`/api/task/${taskId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete');
                }
                setRefreshTasks(prev => !prev);
            } catch (error) {
                alert(error.message);
            }
        }
    };

    if (!isAuthenticated) {
        return <div>Redirecting to login...</div>;
    }

    const sidebarMenu = [
        { path: "/", label: "Dashboard", icon: faHome },
        { path: "/tasks/create", label: "Create Task", icon: faPlusCircle },
        { path: "/tasks/list", label: "List Tasks", icon: faListAlt },
        { path: "/tasks/calendar", label: "Calendar", icon: faCalendarCheck },
        { path: "/tasks/reports", label: "Reports", icon: faChartBar },
        { path: "/profile", label: "Profile", icon: faUser },
        { path: "/settings", label: "Settings", icon: faCog },
        { path: "/logout", label: "Logout", icon: faSignOutAlt },
    ];

    return (
        <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
                <div className="sidebar-header">
                    <h2>Task Manager</h2>
                    <button className="toggle-menu-btn" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>
                </div>
                <ul className="sidebar-menu">
    {sidebarMenu.map(item => (
        <li key={item.path} className={location.pathname.startsWith(item.path) ? 'active' : ''}>
            <Link to={item.path}>
                <FontAwesomeIcon icon={item.icon} size="lg" />
                <span className="menu-label">{item.label}</span>
            </Link>
        </li>
    ))}
</ul>
            </aside>
            <div className="main-content">
                <nav className={`navbar ${isSidebarCollapsed ? 'expanded' : ''}`}>
                    <div className="navbar-left">
                        <button className="toggle-menu-btn-mobile" onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faBars} size="lg" />
                        </button>
                        <span className="page-title">{sidebarMenu.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}</span> {/* Update label */}
                        {isSidebarCollapsed && (
                            <div className="expanded-nav-items">
                                {sidebarMenu.map(item => (
                                    <Link key={item.path} to={item.path} className={location.pathname.startsWith(item.path) ? 'active' : ''}>
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <ul className="navbar-right">
                        <li className="notification-icon">
                            <FontAwesomeIcon icon={faBell} size="lg" />
                            <span className="notification-badge">3</span>
                        </li>
                        <li className="user-icon">
                            <FontAwesomeIcon icon={faUserCircle} size="lg" />
                            
                        </li>
                    </ul>
                </nav>
                <div className="content-area">
                    {location.pathname === "/" && (
                        <div className="dashboard-widgets">
                            <div className="task-summary-card">
                                <div className="card-icon"><FontAwesomeIcon icon={faTasks} size="2x" /></div>
                                <div className="card-info">
                                    <span className="card-title">Total Tasks</span>
                                    <span className="card-value">{taskSummary.total}</span>
                                </div>
                            </div>
                            <div className="task-summary-card active">
                                <div className="card-icon"><FontAwesomeIcon icon={faClock} size="2x" /></div>
                                <div className="card-info">
                                    <span className="card-title">Active Tasks</span>
                                    <span className="card-value">{taskSummary.active}</span>
                                </div>
                            </div>
                            <div className="task-summary-card completed">
                                <div className="card-icon"><FontAwesomeIcon icon={faCheckSquare} size="2x" /></div>
                                <div className="card-info">
                                    <span className="card-title">Completed Tasks</span>
                                    <span className="card-value">{taskSummary.completed}</span>
                                </div>
                            </div>
                            <div className="task-summary-card overdue">
                                <div className="card-icon"><FontAwesomeIcon icon={faExclamationTriangle} size="2x" /></div>
                                <div className="card-info">
                                    <span className="card-title">Overdue Tasks</span>
                                    <span className="card-value">{taskSummary.overdue}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {location.pathname === "/tasks/create" && (
                        <div className="create-task-section">
                            <h2>Create New Task</h2>
                            <CreateTaskForm onTaskCreated={handleTaskCreated} />
                        </div>
                    )}

                    {location.pathname === "/tasks/list" && (
                        <div className="task-list-section">
                            <h2>Task List</h2>
                            <TaskList
                                onEditTask={handleOpenEditModal}
                                onDeleteTask={handleTaskDeleted}
                                key={refreshTasks}
                            />
                        </div>
                    )}

                    {/* You would create components for Calendar and Reports */}
                    {location.pathname === "/tasks/calendar" && (
                        <div>
                            <h2>Task Calendar</h2>
                            {/* Calendar Component Here */}
                        </div>
                    )}

                    {location.pathname === "/tasks/reports" && (
                        <div>
                            <h2>Task Reports</h2>
                            {/* Reports Component Here */}
                        </div>
                    )}

                    {/* The EditTaskModal is always available */}
                    <EditTaskModal
                        isOpen={isEditModalOpen}
                        onClose={handleCloseEditModal}
                        task={selectedTask}
                        onTaskUpdated={handleTaskUpdated}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
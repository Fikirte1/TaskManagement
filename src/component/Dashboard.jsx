// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import CreateTaskForm from './CreateTaskForm';
import TaskList from './TaskList';
import EditTaskModal from './EditTaskModal';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import './TaskSummaryCard.css';
import './DashboardMainContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faHome, faCheckCircle, faTimesCircle, faPlusCircle, faListAlt, faChartBar, faTrash, faCalendarCheck, faCog, faUser, faSignOutAlt, faClock, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';
import CompletedTask from './CompletedTask';
import InactiveTask from './InactiveTask';
import Trash from './Trash'; // Import the Trash component

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [refreshTasks, setRefreshTasks] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [taskSummary, setTaskSummary] = useState({ total: 0, pending: 0, active: 0, overdue: 0, completed: 0 });
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();
    const location = useLocation();
    const API_BASE_URL = 'http://localhost:8001/api';

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
            fetchTaskCounts(token);
        } else {
            navigate('/login');
        }

        // Real-time update for currentTime
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(intervalId);
    }, [navigate]);

    const fetchTaskCounts = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                } else {
                    console.error('Failed to fetch tasks:', response.status);
                }
                return;
            }
            const data = await response.json();
            const allTasks = data.tasks.filter(task => !task.trashed);

            const pendingCount = allTasks.filter(task => task.startDate && new Date(task.startDate) > currentTime && task.status !== 'completed').length;
            const activeCount = allTasks.filter(task => task.startDate && new Date(task.startDate) <= currentTime && new Date(task.dueDate) >= currentTime && task.status !== 'completed').length;
            const overdueCount = allTasks.filter(task => task.dueDate && new Date(task.dueDate) < currentTime && task.status !== 'completed').length;
            const completedCount = allTasks.filter(task => task.status === 'completed').length;

            setTaskSummary({
                total: allTasks.length,
                pending: pendingCount,
                active: activeCount,
                overdue: overdueCount,
                completed: completedCount,
            });
        } catch (error) {
            console.error('Error fetching task counts:', error);
        }
    };

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
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchTaskCounts(token); // Refresh counts after creation
        }
    };

    const handleTaskUpdated = () => {
        setRefreshTasks(prev => !prev);
        handleCloseEditModal();
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchTaskCounts(token); // Refresh counts after update
        }
    };

    const handleTaskDeleted = async (taskId) => {
        if (window.confirm('Are you sure...?')) {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/task/${taskId}/trash`, { // Changed to trash endpoint
                    method: 'PUT', // Using PUT to move to trash
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to move to trash');
                }
                setRefreshTasks(prev => !prev);
                if (token) {
                    fetchTaskCounts(token); // Refresh counts after trashing
                }
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
        { path: "/tasks/completed", label: "Completed Tasks", icon: faCheckCircle },
        { path: "/tasks/inactive", label: "Inactive Tasks", icon: faTimesCircle },
        { path: "/tasks/reports", label: "Reports", icon: faChartBar },
        { path: "/trash", label: "Trash", icon: faTrash },
        { path: "/profile", label: "Profile", icon: faUser },
        { path: "/settings", label: "Settings", icon: faCog },
        { path: "/logout", label: "Logout", icon: faSignOutAlt },
    ];

    const pieChartData = {
        labels: ['Completed', 'Pending', 'Active', 'Overdue'],
        datasets: [
            {
                label: 'Task Status',
                data: [taskSummary.completed, taskSummary.pending, taskSummary.active, taskSummary.overdue],
                backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#FF6384'],
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    const taskActivityData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
            {
                label: 'Tasks Created',
                data: [5, 8, 6, 10, 7],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: 'Tasks Completed',
                data: [3, 6, 4, 8, 5],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const taskActivityOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
            <Sidebar isCollapsed={isSidebarCollapsed} toggleMenu={toggleMenu} />
            <div className="main-content">
                <Navbar isSidebarCollapsed={isSidebarCollapsed} toggleMenu={toggleMenu} sidebarMenu={sidebarMenu} />
                {location.pathname === "/" && (
                    <div className="dashboard-main-content">
                        <div className="dashboard-widgets">
                            <div className="task-summary-card">
                                <div className="card-icon"><FontAwesomeIcon icon={faTasks} size="2x" /></div>
                                <div className="card-info">
                                    <span className="card-title">Total Tasks</span>
                                    <span className="card-value">{taskSummary.total}</span>
                                </div>
                            </div>
                            <div className="task-summary-card pending">
                                <div className="card-icon"><FontAwesomeIcon icon={faClock} size="2x" /></div>
                                <div className="card-info">
                                    <span className="card-title">Pending Tasks</span>
                                    <span className="card-value">{taskSummary.pending}</span>
                                </div>
                            </div>
                            <div className="task-summary-card active">
                                <div className="card-icon"><FontAwesomeIcon icon={faPlayCircle} size="2x" /></div>
                                <div className="card-info">
                                    <span className="card-title">Active Tasks</span>
                                    <span className="card-value">{taskSummary.active}</span>
                                </div>
                            </div>
                            <div className="task-summary-card overdue">
                                <div className="card-icon"><FontAwesomeIcon icon={faTimesCircle} size="2x" /></div>
                                <div className="card-info">
                                    <span className="card-title">Overdue Tasks</span>
                                    <span className="card-value">{taskSummary.overdue}</span>
                                </div>
                            </div>
                            <div className="task-summary-card completed">
                                <div className="card-icon"><FontAwesomeIcon icon={faCheckCircle} size="2x" /></div>
                                <div className="card-info">
                                    <span className="card-title">Completed Tasks</span>
                                    <span className="card-value">{taskSummary.completed}</span>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-8">
                                <div className="bar-chart-container">
                                    <h2>Task Activity</h2>
                                    <Bar data={taskActivityData} options={taskActivityOptions} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="pie-chart-container">
                                    <h2>Task Distribution</h2>
                                    <Pie data={pieChartData} options={pieChartOptions} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {location.pathname === "/tasks/create" && (
                    <CreateTaskForm onTaskCreated={handleTaskCreated} />
                )}

                {location.pathname === "/tasks/list" && (
                    <TaskList
                        onEditTask={handleOpenEditModal}
                        onDeleteTask={handleTaskDeleted}
                        key={refreshTasks}
                    />
                )}

                {location.pathname === "/tasks/completed" && (
                    <div className="task-list-section">
                        <h2>Completed Tasks</h2>
                        <CompletedTask
                            filter="completed"
                            onEditTask={handleOpenEditModal}
                            onDeleteTask={handleTaskDeleted}
                            key={refreshTasks}
                        />
                    </div>
                )}
                {location.pathname === "/tasks/inactive" && (
                    <InactiveTask
                        filter="overdue" // Changed filter to 'overdue' as 'inactive' is now based on future start date
                        onEditTask={handleOpenEditModal}
                        onDeleteTask={handleTaskDeleted}
                        key={refreshTasks}
                    />
                )}

                {location.pathname === "/trash" && (
                    <div>
                        <h2>Trash</h2>
                        <Trash /> {/* Render the Trash component */}
                    </div>
                )}

                {location.pathname === "/tasks/reports" && (
                    <div>
                        <h2>Task Reports</h2>
                    </div>
                )}

                <EditTaskModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    task={selectedTask}
                    onTaskUpdated={handleTaskUpdated}
                />
            </div>
        </div>
    );
};

export default Dashboard;
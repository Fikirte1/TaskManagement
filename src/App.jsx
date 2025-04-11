import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './component/Dashboard';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import CreateTaskForm from './component/CreateTaskForm'; // Import CreateTaskForm
import TaskList from './component/TaskList';         // Import TaskList
import CalendarView from "./component/CalendarView.jsx";
import ReportsView from './component/ReportsView';       // Import ReportsView (if you have one)
import Profile from './component/Profile';             // Import Profile (if you have one)
import Settings from './component/Settings';           // Import Settings (if you have one)
import './App.css';

function App() {
    const isAuthenticated = localStorage.getItem('authToken');

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route
                        path="/"
                        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/logout" element={<LogoutPage />} />

                    {/* Specific routes for sidebar links */}
                    <Route
                        path="/tasks/create"
                        element={isAuthenticated ? <Dashboard><CreateTaskForm /></Dashboard> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/tasks/list"
                        element={isAuthenticated ? <Dashboard><TaskList /></Dashboard> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/tasks/calendar"
                        element={isAuthenticated ? <Dashboard><CalendarView /></Dashboard> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/tasks/reports"
                        element={isAuthenticated ? <Dashboard><ReportsView /></Dashboard> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/profile"
                        element={isAuthenticated ? <Dashboard><Profile /></Dashboard> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/settings"
                        element={isAuthenticated ? <Dashboard><Settings /></Dashboard> : <Navigate to="/login" />}
                    />

                    {/* Catch-all route for /dashboard (optional, might redirect to /) */}
                    <Route
                        path="/dashboard"
                        element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
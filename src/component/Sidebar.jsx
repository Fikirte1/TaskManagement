// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faUser, faCheckSquare, faCog, faSignOutAlt, faPlusCircle, faListAlt, faCalendarCheck, faChartBar, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import './Sidebar.css';

const Sidebar = ({ isCollapsed, toggleMenu }) => {
    const location = useLocation();

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
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
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
    );
};

export default Sidebar;
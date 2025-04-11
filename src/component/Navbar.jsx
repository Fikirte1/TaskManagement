// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import './Navbar.css';

const Navbar = ({ isSidebarCollapsed, toggleMenu, sidebarMenu }) => {
    const location = useLocation();
    const currentPathLabel = sidebarMenu.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard';

    return (
        <nav className={`navbar ${isSidebarCollapsed ? 'expanded' : ''}`}>
            <div className="navbar-left">
                <button className="toggle-menu-btn-mobile" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </button>
                <span className="page-title">{currentPathLabel}</span>
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
    );
};

export default Navbar;
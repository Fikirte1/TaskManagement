// DashboardPage.js
import React, { useState } from "react";
import Sidebar from "../component/Sidebar";
import { FaBell, FaUser, FaCog, FaBars } from "react-icons/fa";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="navbar">
          <div className="nav-left">
            <span 
              className="nav-icon sidebar-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
            >
              ☰
            </span>
            <h1 className="nav-title">Task Dashboard</h1>
          </div>

          <div className="navbar-icons">
            <span className="nav-icon" title="Alerts">🔔</span>
            <span className="nav-icon" title="Preferences">⚙️</span>
            <div className="user-profile">
              <span className="profile-icon">👤</span>
              <span className="profile-name">Jane Smith</span>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <h2>Welcome to Your Dashboard</h2>
          <p>Manage your tasks efficiently.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
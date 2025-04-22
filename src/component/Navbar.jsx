// // src/components/Navbar.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBell, faUserCircle, faBars, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
// import './Navbar.css';
// import './NotificationDropdown.css';
// import './ProfileDropdown.css';

// const Navbar = ({ isSidebarCollapsed, toggleMenu, sidebarMenu }) => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const currentPathLabel = sidebarMenu.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard';
//     const [notifications, setNotifications] = useState([]);
//     const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
//     const [isProfileOpen, setIsProfileOpen] = useState(false);
//     const notificationsRef = useRef(null);
//     const profileRef = useRef(null);

//     // Dummy notification data (replace with actual API calls)
//     useEffect(() => {
//         // Simulate fetching notifications
//         setTimeout(() => {
//             setNotifications([
//                 { id: 1, message: 'Task "Implement User Authentication" is due tomorrow.', read: false, link: '/tasks/list' },
//                 { id: 2, message: 'You have been assigned to the project "New Dashboard Design".', read: true, link: '/projects/dashboard' },
//                 { id: 3, message: 'Reminder: Meeting with the design team at 3 PM.', read: false, link: '/calendar' },
//             ]);
//         }, 1000);
//     }, []);

//     const unreadNotificationsCount = notifications.filter(n => !n.read).length;

//     // const toggleNotifications = () => {
//     //     setIsNotificationsOpen(!isNotificationsOpen);
//     //     setIsProfileOpen(false); // Close profile dropdown when notifications open
//     // };

//     const toggleProfile = () => {
//         setIsProfileOpen(!isProfileOpen);
//         setIsNotificationsOpen(false); // Close notifications dropdown when profile opens
//     };

//     const markNotificationAsRead = (id) => {
//         setNotifications(notifications.map(n =>
//             n.id === id ? { ...n, read: true } : n
//         ));
//         // In a real application, you would also make an API call to update the notification status on the server
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('authToken');
//         navigate('/login'); // Redirect to the login page
//     };

//     // Close dropdowns when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
//                 setIsNotificationsOpen(false);
//             }
//             if (profileRef.current && !profileRef.current.contains(event.target)) {
//                 setIsProfileOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [notificationsRef, profileRef]);

//     return (
//         <nav className={`navbar ${isSidebarCollapsed ? 'expanded' : ''}`}>
//             <div className="navbar-left">
//                 <button className="toggle-menu-btn-mobile" onClick={toggleMenu}>
//                     <FontAwesomeIcon icon={faBars} size="lg" />
//                 </button>
//                 <span className="page-title">{currentPathLabel}</span>
//                 {isSidebarCollapsed && (
//                     <div className="expanded-nav-items">
//                         {sidebarMenu.map(item => (
//                             <Link key={item.path} to={item.path} className={location.pathname.startsWith(item.path) ? 'active' : ''}>
//                                 {item.label}
//                             </Link>
//                         ))}
//                     </div>
//                 )}
//             </div>
//             <ul className="navbar-right">
//                 <li className="notification-icon" ref={notificationsRef}>
//                     <FontAwesomeIcon icon={faBell} size="lg" onClick={toggleNotifications} className="clickable" />
//                     {unreadNotificationsCount > 0 && (
//                         <span className="notification-badge">{unreadNotificationsCount}</span>
//                     )}
//                     {isNotificationsOpen && (
//                         <div className="notification-dropdown">
//                             <h3>Notifications</h3>
//                             {notifications.length === 0 ? (
//                                 <p className="empty-notifications">No new notifications</p>
//                             ) : (
//                                 <ul>
//                                     {notifications.map(notification => (
//                                         <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
//                                             <Link to={notification.link} onClick={() => markNotificationAsRead(notification.id)}>
//                                                 {notification.message}
//                                             </Link>
//                                         </li>
//                                     ))}
//                                     {notifications.length > 0 && (
//                                         <Link to="/notifications" className="view-all">View All Notifications</Link>
//                                     )}
//                                 </ul>
//                             )}
//                         </div>
//                     )}
//                 </li>
//                 <li className="user-icon" ref={profileRef}>
//                     <FontAwesomeIcon icon={faUserCircle} size="lg" onClick={toggleProfile} className="clickable" />
//                     {isProfileOpen && (
//                         <div className="profile-dropdown">
//                             <h3>User Profile</h3>
//                             <ul>
//                                 <li>
//                                     <Link to="/profile/settings">
//                                         <FontAwesomeIcon icon={faCog} className="dropdown-icon" /> Settings
//                                     </Link>
//                                 </li>
//                                 <li onClick={handleLogout} className="clickable">
//                                     <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" /> Logout
//                                 </li>
//                             </ul>
//                         </div>
//                     )}
//                 </li>
//             </ul>
//         </nav>
//     );
// };

// export default Navbar;


// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faBars, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

import { io } from 'socket.io-client'; // Import Socket.IO client

const Navbar = ({ isSidebarCollapsed, toggleMenu, sidebarMenu }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPathLabel = sidebarMenu.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard';
    const [notifications, setNotifications] = useState([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const notificationsRef = useRef(null);
    const profileRef = useRef(null);
    const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage
    const authToken = localStorage.getItem('authToken'); // Assuming you store authToken in localStorage
    const socket = useRef(null);

    useEffect(() => {
        if (userId && authToken) {
            socket.current = io(process.env.VITE_BACKEND_URL || 'http://localhost:8001'); // Connect to your backend

            socket.current.emit('joinRoom', userId);

            socket.current.on('new_notification', (notification) => {
                setNotifications(prev => [notification, ...prev]);
            });

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                }
            };
        }
    }, [userId, authToken]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (userId && authToken) {
                try {
                    const response = await fetch(`${process.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/notifications`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setNotifications(data);
                    } else {
                        console.error('Failed to fetch notifications:', response.status);
                    }
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            }
        };

        fetchNotifications();
    }, [userId, authToken]);

    const unreadNotificationsCount = notifications.filter(n => !n.read).length;

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        setIsProfileOpen(false);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsNotificationsOpen(false);
    };

    const markNotificationAsRead = async (id) => {
        if (userId && authToken) {
            try {
                const response = await fetch(`${process.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/notifications/${id}/read`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ read: true }),
                });

                if (response.ok) {
                    setNotifications(notifications.map(n =>
                        n._id === id ? { ...n, read: true } : n // Assuming your notification ID is _id
                    ));
                } else {
                    console.error('Failed to mark notification as read:', response.status);
                }
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [notificationsRef, profileRef]);

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
                <li className="notification-icon" ref={notificationsRef}>
                    <FontAwesomeIcon icon={faBell} size="lg" onClick={toggleNotifications} className="clickable" />
                    {unreadNotificationsCount > 0 && (
                        <span className="notification-badge">{unreadNotificationsCount}</span>
                    )}
                    {isNotificationsOpen && (
                        <div className="notification-dropdown">
                            <h3>Notifications</h3>
                            {notifications.length === 0 ? (
                                <p className="empty-notifications">No new notifications</p>
                            ) : (
                                <ul>
                                    {notifications.map(notification => (
                                        <li key={notification._id} className={notification.read ? 'read' : 'unread'}>
                                            <Link to={notification.link} onClick={() => markNotificationAsRead(notification._id)}>
                                                {notification.message}
                                            </Link>
                                        </li>
                                    ))}
                                    {notifications.length > 0 && (
                                        <Link to="/notifications" className="view-all">View All Notifications</Link>
                                    )}
                                </ul>
                            )}
                        </div>
                    )}
                </li>
                <li className="user-icon" ref={profileRef}>
                    <FontAwesomeIcon icon={faUserCircle} size="lg" onClick={toggleProfile} className="clickable" />
                    {isProfileOpen && (
                        <div className="profile-dropdown">
                            <h3>User Profile</h3>
                            <ul>
                                <li>
                                    <Link to="/profile/settings">
                                        <FontAwesomeIcon icon={faCog} className="dropdown-icon" /> Settings
                                    </Link>
                                </li>
                                <li onClick={handleLogout} className="clickable">
                                    <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" /> Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
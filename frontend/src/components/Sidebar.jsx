import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceStats } from '../hooks/useWorkspaceStats';

const Sidebar = ({ isOpen, onClose, notesCount = 0, completedCount = 0 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { archive, pinned } = useWorkspaceStats();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Board', icon: '📋' },
        { path: '/templates', label: 'Templates', icon: '📝' },
        { path: '/archive', label: 'Archive', icon: '🗄️', count: archive },
        { path: '/pinned', label: 'Pinned', icon: '📌', count: pinned },
        { path: '/account-settings', label: 'Account', icon: '👤' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
        { path: '/trash', label: 'Trash', icon: '🗑️' }
    ];

    const progressPerc = notesCount === 0 ? 0 : Math.round((completedCount / notesCount) * 100);

    return (
        <div className={`nkp-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="nkp-brand">NoteKeeper</div>
            
            <div className="nav-menu">
                {navItems.map((item) => (
                    <div 
                        key={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => {
                            navigate(item.path);
                            onClose(); // Close sidebar on navigate (mobile)
                        }}
                    >
                        <span className="icon">{item.icon}</span> {item.label}
                        {item.count > 0 && (
                            <span className="nav-count">{item.count}</span>
                        )}
                    </div>
                ))}

                <div className="nav-item logout-btn" onClick={handleLogout}>
                    <span className="icon">🚪</span> Logout
                </div>
            </div>

            {/* Optional Stats Box - visible on Dashboard usually, but can be global */}
            {notesCount > 0 && (
                <div className="stats-box">
                    <h4 className="stats-title">Storage Sync</h4>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPerc}%` }}></div>
                    </div>
                    <p className="stats-desc">{completedCount} / {notesCount} tasks completed</p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;

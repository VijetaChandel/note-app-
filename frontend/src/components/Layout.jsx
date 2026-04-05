import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = ({ children, notesCount, completedCount, activeTab, onTabChange, showSearch, searchTerm, onSearchChange, actionButton }) => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="nkp-layout">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

                .nkp-layout * { box-sizing: border-box; }

                .nkp-layout {
                    height: 100vh;
                    display: flex;
                    flex-direction: row;
                    font-family: 'Inter', sans-serif;
                    background-color: #f0ebe0;
                    background-image: repeating-linear-gradient(to bottom, transparent, transparent 27px, #e5e0d8 27px, #e5e0d8 28px);
                    position: relative;
                    overflow: hidden;
                }

                /* Red Margin */
                .nkp-layout::before {
                    content: '';
                    position: absolute;
                    left: 258px; /* 200px sidebar + 58px internal margin */
                    top: 0; bottom: 0;
                    width: 2px;
                    background-color: rgba(239, 68, 68, 0.4);
                    z-index: 0;
                    pointer-events: none;
                }

                @media (max-width: 768px) {
                    .nkp-layout::before {
                        left: 58px; /* Adjusted for hidden sidebar */
                    }
                }

                /* Sidebar Layout */
                .nkp-sidebar {
                    width: 200px;
                    background: #1c1410;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    padding: 24px 20px;
                    z-index: 1001;
                    box-shadow: 4px 0 20px rgba(0,0,0,0.15);
                    border-right: 1px solid #3d2b22;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @media (max-width: 768px) {
                    .nkp-sidebar {
                        position: fixed;
                        top: 0; bottom: 0; left: 0;
                        transform: translateX(-100%);
                    }
                    .nkp-sidebar.open {
                        transform: translateX(0);
                    }
                }

                .nkp-brand {
                    font-family: 'Caveat', cursive; font-size: 2rem; color: #d97706; margin-bottom: 40px; transform: rotate(-3deg);
                }

                .nav-menu { display: flex; flex-direction: column; gap: 12px; flex: 1; overflow-y: auto; }
                .nav-item {
                    display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px;
                    color: #a8a29e; font-weight: 500; cursor: pointer; transition: all 0.2s ease;
                }
                .nav-item:hover, .nav-item.active { background: rgba(217, 119, 6, 0.15); color: #d97706; }
                .nav-count { background: rgba(217, 119, 6, 0.2); padding: 2px 6px; borderRadius: 4px; fontSize: 0.75rem; marginLeft: auto; color: #d97706; fontFamily: 'Inter'; }

                .stats-box { background: #291e18; border-radius: 12px; padding: 16px; margin-top: auto; border: 1px solid #3d2b22; }
                .stats-title { font-family: 'Caveat', cursive; font-size: 1.2rem; color: #d97706; margin: 0 0 8px 0; }
                .progress-bar { width: 100%; height: 6px; background: #1c1410; border-radius: 4px; overflow: hidden; margin-bottom: 8px;}
                .progress-fill { height: 100%; background: #d97706; border-radius: 4px; transition: width 0.4s ease; }
                .stats-desc { font-size: 0.75rem; color: #a8a29e; margin: 0; }

                /* Main Content Area */
                .nkp-main { flex: 1; display: flex; flex-direction: column; height: 100vh; position: relative; z-index: 1; }

                /* Top Nav */
                .nkp-topnav {
                    height: 80px;
                    background: rgba(28, 20, 16, 0.85); /* #1c1410 glass */
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 40px; z-index: 100;
                }

                @media (max-width: 768px) {
                    .nkp-topnav { padding: 0 15px; height: 70px; }
                }

                .hamburger-btn {
                    display: none; background: none; border: none; color: #d97706; font-size: 1.5rem; cursor: pointer; z-index: 110;
                }
                @media (max-width: 768px) { .hamburger-btn { display: block; } }

                .mobile-overlay {
                    display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;
                }
                @media (max-width: 768px) { .mobile-overlay.visible { display: block; } }

                .top-tabs { display: flex; gap: 24px; }
                @media (max-width: 768px) { .top-tabs { display: none; } }

                .top-tab {
                    color: #a8a29e; font-family: 'Lora', serif; font-size: 1.1rem;
                    cursor: pointer; position: relative; padding-bottom: 4px;
                }
                .top-tab.active { color: #f5f0e8; font-style: italic; }
                .top-tab.active::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: #d97706; }

                .top-actions { display: flex; align-items: center; gap: 20px; }
                @media (max-width: 768px) { .top-actions { gap: 10px; } }

                .search-bar-expand {
                    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px; padding: 8px 16px; color: #fff; width: 180px;
                    transition: width 0.3s ease, background 0.3s ease;
                }
                .search-bar-expand:focus { width: 260px; outline: none; background: rgba(255, 255, 255, 0.1); border-color: #d97706; }

                @media (max-width: 768px) {
                    .search-bar-expand { width: 110px; font-size: 0.8rem; }
                    .search-bar-expand:focus { width: 130px; }
                }

                .profile-dropdown { color: white; cursor: pointer; font-size: 1.2rem; }
            `}</style>

            {/* Mobile Overlay */}
            <div 
                className={`mobile-overlay ${isSidebarOpen ? 'visible' : ''}`} 
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Shared Sidebar */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                notesCount={notesCount} 
                completedCount={completedCount}
            />

            {/* Layout Content */}
            <div className="nkp-main">
                <div className="nkp-topnav">
                    <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
                    
                    {/* Page Tabs */}
                    <div className="top-tabs">
                        {onTabChange ? (
                            ['Board', 'List', 'Calendar'].map(tab => (
                                <div 
                                    key={tab}
                                    className={`top-tab ${activeTab === tab ? 'active' : ''}`} 
                                    onClick={() => onTabChange(tab)}
                                >
                                    {tab}
                                </div>
                            ))
                        ) : (
                           <div className="top-tab active">Control Center</div>
                        )}
                    </div>

                    {/* Navbar Actions */}
                    <div className="top-actions">
                        {showSearch && (
                            <input 
                                type="text" 
                                className="search-bar-expand" 
                                placeholder="Search cards..." 
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        )}
                        {actionButton}
                        <div className="profile-dropdown" title={user?.name}>👤</div>
                    </div>
                </div>

                {/* Main Render Area */}
                {children}
            </div>
        </div>
    );
};

export default Layout;

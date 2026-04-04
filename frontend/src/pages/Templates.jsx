import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceStats } from '../hooks/useWorkspaceStats';

const Templates = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { archive, pinned } = useWorkspaceStats();
    const [activeFilter, setActiveFilter] = useState('All');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filters = ['All', 'Work', 'Personal', 'Ideas'];

    const templatesData = [
        { id: 1, title: 'Weekly Recap', category: 'Work', bg: '#fffdf7', body: 'Summary of completed tasks, blockers, and goals for next week.' },
        { id: 2, title: 'Project Brainstorm', category: 'Ideas', bg: '#fffdf7', body: 'A blank canvas for mind mapping and throwing out new feature concepts.' },
        { id: 3, title: 'Grocery Run', category: 'Personal', bg: '#fffdf7', body: 'Standardized checklist for weekly supermarket trips.' },
        { id: 4, title: 'Meeting Minutes', category: 'Work', bg: '#fffdf7', body: 'Action items, attendees, and key decisions log.' },
        { id: 5, title: 'Daily Journal', category: 'Personal', bg: '#fffdf7', body: 'Morning reflections, gratitude notes, and evening wrap-up.' },
        { id: 6, title: 'Blog Post Draft', category: 'Ideas', bg: '#fffdf7', body: 'SEO keywords, headings structure, and main content area.' }
    ];

    const filteredTemplates = activeFilter === 'All' 
        ? templatesData 
        : templatesData.filter(t => t.category === activeFilter);

    // Dynamic tag colors
    const getTagColor = (category) => {
        switch(category) {
            case 'Work': return '#22c55e'; // Green
            case 'Ideas': return '#d97706'; // Amber
            case 'Personal': return '#3b82f6'; // Blue
            default: return '#78716c';
        }
    };

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

                /* Sidebar */
                .nkp-sidebar {
                    width: 200px;
                    background: #1c1410;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    padding: 24px 20px;
                    z-index: 10;
                    box-shadow: 4px 0 20px rgba(0,0,0,0.15);
                    border-right: 1px solid #3d2b22;
                }

                .nkp-brand {
                    font-family: 'Caveat', cursive;
                    font-size: 2rem;
                    color: #d97706;
                    margin-bottom: 40px;
                    transform: rotate(-3deg);
                }

                .nav-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    flex: 1;
                }

                .nav-item {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 12px; border-radius: 8px;
                    color: #a8a29e; font-weight: 500; cursor: pointer;
                    transition: all 0.2s ease;
                }

                .nav-item:hover, .nav-item.active {
                    background: rgba(217, 119, 6, 0.15);
                    color: #d97706;
                }

                .stats-box {
                    background: #291e18;
                    border-radius: 12px;
                    padding: 16px;
                    margin-top: auto;
                    border: 1px solid #3d2b22;
                }
                
                .stats-title { font-family: 'Caveat', cursive; font-size: 1.2rem; color: #d97706; margin: 0 0 8px 0; }
                .progress-bar { width: 100%; height: 6px; background: #1c1410; border-radius: 4px; overflow: hidden; margin-bottom: 8px;}
                .progress-fill { height: 100%; background: #d97706; border-radius: 4px; transition: width 0.4s ease; width: 0%; }
                .stats-desc { font-size: 0.75rem; color: #a8a29e; margin: 0; }

                /* Main Content Area */
                .nkp-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    position: relative;
                    z-index: 1;
                }

                /* Top Nav */
                .nkp-topnav {
                    height: 80px;
                    background: rgba(28, 20, 16, 0.85); /* #1c1410 glass */
                    backdrop-filter: blur(12px);
                     border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 40px;
                    z-index: 20;
                }

                .top-tabs {
                    display: flex; gap: 24px;
                }

                .top-tab {
                    color: #a8a29e; font-family: 'Lora', serif; font-size: 1.1rem;
                    cursor: pointer; position: relative; padding-bottom: 4px;
                }
                .top-tab.active { color: #f5f0e8; font-style: italic; }
                .top-tab.active::after {
                    content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: #d97706;
                }

                .top-actions {
                    display: flex; align-items: center; gap: 20px;
                }

                .search-bar-expand {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px; padding: 8px 16px;
                    color: #fff; width: 200px;
                    transition: width 0.3s ease, background 0.3s ease;
                }
                .search-bar-expand:focus { width: 300px; outline: none; background: rgba(255, 255, 255, 0.1); border-color: #d97706; }

                /* ------------------------
                   TEMPLATES SPECIFIC CSS
                   ------------------------ */

                .templates-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 30px 40px;
                    overflow-y: auto;
                }

                /* Filter Bar */
                .filter-bar {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 30px;
                    padding-bottom: 16px;
                    border-bottom: 2px dashed rgba(28, 20, 16, 0.15);
                }

                .bh-chip {
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-family: 'Caveat', cursive;
                    font-size: 1.25rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 1px solid rgba(28, 20, 16, 0.2);
                    background: transparent;
                    color: #1c1410;
                }

                .bh-chip:hover {
                    background: rgba(217, 119, 6, 0.1);
                    border-color: #d97706;
                }

                .bh-chip.active {
                    background: #d97706;
                    color: #1c1410;
                    border-color: #d97706;
                    box-shadow: 0 2px 8px rgba(217, 119, 6, 0.4);
                }

                /* Template Grid */
                .template-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 25px;
                    padding-bottom: 40px;
                }

                /* Template Card */
                .template-card {
                    background: #fffdf7;
                    border-radius: 4px;
                    padding: 24px 20px;
                    position: relative;
                    border: 1px solid rgba(28, 20, 16, 0.1);
                    box-shadow: 3px 3px 0px #1e3a5f;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    display: flex;
                    flex-direction: column;
                }

                .template-card:hover {
                    transform: translateY(-4px) rotate(-1deg);
                    box-shadow: 6px 6px 0px #1e3a5f;
                }

                .card-tape {
                    position: absolute; top: -10px; left: 50%; transform: translateX(-50%) rotate(-2deg);
                    width: 70px; height: 20px; background: rgba(253, 224, 71, 0.6);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05); z-index: 2;
                }

                .card-header {
                    margin-bottom: 12px;
                }

                .t-category-tag {
                    font-family: 'Caveat', cursive;
                    font-size: 1.1rem;
                    background: rgba(0,0,0,0.04);
                    padding: 2px 8px;
                    border-radius: 4px;
                }

                .t-card-title {
                    font-family: 'Lora', serif; font-size: 1.25rem; color: #292524; margin: 0 0 10px 0; line-height: 1.3;
                }

                .t-card-body {
                    font-family: 'Lora', serif; font-style: italic; font-size: 0.9rem; color: #78716c; margin: 0 0 20px 0;
                    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
                    flex: 1;
                }

                .nav-new-btn {
                    width: 100%;
                    background: #1c1410;
                    color: #d97706;
                    border: 1px solid #3d2b22;
                    padding: 10px 0;
                    border-radius: 6px;
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 0 #000;
                    transition: transform 0.1s, box-shadow 0.1s;
                    text-align: center;
                }

                .nav-new-btn:active {
                    transform: translateY(4px);
                    box-shadow: 0 0 0 #000;
                }
                
                .profile-dropdown {
                    color: white; cursor: pointer; font-size: 1.2rem;
                }
            `}</style>

            {/* Sidebar */}
            <div className="nkp-sidebar">
                <div className="nkp-brand">NoteKeeper</div>
                
                <div className="nav-menu">
                    <div className="nav-item" onClick={() => navigate('/dashboard')}>
                        <span className="icon">📋</span> Board
                    </div>
                    <div className="nav-item active" onClick={() => navigate('/templates')}>
                        <span className="icon">📝</span> Templates
                    </div>
                    <div className="nav-item" onClick={() => navigate('/archive')}>
                        <span className="icon">🗄️</span> Archive
                        {archive > 0 && <span style={{ background: 'rgba(217, 119, 6, 0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', marginLeft: 'auto', color: '#d97706', fontFamily: 'Inter' }}>{archive}</span>}
                    </div>
                    <div className="nav-item" onClick={() => navigate('/pinned')}>
                        <span className="icon">📌</span> Pinned
                        {pinned > 0 && <span style={{ background: 'rgba(217, 119, 6, 0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', marginLeft: 'auto', color: '#d97706', fontFamily: 'Inter' }}>{pinned}</span>}
                    </div>
                    <div className="nav-item" onClick={() => navigate('/account-settings')}>
                        <span className="icon">👤</span> Account Settings
                    </div>
                    <div className="nav-item" onClick={() => navigate('/settings')}>
                        <span className="icon">⚙️</span> Settings
                    </div>
                    <div className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto', marginBottom: '20px', color: '#ef4444' }}>
                        <span className="icon">🚪</span> Logout
                    </div>
                </div>

                <div className="stats-box">
                    <h4 className="stats-title">Template Usage</h4>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '45%' }}></div>
                    </div>
                    <p className="stats-desc">Explore our library</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="nkp-main">
                
                {/* Top Nav */}
                <div className="nkp-topnav">
                    <div className="top-tabs">
                        <div className="top-tab" onClick={() => navigate('/dashboard')}>Board</div>
                        <div className="top-tab">List</div>
                        <div className="top-tab active">Library</div>
                    </div>

                    <div className="top-actions">
                        <input 
                            type="text" 
                            className="search-bar-expand" 
                            placeholder="Search templates..." 
                        />
                        <div className="profile-dropdown" title={user?.name}>👤</div>
                    </div>
                </div>

                {/* Templates Specific Container */}
                <div className="templates-container">
                    
                    <div className="filter-bar">
                        {filters.map(filter => (
                            <button 
                                key={filter}
                                className={`bh-chip ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="template-grid">
                        {filteredTemplates.map(template => (
                            <div key={template.id} className="template-card">
                                <div className="card-tape"></div>
                                <div className="card-header">
                                    <span 
                                        className="t-category-tag"
                                        style={{ color: getTagColor(template.category) }}
                                    >
                                        #{template.category.toLowerCase()}
                                    </span>
                                </div>
                                <h3 className="t-card-title">{template.title}</h3>
                                <p className="t-card-body">{template.body}</p>
                                <button className="nav-new-btn">Use Template</button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Templates;

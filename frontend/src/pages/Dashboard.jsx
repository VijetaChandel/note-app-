import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceStats } from '../hooks/useWorkspaceStats';
import api from '../utils/api';
import { toast } from 'react-toastify';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { archive, pinned } = useWorkspaceStats();

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Board');
    const [syncingNoteId, setSyncingNoteId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fetchNotes = useCallback(async () => {
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            
            const response = await api.get('/notes', { params });
            if (response.data.success) {
                // Filter out archived/deleted usually done by backend.
                setNotes(response.data.notes);
            }
        } catch (error) {
            toast.error('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchNotes();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchNotes]);

    const handleSaveNote = async (noteData, noteId, silent = false) => {
        try {
            if (noteId) {
                const response = await api.put(`/notes/${noteId}`, noteData);
                if (response.data.success) {
                    if (!silent) toast.success('Note updated');
                    fetchNotes();
                }
            } else {
                const response = await api.post('/notes', noteData);
                if (response.data.success) {
                    if (!silent) toast.success('Note created');
                    fetchNotes();
                }
            }
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const updateNoteStatus = async (note, newStatus) => {
        const originalNotes = [...notes];
        setNotes(notes.map(n => n._id === note._id ? { ...n, status: newStatus } : n));
        setSyncingNoteId(note._id);

        try {
            const response = await api.put(`/notes/${note._id}`, { ...note, status: newStatus });
            if (!response.data.success) throw new Error('API Sync Failed');
        } catch (error) {
            toast.error(`Sync error. Snapping "${note.title}" back.`);
            setNotes(originalNotes);
        } finally {
            setSyncingNoteId(null);
        }
    };

    const handleUpdateClick = (note, noteId, isStatusMove = false) => {
        if (isStatusMove) {
            updateNoteStatus(notes.find(n => n._id === noteId), note.status);
        } else {
            setCurrentNote(note);
            setIsModalOpen(true);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (window.confirm('Move this note to trash?')) {
            try {
                const response = await api.delete(`/notes/${noteId}`);
                if (response.data.success) {
                    toast.success('Note moved to trash');
                    fetchNotes();
                }
            } catch (error) {
                toast.error('Failed to delete note');
            }
        }
    };

    const handlePinNote = async (noteId) => {
        try {
            const response = await api.put(`/notes/${noteId}/pin`);
            if (response.data.success) {
                toast.success('Note pinned state changed');
                fetchNotes();
            }
        } catch (error) {
            toast.error('Failed to pin note');
        }
    };

    const handleArchiveNote = async (noteId) => {
        try {
            const response = await api.put(`/notes/${noteId}/archive`);
            if (response.data.success) {
                toast.success('Note archived');
                fetchNotes();
            }
        } catch (error) {
            toast.error('Failed to archive note');
        }
    };

    const openCreateModal = () => {
        setCurrentNote(null);
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // --- Native Drag and Drop Logic ---
    const handleDragStart = (e, note) => {
        e.dataTransfer.setData('text/plain', note._id);
        e.dataTransfer.effectAllowed = 'move';
        // Add subtle tilt ghost styling
        setTimeout(() => e.target.classList.add('dragging-tilt'), 0);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging-tilt');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over-active');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over-active');
    };

    const handleDrop = async (e, columnId) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over-active');
        
        const draggedNoteId = e.dataTransfer.getData('text/plain');
        if (!draggedNoteId) return;

        const noteToUpdate = notes.find(n => n._id === draggedNoteId);
        if (noteToUpdate && noteToUpdate.status !== columnId) {
            updateNoteStatus(noteToUpdate, columnId);
        }
    };

    const columns = [
        { id: 'Ideas', title: 'Ideas', color: '#d97706' },
        { id: 'In Progress', title: 'In Progress', color: '#3b82f6' },
        { id: 'Review', title: 'Review', color: '#a855f7' },
        { id: 'Completed', title: 'Completed', color: '#22c55e' }
    ];

    const completedCount = notes.filter(n => n.status === 'Completed').length;
    const progressPerc = notes.length === 0 ? 0 : Math.round((completedCount / notes.length) * 100);

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

                /* Sidebar */
                .nkp-sidebar {
                    width: 200px;
                    background: #1c1410;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    padding: 24px 20px;
                    z-index: 1000;
                    box-shadow: 4px 0 20px rgba(0,0,0,0.15);
                    border-right: 1px solid #3d2b22;
                    transition: transform 0.3s ease;
                }

                @media (max-width: 768px) {
                    .nkp-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        transform: translateX(-100%);
                    }
                    .nkp-sidebar.open {
                        transform: translateX(0);
                    }
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
                .progress-fill { height: 100%; background: #d97706; border-radius: 4px; transition: width 0.4s ease; }
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

                @media (max-width: 768px) {
                    .nkp-topnav {
                        padding: 0 15px;
                        height: 70px;
                    }
                }

                .hamburger-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: #d97706;
                    font-size: 1.5rem;
                    cursor: pointer;
                    z-index: 30;
                }

                @media (max-width: 768px) {
                    .hamburger-btn {
                        display: block;
                    }
                }

                .mobile-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 999;
                }

                @media (max-width: 768px) {
                    .mobile-overlay.visible {
                        display: block;
                    }
                }

                .top-tabs {
                    display: flex; gap: 24px;
                }

                @media (max-width: 768px) {
                    .top-tabs { display: none; }
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

                @media (max-width: 768px) {
                    .search-bar-expand { width: 120px; font-size: 0.8rem; }
                    .search-bar-expand:focus { width: 140px; }
                }

                .btn-new-note {
                    background: #d97706; color: #1c1410;
                    border: none; padding: 10px 20px; border-radius: 8px;
                    font-family: 'Inter', sans-serif; font-weight: 600; cursor: pointer;
                    box-shadow: 0 4px 0 #92400e;
                    transition: transform 0.1s, box-shadow 0.1s;
                }
                .btn-new-note:active {
                    transform: translateY(4px);
                    box-shadow: 0 0 0 #92400e;
                }

                /* Kanban Board */
                .kanban-board-container {
                    flex: 1; overflow-x: auto; overflow-y: hidden; padding: 30px 40px;
                }

                @media (max-width: 768px) {
                    .kanban-board-container { padding: 20px 15px; }
                }

                .kanban-board {
                    display: flex; gap: 24px; height: 100%; min-width: max-content;
                }

                .k-column {
                    width: 320px; height: 100%; display: flex; flex-direction: column;
                    border-radius: 8px; transition: background 0.3s ease, border-color 0.3s ease;
                    border: 2px solid transparent; padding: 10px; margin: -10px;
                }
                
                .k-column.drag-over-active {
                    background: rgba(217, 119, 6, 0.05); border-color: rgba(217, 119, 6, 0.5); border-style: dashed;
                }

                .k-col-header {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px dashed rgba(28, 20, 16, 0.15);
                }

                .k-col-title {
                    font-family: 'Lora', serif; font-size: 1.25rem; font-style: italic; color: #1c1410; margin: 0;
                    display: flex; align-items: center; gap: 8px;
                }

                .k-col-dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }
                
                .k-col-count {
                    font-family: 'Caveat', cursive; font-size: 1.2rem; color: #78716c;
                }

                .k-cards-scroll {
                    flex: 1; overflow-y: auto; padding-right: 10px; padding-bottom: 40px;
                    display: flex; flex-direction: column; gap: 20px;
                }

                /* Custom scrollbar for cards */
                .k-cards-scroll::-webkit-scrollbar { width: 6px; }
                .k-cards-scroll::-webkit-scrollbar-track { background: transparent; }
                .k-cards-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }

                /* Card Design within Dashboard context */
                .kanban-card {
                    background: #fffdf7; border-radius: 4px;
                    padding: 24px 20px; position: relative;
                    border: 1px solid rgba(28, 20, 16, 0.1);
                    box-shadow: 3px 3px 0px #1e3a5f;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                }

                .kanban-card:hover {
                    transform: translateY(-4px) rotate(-1deg); box-shadow: 6px 6px 0px #1e3a5f;
                }

                /* Drag Animation State */
                .kanban-card.dragging-tilt {
                    opacity: 0.6; transform: rotate(5deg) scale(1.02);
                    box-shadow: 12px 12px 0px rgba(30, 58, 95, 0.15);
                    cursor: grabbing; z-index: 50;
                }
                
                .kanban-card.completed-card { opacity: 0.72; }
                .kanban-card.completed-card .card-title { text-decoration: line-through; color: #78716c; }

                .card-tape {
                    position: absolute; top: -10px; left: 50%; transform: translateX(-50%) rotate(-2deg);
                    width: 70px; height: 20px; background: rgba(253, 224, 71, 0.6);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05); z-index: 2;
                }

                .card-header {
                    display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
                }

                .priority-indicator {
                    width: 12px; height: 12px; border-radius: 3px;
                }
                .priority-high { background: #ef4444; }
                .priority-medium { background: #f59e0b; }
                .priority-low { background: #22c55e; }

                .card-actions { visibility: hidden; display: flex; gap: 4px; }
                .kanban-card:hover .card-actions { visibility: visible; }
                
                .card-actions button {
                    background: transparent; border: none; cursor: pointer; opacity: 0.6; font-size: 0.8rem;
                }
                .card-actions button:hover { opacity: 1; transform: scale(1.1); }
                .move-btn { font-weight: bold; color: #1e3a5f; }

                .card-title {
                    font-family: 'Lora', serif; font-size: 1.15rem; color: #292524; margin: 0 0 10px 0; line-height: 1.3;
                }

                .card-checklist-section { margin-bottom: 16px; }

                .card-content {
                    font-family: 'Inter', sans-serif; font-size: 0.875rem; color: #57534e; margin: 0;
                    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
                }

                .card-footer {
                    display: flex; justify-content: space-between; align-items: center; margin-top: auto;
                }

                .card-category-tag {
                    background: rgba(0,0,0,0.04); padding: 4px 8px; border-radius: 4px;
                    font-family: 'Caveat', cursive; font-size: 1rem; color: #57534e;
                }

                .card-date {
                    font-family: 'Inter', sans-serif; font-size: 0.75rem; color: #a8a29e;
                }
                
                .profile-dropdown {
                    color: white; cursor: pointer; font-size: 1.2rem;
                }
            `}</style>

            {/* Mobile Overlay */}
            <div 
                className={`mobile-overlay ${isSidebarOpen ? 'visible' : ''}`} 
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className={`nkp-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="nkp-brand">NoteKeeper</div>
                
                <div className="nav-menu">
                    <div className="nav-item active" onClick={() => navigate('/dashboard')}>
                        <span className="icon">📋</span> Board
                    </div>
                    <div className="nav-item" onClick={() => navigate('/templates')}>
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
                    <div className="nav-item" onClick={() => navigate('/settings')}>
                        <span className="icon">⚙️</span> Settings
                    </div>
                    <div className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto', marginBottom: '20px', color: '#ef4444' }}>
                        <span className="icon">🚪</span> Logout
                    </div>
                </div>

                <div className="stats-box">
                    <h4 className="stats-title">Storage Sync</h4>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPerc}%` }}></div>
                    </div>
                    <p className="stats-desc">{completedCount} / {notes.length} tasks completed</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="nkp-main">
                
                {/* Top Nav */}
                <div className="nkp-topnav">
                    <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
                    <div className="top-tabs">
                        <div className={`top-tab ${activeTab === 'Board' ? 'active' : ''}`} onClick={() => setActiveTab('Board')}>Board</div>
                        <div className={`top-tab ${activeTab === 'List' ? 'active' : ''}`} onClick={() => setActiveTab('List')}>List</div>
                        <div className={`top-tab ${activeTab === 'Calendar' ? 'active' : ''}`} onClick={() => setActiveTab('Calendar')}>Calendar</div>
                    </div>

                    <div className="top-actions">
                        <input 
                            type="text" 
                            className="search-bar-expand" 
                            placeholder="Search cards..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn-new-note" onClick={openCreateModal}>+ New Note</button>
                        <div className="profile-dropdown" title={user?.name}>👤</div>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="kanban-board-container">
                    {loading ? (
                        <div style={{ padding: '40px', fontFamily: 'Caveat', fontSize: '2rem' }}>Loading workspace...</div>
                    ) : (
                        <div className="kanban-board">
                            {columns.map(col => {
                                const colNotes = notes.filter(n => (n.status || 'Ideas') === col.id);
                                return (
                                    <div 
                                        className="k-column" 
                                        key={col.id}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, col.id)}
                                    >
                                        <div className="k-col-header">
                                            <h2 className="k-col-title">
                                                <span className="k-col-dot" style={{ color: col.color, backgroundColor: col.color }}></span>
                                                {col.title}
                                            </h2>
                                            <span className="k-col-count">{colNotes.length}</span>
                                        </div>
                                        
                                        <div className="k-cards-scroll">
                                            {colNotes.map(note => (
                                                <NoteCard
                                                    key={note._id}
                                                    note={note}
                                                    draggable={true}
                                                    isSyncing={syncingNoteId === note._id}
                                                    onDragStart={handleDragStart}
                                                    onDragEnd={handleDragEnd}
                                                    onUpdate={handleUpdateClick}
                                                    onDelete={handleDeleteNote}
                                                    onPin={handlePinNote}
                                                    onArchive={handleArchiveNote}
                                                />
                                            ))}
                                            {colNotes.length === 0 && (
                                                <div style={{ textAlign: 'center', opacity: 0.5, fontFamily: 'Caveat', fontSize: '1.2rem', marginTop: '20px', pointerEvents: 'none' }}>
                                                    {col.id === 'Review' ? "No tasks in review..." : 
                                                     col.id === 'Completed' ? "Nothing completed yet..." : 
                                                     col.id === 'Ideas' ? "Plant new ideas here..." :
                                                     "Drop thoughts here..."}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <NoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveNote}
                note={currentNote}
            />
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceStats } from '../hooks/useWorkspaceStats';
import api from '../utils/api';
import { toast } from 'react-toastify';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

const Pinned = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const { archive, pinned } = useWorkspaceStats();

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);

    const fetchPinnedNotes = useCallback(async () => {
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            const response = await api.get('/notes', { params });
            if (response.data.success) {
                // Filter only pinned notes frontend since there is no backed query exclusively for pinned yet
                const pinnedOnly = response.data.notes.filter(n => n.isPinned === true);
                setNotes(pinnedOnly);
            }
        } catch (error) {
            toast.error('Failed to fetch pinned notes');
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchPinnedNotes();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchPinnedNotes]);

    const handleUnpin = async (noteId) => {
        try {
            const response = await api.put(`/notes/${noteId}/pin`);
            if (response.data.success) {
                toast.success('Note unpinned');
                fetchPinnedNotes();
            }
        } catch (error) {
            toast.error('Failed to unpin note');
        }
    };

    const handleArchive = async (noteId) => {
        try {
            const response = await api.put(`/notes/${noteId}/archive`);
            if (response.data.success) {
                toast.success('Note archived');
                fetchPinnedNotes();
            }
        } catch (error) {
            toast.error('Failed to archive note');
        }
    };

    const handleDelete = async (noteId) => {
        if (window.confirm('Move this note to trash?')) {
            try {
                const response = await api.delete(`/notes/${noteId}`);
                if (response.data.success) {
                    toast.success('Note moved to trash');
                    fetchPinnedNotes();
                }
            } catch (error) {
                toast.error('Failed to delete note');
            }
        }
    };
    
    const handleUpdateClick = (note, noteId, isStatusMove = false) => {
        if (isStatusMove) {
            // Implicit status update (e.g. arrows)
            handleSaveNote(note, noteId, true);
        } else {
            setCurrentNote(note);
            setIsModalOpen(true);
        }
    };

    const handleSaveNote = async (noteData, noteId, silent = false) => {
        try {
            if (noteId) {
                const response = await api.put(`/notes/${noteId}`, noteData);
                if (response.data.success) {
                    if (!silent) toast.success('Note updated');
                    fetchPinnedNotes();
                }
            }
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
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

                .nkp-layout::before {
                    content: ''; position: absolute; left: 258px; top: 0; bottom: 0; width: 2px;
                    background-color: rgba(239, 68, 68, 0.4); z-index: 0; pointer-events: none;
                }

                .nkp-sidebar {
                    width: 200px; background: #1c1410; color: #fff; display: flex; flex-direction: column;
                    padding: 24px 20px; z-index: 10; box-shadow: 4px 0 20px rgba(0,0,0,0.15); border-right: 1px solid #3d2b22;
                }

                .nkp-brand { font-family: 'Caveat', cursive; font-size: 2rem; color: #d97706; margin-bottom: 40px; transform: rotate(-3deg); }

                .nav-menu { display: flex; flex-direction: column; gap: 12px; flex: 1; }
                .nav-item {
                    display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px;
                    color: #a8a29e; font-weight: 500; cursor: pointer; transition: all 0.2s ease;
                }
                .nav-item:hover, .nav-item.active { background: rgba(217, 119, 6, 0.15); color: #d97706; }

                .stats-box { background: #291e18; border-radius: 12px; padding: 16px; margin-top: auto; border: 1px solid #3d2b22; }
                .stats-title { font-family: 'Caveat', cursive; font-size: 1.2rem; color: #d97706; margin: 0 0 8px 0; }
                .stats-desc { font-size: 0.75rem; color: #a8a29e; margin: 0; }

                .nkp-main { flex: 1; display: flex; flex-direction: column; height: 100vh; position: relative; z-index: 1; }

                .nkp-topnav {
                    height: 80px; background: rgba(28, 20, 16, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex; align-items: center; justify-content: space-between; padding: 0 40px; z-index: 20;
                }

                .top-tabs { display: flex; gap: 24px; }
                .top-tab { color: #a8a29e; font-family: 'Lora', serif; font-size: 1.1rem; cursor: pointer; position: relative; padding-bottom: 4px; }
                .top-tab.active { color: #f5f0e8; font-style: italic; }
                .top-tab.active::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: #d97706; }

                .top-actions { display: flex; align-items: center; gap: 20px; }
                .search-bar-expand {
                    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 8px 16px;
                    color: #fff; width: 200px; transition: width 0.3s ease, background 0.3s ease;
                }
                .search-bar-expand:focus { width: 300px; outline: none; background: rgba(255, 255, 255, 0.1); border-color: #d97706; }
                .profile-dropdown { color: white; cursor: pointer; font-size: 1.2rem; }

                /* Grid Layout specifically for Archive/Pinned */
                .notes-grid-container {
                    flex: 1; padding: 30px 40px; overflow-y: auto;
                }

                .notes-grid {
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; padding-bottom: 40px;
                }

                .empty-state {
                    font-family: 'Caveat', cursive; font-size: 2.5rem; color: #78716c; opacity: 0.6;
                    text-align: center; margin-top: 100px; width: 100%; grid-column: 1 / -1;
                }

                /* Required for NoteCard rendering */
                .kanban-card {
                    background: #fffdf7; border-radius: 4px; padding: 24px 20px; position: relative;
                    border: 1px solid rgba(28, 20, 16, 0.1); box-shadow: 3px 3px 0px #1e3a5f;
                    transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; display: flex; flex-direction: column;
                }
                .kanban-card:hover { transform: translateY(-4px) rotate(-1deg); box-shadow: 6px 6px 0px #1e3a5f; }
                .kanban-card.completed-card { opacity: 0.72; }
                .kanban-card.completed-card .card-title { text-decoration: line-through; color: #78716c; }
                .card-tape {
                    position: absolute; top: -10px; left: 50%; transform: translateX(-50%) rotate(-2deg);
                    width: 70px; height: 20px; background: rgba(253, 224, 71, 0.6); box-shadow: 0 1px 2px rgba(0,0,0,0.05); z-index: 2;
                }
                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .priority-indicator { width: 12px; height: 12px; border-radius: 3px; }
                .priority-high { background: #ef4444; } .priority-medium { background: #f59e0b; } .priority-low { background: #22c55e; }
                .card-actions { visibility: hidden; display: flex; gap: 4px; }
                .kanban-card:hover .card-actions { visibility: visible; }
                .card-actions button { background: transparent; border: none; cursor: pointer; opacity: 0.6; font-size: 1rem; }
                .card-actions button:hover { opacity: 1; transform: scale(1.1); }
                .move-btn { font-weight: bold; color: #1e3a5f; }
                .card-title { font-family: 'Lora', serif; font-size: 1.15rem; color: #292524; margin: 0 0 10px 0; line-height: 1.3; }
                .card-checklist-section { margin-bottom: 16px; }
                .card-content { font-family: 'Inter', sans-serif; font-size: 0.875rem; color: #57534e; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
                .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
                .card-category-tag { background: rgba(0,0,0,0.04); padding: 4px 8px; border-radius: 4px; font-family: 'Caveat', cursive; font-size: 1rem; color: #57534e; }
                .card-date { font-family: 'Inter', sans-serif; font-size: 0.75rem; color: #a8a29e; }
            `}</style>

            <div className="nkp-sidebar">
                <div className="nkp-brand">NoteKeeper</div>
                <div className="nav-menu">
                    <div className="nav-item" onClick={() => navigate('/dashboard')}>
                        <span className="icon">📋</span> Board
                    </div>
                    <div className="nav-item" onClick={() => navigate('/templates')}>
                        <span className="icon">📝</span> Templates
                    </div>
                    <div className="nav-item" onClick={() => navigate('/archive')}>
                        <span className="icon">🗄️</span> Archive
                        {archive > 0 && <span style={{ background: 'rgba(217, 119, 6, 0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', marginLeft: 'auto', color: '#d97706', fontFamily: 'Inter' }}>{archive}</span>}
                    </div>
                    <div className="nav-item active" onClick={() => navigate('/pinned')}>
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
                    <h4 className="stats-title">Favorites</h4>
                    <p className="stats-desc">Important scattered thoughts</p>
                </div>
            </div>

            <div className="nkp-main">
                <div className="nkp-topnav">
                    <div className="top-tabs">
                        <div className="top-tab" onClick={() => navigate('/dashboard')}>Board</div>
                        <div className="top-tab active">Pinned Notes</div>
                    </div>
                    <div className="top-actions">
                        <input type="text" className="search-bar-expand" placeholder="Search pinned..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <div className="profile-dropdown" title={user?.name}>👤</div>
                    </div>
                </div>

                <div className="notes-grid-container">
                    {loading ? (
                        <div style={{ padding: '40px', fontFamily: 'Caveat', fontSize: '2rem' }}>Gathering important notes...</div>
                    ) : (
                        <div className="notes-grid">
                            {notes.length === 0 ? (
                                <div className="empty-state">No pinned thoughts yet...</div>
                            ) : (
                                notes.map(note => (
                                    <NoteCard
                                        key={note._id}
                                        note={note}
                                        onUpdate={handleUpdateClick}
                                        onDelete={handleDelete}
                                        onArchive={handleArchive}
                                        onPin={handleUnpin}
                                    />
                                ))
                            )}
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

export default Pinned;

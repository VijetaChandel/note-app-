import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceStats } from '../hooks/useWorkspaceStats';
import api from '../utils/api';
import { toast } from 'react-toastify';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import Layout from '../components/Layout';
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

    const fetchNotes = useCallback(async () => {
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            
            const response = await api.get('/notes', { params });
            if (response.data.success) {
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

    // --- Native Drag and Drop Logic ---
    const handleDragStart = (e, note) => {
        e.dataTransfer.setData('text/plain', note._id);
        e.dataTransfer.effectAllowed = 'move';
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

    return (
        <Layout 
            notesCount={notes.length}
            completedCount={completedCount}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showSearch={true}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            actionButton={<button style={{ background: '#d97706', color: '#fffdf7', border: '2px solid #1e3a5f', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', boxShadow: '4px 4px 0px #1e3a5f', marginLeft: '15px' }} onClick={openCreateModal}>+ New Note</button>}
        >
            <style>{`
                .kanban-board-container {
                    flex: 1; overflow-x: auto; overflow-y: hidden; padding: 20px 30px;
                }

                @media (max-width: 768px) {
                    .kanban-board-container { 
                        padding: 10px 15px; overflow-x: hidden; overflow-y: auto; 
                    }
                }

                .kanban-board {
                    display: flex; gap: 20px; height: 100%; min-width: 100%;
                }

                @media (max-width: 768px) {
                    .kanban-board {
                        flex-direction: column; min-width: 100%; height: auto; gap: 25px;
                    }
                }

                .k-column {
                    flex: 1; min-width: 280px; max-width: 380px; height: 100%; display: flex; flex-direction: column;
                    border-radius: 12px; transition: background 0.3s ease; padding: 12px;
                    background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(28, 20, 16, 0.05);
                }
                
                @media (max-width: 1200px) {
                    .k-column { min-width: 260px; }
                }

                @media (max-width: 768px) {
                    .k-column { width: 100%; max-width: 100%; height: auto; padding: 10px; }
                }

                .k-col-header {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed rgba(28, 20, 16, 0.1);
                }

                .k-col-title {
                    font-family: 'Lora', serif; font-size: 1.15rem; font-style: italic; color: #1c1410; margin: 0;
                    display: flex; align-items: center; gap: 10px;
                }

                .k-col-dot { width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }

                .k-cards-scroll {
                    flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-bottom: 30px;
                    scrollbar-width: thin; scrollbar-color: rgba(28, 20, 16, 0.2) transparent;
                }

                @media (max-width: 768px) {
                    .k-cards-scroll { overflow-y: visible; padding-bottom: 15px; }
                }

                .kanban-card {
                    background: #fffdf7; border-radius: 6px; padding: 20px; position: relative;
                    border: 1px solid rgba(28, 20, 16, 0.08); box-shadow: 4px 4px 0px #1e3a5f;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;
                    word-wrap: break-word; overflow-wrap: break-word;
                }
                .kanban-card:hover { transform: translateY(-3px) rotate(-1deg); box-shadow: 7px 7px 0px #1e3a5f; }
                .card-tape { position: absolute; top: -10px; left: 50%; transform: translateX(-50%) rotate(-1.5deg); width: 60px; height: 18px; background: rgba(253, 224, 71, 0.7); z-index: 2; }
                .card-title { font-family: 'Lora', serif; font-size: 1.1rem; color: #292524; margin: 0 0 8px 0; line-height: 1.3; }
                .card-content { font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #57534e; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5; }
                .drag-over-active { background: rgba(217, 119, 6, 0.08); outline: 2px dashed #d97706; }
            `}</style>

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
                                            <span className="k-col-dot" style={{ backgroundColor: col.color }}></span>
                                            {col.title}
                                        </h2>
                                        <span style={{ fontFamily: 'Caveat', fontSize: '1.2rem' }}>{colNotes.length}</span>
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
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <NoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveNote}
                note={currentNote}
            />
        </Layout>
    );
};

export default Dashboard;

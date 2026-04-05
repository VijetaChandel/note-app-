import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceStats } from '../hooks/useWorkspaceStats';
import api from '../utils/api';
import { toast } from 'react-toastify';
import NoteCard from '../components/NoteCard';
import Layout from '../components/Layout';

const Trash = () => {
    const { user } = useAuth();
    const { refreshStats } = useWorkspaceStats();

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrashNotes = useCallback(async () => {
        try {
            const response = await api.get('/notes', { params: { deleted: 'true' } });
            if (response.data.success) {
                setNotes(response.data.notes);
            }
        } catch (error) {
            toast.error('Failed to fetch trash');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrashNotes();
    }, [fetchTrashNotes]);

    const handleRestore = async (noteId) => {
        try {
            const response = await api.put(`/notes/${noteId}/restore`);
            if (response.data.success) {
                toast.success('Note restored');
                fetchTrashNotes();
                refreshStats();
            }
        } catch (error) {
            toast.error('Failed to restore');
        }
    };

    const handlePermanentDelete = async (noteId) => {
        if (window.confirm('Erase this note forever? This cannot be undone.')) {
            try {
                const response = await api.delete(`/notes/${noteId}/permanent`);
                if (response.data.success) {
                    toast.success('Permanently deleted');
                    fetchTrashNotes();
                    refreshStats();
                }
            } catch (error) {
                toast.error('Failed to erase');
            }
        }
    };

    return (
        <Layout notesCount={notes.length}>
            <style>{`
                .notes-grid-container { flex: 1; padding: 30px 40px; overflow-y: auto; }
                @media (max-width: 768px) { .notes-grid-container { padding: 15px; } }

                .notes-grid {
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; padding-bottom: 40px;
                }
                @media (max-width: 768px) {
                    .notes-grid { grid-template-columns: 1fr; gap: 20px; }
                }

                .empty-state {
                    font-family: 'Caveat', cursive; font-size: 2.5rem; color: #78716c; opacity: 0.6;
                    text-align: center; margin-top: 100px; grid-column: 1 / -1;
                }

                .kanban-card {
                    background: #fffdf7; border-radius: 4px; padding: 24px 20px; position: relative;
                    border: 1px solid rgba(28, 20, 16, 0.1); box-shadow: 3px 3px 0px #ef4444;
                    transition: transform 0.2s ease; cursor: pointer;
                }
                .card-tape { position: absolute; top: -10px; left: 50%; transform: translateX(-50%) rotate(-1.5deg); width: 70px; height: 20px; background: rgba(239, 68, 68, 0.2); z-index: 2; }
                .card-title { font-family: 'Lora', serif; font-size: 1.15rem; color: #292524; margin: 0 0 10px 0; }
                .card-content { font-family: 'Inter', sans-serif; font-size: 0.875rem; color: #57534e; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
            `}</style>

            <div className="notes-grid-container">
                <h1 style={{ fontFamily: 'Caveat', fontSize: '2.5rem', textAlign: 'center', marginBottom: '30px', color: '#ef4444' }}>System Trash Bin</h1>
                {loading ? (
                    <div style={{ padding: '40px', fontFamily: 'Caveat', fontSize: '2rem' }}>Sifting through trash...</div>
                ) : (
                    <div className="notes-grid">
                        {notes.length === 0 ? (
                            <div className="empty-state">Trash is empty...</div>
                        ) : (
                            notes.map(note => (
                                <NoteCard
                                    key={note._id}
                                    note={note}
                                    onDelete={handlePermanentDelete}
                                    onRestore={handleRestore}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Trash;

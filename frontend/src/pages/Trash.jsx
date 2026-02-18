import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';

const Trash = ({ darkMode, toggleDarkMode }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDeletedNotes = async () => {
        try {
            const response = await api.get('/notes', { params: { deleted: 'true' } });
            if (response.data.success) {
                setNotes(response.data.notes);
            }
        } catch (error) {
            toast.error('Failed to fetch deleted notes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeletedNotes();
    }, []);

    const handleRestore = async (noteId) => {
        try {
            const response = await api.put(`/notes/${noteId}/restore`);
            if (response.data.success) {
                toast.success('Note restored successfully');
                fetchDeletedNotes();
            }
        } catch (error) {
            toast.error('Failed to restore note');
        }
    };

    const handlePermanentDelete = async (noteId) => {
        if (window.confirm('Permanently delete this note? This action cannot be undone!')) {
            try {
                const response = await api.delete(`/notes/${noteId}/permanent`);
                if (response.data.success) {
                    toast.success('Note permanently deleted');
                    fetchDeletedNotes();
                }
            } catch (error) {
                toast.error('Failed to delete note');
            }
        }
    };

    const handleEmptyTrash = async () => {
        if (window.confirm('Permanently delete all notes in trash? This action cannot be undone!')) {
            try {
                for (const note of notes) {
                    await api.delete(`/notes/${note._id}/permanent`);
                }
                toast.success('Trash emptied successfully');
                fetchDeletedNotes();
            } catch (error) {
                toast.error('Failed to empty trash');
            }
        }
    };

    return (
        <div className="trash-page">
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>🗑️ Trash</h1>
                        <p className="page-subtitle">
                            {notes.length} {notes.length === 1 ? 'note' : 'notes'} in trash
                        </p>
                    </div>
                    {notes.length > 0 && (
                        <button onClick={handleEmptyTrash} className="btn btn-danger">
                            Empty Trash
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : notes.length > 0 ? (
                    <div className="notes-grid">
                        {notes.map(note => (
                            <div key={note._id} className="trash-note-card">
                                <div
                                    className="note-card"
                                    style={{ backgroundColor: note.backgroundColor }}
                                >
                                    <h3 className="note-title">{note.title}</h3>
                                    <p className="note-content">{note.content}</p>

                                    {note.tags && note.tags.length > 0 && (
                                        <div className="note-tags">
                                            {note.tags.map((tag, index) => (
                                                <span key={index} className="tag">#{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="trash-actions">
                                        <button
                                            onClick={() => handleRestore(note._id)}
                                            className="btn btn-primary"
                                        >
                                            ↩️ Restore
                                        </button>
                                        <button
                                            onClick={() => handlePermanentDelete(note._id)}
                                            className="btn btn-danger"
                                        >
                                            🗑️ Delete Forever
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3>Trash is empty</h3>
                        <p>Deleted notes will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trash;

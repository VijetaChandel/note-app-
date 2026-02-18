import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

const Archive = ({ darkMode, toggleDarkMode }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);

    const fetchArchivedNotes = async () => {
        try {
            const response = await api.get('/notes', { params: { archived: 'true' } });
            if (response.data.success) {
                setNotes(response.data.notes);
            }
        } catch (error) {
            toast.error('Failed to fetch archived notes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArchivedNotes();
    }, []);

    const handleUnarchive = async (noteId) => {
        try {
            const response = await api.put(`/notes/${noteId}/archive`);
            if (response.data.success) {
                toast.success('Note unarchived');
                fetchArchivedNotes();
            }
        } catch (error) {
            toast.error('Failed to unarchive note');
        }
    };

    const handleDelete = async (noteId) => {
        if (window.confirm('Move this note to trash?')) {
            try {
                const response = await api.delete(`/notes/${noteId}`);
                if (response.data.success) {
                    toast.success('Note moved to trash');
                    fetchArchivedNotes();
                }
            } catch (error) {
                toast.error('Failed to delete note');
            }
        }
    };

    const handleUpdateNote = async (noteData, noteId) => {
        try {
            const response = await api.put(`/notes/${noteId}`, noteData);
            if (response.data.success) {
                toast.success('Note updated successfully');
                fetchArchivedNotes();
            }
        } catch (error) {
            toast.error('Failed to update note');
        }
    };

    const openEditModal = (note) => {
        setCurrentNote(note);
        setIsModalOpen(true);
    };

    return (
        <div className="archive-page">
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <div className="page-container">
                <div className="page-header">
                    <h1>🗂️ Archived Notes</h1>
                    <p className="page-subtitle">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'} archived
                    </p>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : notes.length > 0 ? (
                    <div className="notes-grid">
                        {notes.map(note => (
                            <NoteCard
                                key={note._id}
                                note={note}
                                onUpdate={openEditModal}
                                onDelete={handleDelete}
                                onPin={() => { }}
                                onArchive={handleUnarchive}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3>No archived notes</h3>
                        <p>Archived notes will appear here</p>
                    </div>
                )}
            </div>

            <NoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleUpdateNote}
                note={currentNote}
            />
        </div>
    );
};

export default Archive;

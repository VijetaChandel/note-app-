import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

const Dashboard = ({ darkMode, toggleDarkMode }) => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // grid or list

    const fetchNotes = useCallback(async () => {
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (filterPriority) params.priority = filterPriority;

            const response = await api.get('/notes', { params });
            if (response.data.success) {
                setNotes(response.data.notes);
            }
        } catch (error) {
            toast.error('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filterPriority]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchNotes();
        }, 300);

        return () => clearTimeout(debounce);
    }, [fetchNotes]);

    const handleCreateNote = async (noteData) => {
        try {
            const response = await api.post('/notes', noteData);
            if (response.data.success) {
                toast.success('Note created successfully');
                fetchNotes();
            }
        } catch (error) {
            toast.error('Failed to create note');
        }
    };

    const handleUpdateNote = async (noteData, noteId) => {
        try {
            const response = await api.put(`/notes/${noteId}`, noteData);
            if (response.data.success) {
                toast.success('Note updated successfully');
                fetchNotes();
            }
        } catch (error) {
            toast.error('Failed to update note');
        }
    };

    const handleSaveNote = (noteData, noteId) => {
        if (noteId) {
            handleUpdateNote(noteData, noteId);
        } else {
            handleCreateNote(noteData);
        }
    };

    const handlePinNote = async (noteId) => {
        try {
            const response = await api.put(`/notes/${noteId}/pin`);
            if (response.data.success) {
                toast.success(response.data.message);
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
                toast.success(response.data.message);
                fetchNotes();
            }
        } catch (error) {
            toast.error('Failed to archive note');
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

    const openEditModal = (note) => {
        setCurrentNote(note);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentNote(null);
        setIsModalOpen(true);
    };

    const pinnedNotes = notes.filter(note => note.isPinned);
    const regularNotes = notes.filter(note => !note.isPinned);

    return (
        <div className="dashboard">
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <div className="dashboard-container">
                <div className="dashboard-top-header">
                    <div className="welcome-section-right">
                        <div className="welcome-text-side">
                            <h1 className="welcome-title-compact">Welcome back, <span className="user-name-premium">{user?.name}</span>! 👋</h1>
                            <p className="welcome-stats">You have <strong>{notes.length}</strong> total notes</p>
                        </div>

                        <div className="thinking-girl-animation-compact">
                            <div className="speech-bubble-compact">Let's create notes</div>
                            <img
                                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3YybW0yeG1xN2ZqdnZqZ3ZqZ3ZqZ3ZqZ3ZqZ3ZqZ3ZqZ3ZqJmVwPXYxX2ludGVybmFsX2dpZl9hY3Rpb25fcmVuZGVyJmN0PWc/M9ZvDWRVPlY1C3cT0z/giphy.gif"
                                alt="Girl Writing"
                                className="animation-img-compact"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Middle Section: Structured Action Bar */}
                <div className="dashboard-action-bar">
                    <div className="search-container">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search your notes..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="controls-group">
                        <div className="filter-wrapper">
                            <select
                                className="priority-select"
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                            >
                                <option value="">All Priorities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="view-toggle-group">
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                title="Grid View"
                            >
                                ⊞
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                                title="List View"
                            >
                                ☰
                            </button>
                        </div>
                    </div>

                    <button onClick={openCreateModal} className="btn-create-premium">
                        <span className="plus-symbol">+</span> Create Note
                    </button>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        {pinnedNotes.length > 0 && (
                            <div className="notes-section">
                                <h2 className="section-title">📌 Pinned Notes</h2>
                                <div className={`notes-${viewMode}`}>
                                    {pinnedNotes.map(note => (
                                        <NoteCard
                                            key={note._id}
                                            note={note}
                                            onUpdate={openEditModal}
                                            onDelete={handleDeleteNote}
                                            onPin={handlePinNote}
                                            onArchive={handleArchiveNote}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {regularNotes.length > 0 && (
                            <div className="notes-section">
                                <h2 className="section-title">📝 All Notes</h2>
                                <div className={`notes-${viewMode}`}>
                                    {regularNotes.map(note => (
                                        <NoteCard
                                            key={note._id}
                                            note={note}
                                            onUpdate={openEditModal}
                                            onDelete={handleDeleteNote}
                                            onPin={handlePinNote}
                                            onArchive={handleArchiveNote}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {notes.length === 0 && (
                            <div className="empty-state">
                                <h3>No notes yet</h3>
                                <p>Create your first note to get started!</p>
                            </div>
                        )}
                    </>
                )}
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

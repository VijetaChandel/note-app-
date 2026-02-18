import { toast } from 'react-toastify';

const NoteCard = ({ note, onUpdate, onDelete, onPin, onArchive }) => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#ff4444';
            case 'Medium': return '#ffaa00';
            case 'Low': return '#44ff44';
            default: return '#888';
        }
    };

    return (
        <div
            className="note-card"
            style={{
                backgroundColor: note.backgroundColor,
                color: isDarkMode ? '#f1f5f9' : undefined
            }}
        >
            <div className="note-header">
                <h3 className="note-title">{note.title}</h3>
                {note.isPinned && <span className="pin-badge">📌</span>}
            </div>

            <p className="note-content">{note.content}</p>

            {note.tags && note.tags.length > 0 && (
                <div className="note-tags">
                    {note.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                    ))}
                </div>
            )}

            <div className="note-footer">
                <div className="note-meta">
                    <span
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(note.priority) }}
                    >
                        {note.priority}
                    </span>
                    <span className="note-date">{formatDate(note.updatedAt)}</span>
                </div>

                <div className="note-actions">
                    <button
                        onClick={() => onPin(note._id)}
                        className="btn-icon"
                        title={note.isPinned ? 'Unpin' : 'Pin'}
                    >
                        📌
                    </button>
                    <button
                        onClick={() => onArchive(note._id)}
                        className="btn-icon"
                        title={note.isArchived ? 'Unarchive' : 'Archive'}
                    >
                        🗂️
                    </button>
                    <button
                        onClick={() => onUpdate(note)}
                        className="btn-icon"
                        title="Edit"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => onDelete(note._id)}
                        className="btn-icon"
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;

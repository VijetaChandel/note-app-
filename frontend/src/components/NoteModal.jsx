import { useState, useEffect } from 'react';

const NoteModal = ({ isOpen, onClose, onSave, note }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        priority: 'Low',
        backgroundColor: '#ffffff'
    });

    useEffect(() => {
        if (note) {
            setFormData({
                title: note.title,
                content: note.content,
                tags: note.tags?.join(', ') || '',
                priority: note.priority,
                backgroundColor: note.backgroundColor || '#ffffff'
            });
        } else {
            setFormData({
                title: '',
                content: '',
                tags: '',
                priority: 'Low',
                backgroundColor: '#ffffff'
            });
        }
    }, [note, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const noteData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        onSave(noteData, note?._id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>
                    <button onClick={onClose} className="btn-close">×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter note title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content *</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your note content..."
                            rows="6"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="tags">Tags (comma-separated)</label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="work, personal, ideas"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="backgroundColor">Background Color</label>
                        <div className="color-picker">
                            <input
                                type="color"
                                id="backgroundColor"
                                name="backgroundColor"
                                value={formData.backgroundColor}
                                onChange={handleChange}
                            />
                            <span>{formData.backgroundColor}</span>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {note ? 'Update Note' : 'Create Note'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteModal;

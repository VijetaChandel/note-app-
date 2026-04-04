import { useState, useEffect } from 'react';

const STATUS_OPTIONS = [
    { value: 'Ideas', label: 'Ideas', color: '#d97706', glow: 'rgba(217,119,6,0.5)' },
    { value: 'In Progress', label: 'In Progress', color: '#3b82f6', glow: 'rgba(59,130,246,0.5)' },
    { value: 'Review', label: 'Review', color: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
    { value: 'Completed', label: 'Completed', color: '#22c55e', glow: 'rgba(34,197,94,0.5)' }
];

const getStatusColor = (status) => {
    const found = STATUS_OPTIONS.find(s => s.value === status);
    return found ? found.color : '#d97706';
};

const NoteModal = ({ isOpen, onClose, onSave, note }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        priority: 'Low',
        status: 'Ideas',
        backgroundColor: '#ffffff'
    });

    const [statusOpen, setStatusOpen] = useState(false);

    useEffect(() => {
        if (note) {
            setFormData({
                title: note.title,
                content: note.content,
                tags: note.tags?.join(', ') || '',
                priority: note.priority,
                status: note.status || 'Ideas',
                backgroundColor: note.backgroundColor || '#ffffff'
            });
        } else {
            setFormData({
                title: '',
                content: '',
                tags: '',
                priority: 'Low',
                status: 'Ideas',
                backgroundColor: '#ffffff'
            });
        }
        setStatusOpen(false);
    }, [note, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStatusSelect = (value) => {
        setFormData({ ...formData, status: value });
        setStatusOpen(false);
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

    const currentStatusColor = getStatusColor(formData.status);

    return (
        <div className="nb-modal-overlay" onClick={onClose}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

                .nb-modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 1000; padding: 24px;
                    animation: nbModalFadeIn 0.3s ease;
                }
                @keyframes nbModalFadeIn { from { opacity: 0; } to { opacity: 1; } }

                /* ===== NOTEBOOK PAPER MODAL ===== */
                .nb-modal-card {
                    background-color: #fffdf7;
                    background-image: repeating-linear-gradient(
                        to bottom, transparent, transparent 31px, #f1ece1 31px, #f1ece1 32px
                    );
                    border-radius: 6px;
                    border: 1.5px solid #1e3a5f;
                    box-shadow:
                        3px 3px 0px #e5dcc8,
                        6px 6px 0px #d4c9b0,
                        0 25px 50px rgba(0,0,0,0.25);
                    width: 100%; max-width: 680px;
                    position: relative;
                    display: flex; flex-direction: column;
                    overflow: visible;
                    font-family: 'Inter', sans-serif;
                    animation: nbModalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes nbModalSlideUp {
                    from { transform: translateY(25px) rotate(-0.5deg); opacity: 0; }
                    to { transform: translateY(0) rotate(0); opacity: 1; }
                }

                /* Red margin line inside modal */
                .nb-modal-card::before {
                    content: '';
                    position: absolute;
                    left: 52px; top: 0; bottom: 0;
                    width: 2px;
                    background-color: rgba(239, 68, 68, 0.35);
                    z-index: 1;
                    pointer-events: none;
                }

                /* Card Tape */
                .nb-modal-tape {
                    position: absolute;
                    top: -12px; left: 50%;
                    transform: translateX(-50%) rotate(-2deg);
                    width: 100px; height: 24px;
                    background: rgba(253, 224, 71, 0.7);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                    z-index: 3;
                }

                /* Header */
                .nb-modal-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 26px 30px 16px 65px;
                    border-bottom: 2px dashed rgba(28, 20, 16, 0.1);
                }
                .nb-modal-header h2 {
                    margin: 0;
                    font-family: 'Lora', serif;
                    font-size: 1.3rem; font-weight: 600;
                    color: #292524;
                    display: flex; align-items: center; gap: 10px;
                }
                .nb-modal-header h2 .header-dot {
                    width: 10px; height: 10px; border-radius: 50%;
                    transition: background-color 0.4s ease, box-shadow 0.4s ease;
                }
                .nb-modal-close {
                    background: none; border: none;
                    font-size: 1.5rem; color: #a8a29e; cursor: pointer;
                    transition: color 0.2s; line-height: 1;
                    font-family: 'Inter', sans-serif;
                }
                .nb-modal-close:hover { color: #292524; }

                /* Body */
                .nb-modal-body {
                    padding: 20px 30px 20px 65px;
                    display: flex; flex-direction: column; gap: 20px;
                    flex: 1;
                }

                .nb-mod-group { position: relative; }
                .nb-mod-label {
                    display: block;
                    font-family: 'Lora', serif;
                    font-size: 0.78rem; text-transform: uppercase;
                    letter-spacing: 0.06em; color: #78716c;
                    font-weight: 600; margin-bottom: 4px;
                }

                .nb-mod-input, .nb-mod-textarea {
                    width: 100%; background: transparent; border: none;
                    border-bottom: 1.5px solid #d4c9b0;
                    color: #292524; font-family: 'Inter', sans-serif; font-size: 1rem;
                    outline: none; padding: 6px 4px 8px;
                    transition: border-color 0.3s; line-height: 1.75;
                }
                .nb-mod-input::placeholder, .nb-mod-textarea::placeholder {
                    color: #a8a29e; font-style: italic; font-weight: 300;
                }
                .nb-mod-input:focus, .nb-mod-textarea:focus {
                    border-bottom-color: #d97706;
                }

                .nb-mod-title-input {
                    font-size: 1.35rem; font-weight: 600;
                    font-family: 'Lora', serif;
                    color: #292524;
                }
                .nb-mod-title-input::placeholder {
                    font-family: 'Lora', serif; font-style: italic;
                }

                .nb-mod-textarea {
                    resize: vertical; min-height: 120px;
                    line-height: 31px;
                }

                .nb-mod-row {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
                }

                /* Priority Select */
                .nb-mod-select {
                    width: 100%; background: transparent; border: none;
                    border-bottom: 1.5px solid #d4c9b0;
                    color: #292524; font-family: 'Inter', sans-serif;
                    font-size: 0.95rem; cursor: pointer; padding: 6px 4px 8px;
                    outline: none; appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2378716c' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 4px center;
                }
                .nb-mod-select:focus { border-bottom-color: #d97706; }
                .nb-mod-select option { background: #fffdf7; color: #292524; }

                /* ===== CUSTOM STATUS SELECTOR ===== */
                .nb-status-selector {
                    position: relative;
                    width: 100%;
                }

                .nb-status-trigger {
                    width: 100%; background: transparent; border: none;
                    border-bottom: 1.5px solid #d4c9b0;
                    padding: 6px 4px 8px;
                    font-family: 'Inter', sans-serif; font-size: 0.95rem;
                    color: #292524; cursor: pointer;
                    display: flex; align-items: center; gap: 10px;
                    transition: border-color 0.3s;
                    text-align: left;
                }
                .nb-status-trigger:focus,
                .nb-status-trigger.open {
                    border-bottom-color: #d97706;
                    outline: none;
                }

                .nb-status-dot {
                    width: 12px; height: 12px; border-radius: 50%;
                    flex-shrink: 0;
                    transition: background-color 0.4s ease, box-shadow 0.4s ease;
                }

                .nb-status-arrow {
                    margin-left: auto;
                    font-size: 0.7rem; color: #78716c;
                    transition: transform 0.3s ease;
                }
                .nb-status-arrow.open { transform: rotate(180deg); }

                /* Dropdown Menu */
                .nb-status-menu {
                    position: absolute;
                    top: calc(100% + 6px); left: 0; right: 0;
                    background: #fffdf7;
                    border: 1.5px solid #d4c9b0;
                    border-radius: 6px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12), 3px 3px 0 #e5dcc8;
                    z-index: 50;
                    overflow: hidden;
                    animation: nbDropdownIn 0.2s ease;
                }
                @keyframes nbDropdownIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .nb-status-option {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 14px;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif; font-size: 0.95rem;
                    color: #292524;
                    transition: background 0.15s ease;
                    border-bottom: 1px solid rgba(212, 201, 176, 0.3);
                }
                .nb-status-option:last-child { border-bottom: none; }
                .nb-status-option:hover {
                    background: rgba(217, 119, 6, 0.08);
                }
                .nb-status-option.selected {
                    background: rgba(217, 119, 6, 0.12);
                    font-weight: 600;
                }
                .nb-status-option-label { flex: 1; }
                .nb-status-option-check {
                    font-size: 0.85rem; color: #d97706;
                }

                /* Hint text */
                .nb-mod-hint {
                    font-family: 'Caveat', cursive; font-size: 1rem;
                    color: #a8a29e; margin-top: 4px;
                }

                /* Color picker row */
                .nb-color-row {
                    display: flex; align-items: center; gap: 14px; padding: 4px 0;
                }
                .nb-color-circle {
                    width: 26px; height: 26px; border-radius: 50%;
                    border: 2px solid #d4c9b0; cursor: pointer;
                    transition: transform 0.2s, border-color 0.2s;
                    box-shadow: 1px 1px 3px rgba(0,0,0,0.08);
                }
                .nb-color-circle:hover { transform: scale(1.1); border-color: #d97706; }
                .nb-color-hint {
                    font-family: 'Caveat', cursive; font-size: 1.05rem; color: #a8a29e;
                }

                /* Footer */
                .nb-modal-footer {
                    padding: 14px 30px 14px 65px;
                    border-top: 2px dashed rgba(28, 20, 16, 0.1);
                    display: flex; justify-content: space-between; align-items: center;
                    background: rgba(245, 240, 232, 0.5);
                }

                .nb-btn-cancel {
                    background: transparent; border: none;
                    color: #a8a29e; font-family: 'Lora', serif;
                    font-style: italic; font-size: 0.95rem;
                    cursor: pointer; padding: 8px 14px;
                    transition: color 0.2s;
                }
                .nb-btn-cancel:hover { color: #292524; }

                .nb-btn-save {
                    background: #292524; color: #d97706;
                    border: none; border-radius: 4px;
                    padding: 10px 24px;
                    font-family: 'Lora', serif; font-style: italic;
                    font-size: 1rem; font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 3px 0 #1c1410;
                    transition: all 0.15s ease;
                    display: flex; align-items: center; gap: 8px;
                }
                .nb-btn-save:hover {
                    background: #1c1917;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 0 #1c1410;
                }
                .nb-btn-save:active {
                    transform: translateY(3px);
                    box-shadow: 0 0 0 #1c1410;
                }
            `}</style>

            <div className="nb-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="nb-modal-tape"></div>

                <div className="nb-modal-header">
                    <h2>
                        <span
                            className="header-dot"
                            style={{
                                backgroundColor: currentStatusColor,
                                boxShadow: `0 0 8px ${currentStatusColor}`
                            }}
                        ></span>
                        {note ? 'Edit Note' : 'New Note'}
                    </h2>
                    <button onClick={onClose} className="nb-modal-close">×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', margin: 0, flex: 1 }}>
                    <div className="nb-modal-body">
                        
                        {/* Title */}
                        <div className="nb-mod-group">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="nb-mod-input nb-mod-title-input"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Give your thought a title..."
                                required
                            />
                        </div>

                        {/* Content */}
                        <div className="nb-mod-group">
                            <textarea
                                id="content"
                                name="content"
                                className="nb-mod-textarea"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Write your note here..."
                                required
                            />
                        </div>

                        {/* Tags */}
                        <div className="nb-mod-group">
                            <label className="nb-mod-label">Tags</label>
                            <input
                                type="text"
                                name="tags"
                                className="nb-mod-input"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="work, ideas, personal..."
                            />
                            <span className="nb-mod-hint">separate with commas</span>
                        </div>

                        <div className="nb-mod-row">
                            {/* Priority */}
                            <div className="nb-mod-group">
                                <label className="nb-mod-label">Priority</label>
                                <select name="priority" className="nb-mod-select" value={formData.priority} onChange={handleChange}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            {/* Status — Custom Dropdown with Color Dots */}
                            <div className="nb-mod-group">
                                <label className="nb-mod-label">Status</label>
                                <div className="nb-status-selector">
                                    <button
                                        type="button"
                                        className={`nb-status-trigger ${statusOpen ? 'open' : ''}`}
                                        onClick={() => setStatusOpen(!statusOpen)}
                                    >
                                        <span
                                            className="nb-status-dot"
                                            style={{
                                                backgroundColor: currentStatusColor,
                                                boxShadow: `0 0 6px ${currentStatusColor}`
                                            }}
                                        ></span>
                                        {formData.status}
                                        <span className={`nb-status-arrow ${statusOpen ? 'open' : ''}`}>▼</span>
                                    </button>

                                    {statusOpen && (
                                        <div className="nb-status-menu">
                                            {STATUS_OPTIONS.map(opt => (
                                                <div
                                                    key={opt.value}
                                                    className={`nb-status-option ${formData.status === opt.value ? 'selected' : ''}`}
                                                    onClick={() => handleStatusSelect(opt.value)}
                                                >
                                                    <span
                                                        className="nb-status-dot"
                                                        style={{
                                                            backgroundColor: opt.color,
                                                            boxShadow: `0 0 6px ${opt.glow}`
                                                        }}
                                                    ></span>
                                                    <span className="nb-status-option-label">{opt.label}</span>
                                                    {formData.status === opt.value && (
                                                        <span className="nb-status-option-check">✓</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="nb-mod-hint">where does this thought belong?</span>
                            </div>
                        </div>

                        {/* Color Tag */}
                        <div className="nb-mod-group">
                            <label className="nb-mod-label">Color Tag</label>
                            <div className="nb-color-row">
                                <input
                                    type="color"
                                    id="backgroundColor"
                                    name="backgroundColor"
                                    value={formData.backgroundColor}
                                    onChange={handleChange}
                                    style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }}
                                />
                                <div 
                                    className="nb-color-circle" 
                                    style={{ backgroundColor: formData.backgroundColor }}
                                    onClick={() => document.getElementById('backgroundColor').click()}
                                ></div>
                                <span className="nb-color-hint">optional trace color ({formData.backgroundColor})</span>
                            </div>
                        </div>

                    </div>

                    <div className="nb-modal-footer">
                        <button type="button" onClick={onClose} className="nb-btn-cancel">
                            Dismiss
                        </button>
                        <button type="submit" className="nb-btn-save">
                            {note ? 'Save Changes' : 'Create Note'} →
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteModal;

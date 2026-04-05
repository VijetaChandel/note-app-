import React, { useState } from 'react';
import { HiSparkles } from 'react-icons/hi'; // Sparkle icon
import api from '../utils/api';


const NoteCard = ({ note, onUpdate, onDelete, onPin, onArchive, onRestore, draggable, onDragStart, onDragEnd, isSyncing }) => {
    // AI feature state
    const [showAIDropdown, setShowAIDropdown] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState('');
    const [aiAction, setAiAction] = useState('');
    const statuses = ['Ideas', 'In Progress', 'Review', 'Completed'];
    const currentStatusIndex = statuses.indexOf(note.status || 'Ideas');
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    const handleNextStatus = () => {
        if (currentStatusIndex < statuses.length - 1) {
            onUpdate({ ...note, status: statuses[currentStatusIndex + 1] }, note._id, true);
        }
    };
    
    const handlePrevStatus = () => {
        if (currentStatusIndex > 0) {
            onUpdate({ ...note, status: statuses[currentStatusIndex - 1] }, note._id, true);
        }
    };

    const handleArchiveClick = (e) => {
        e.stopPropagation();
        if (!note.isArchived) {
            setIsAnimatingOut(true);
            setTimeout(() => onArchive(note._id), 300);
        } else {
            onArchive(note._id);
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setIsAnimatingOut(true);
        setTimeout(() => onDelete(note._id), 300);
    };

    const handleAI = async (action) => {
        setAiLoading(true);
        setAiResult('');
        setAiAction(action);
        try {
            const response = await api.post('/ai/process', {
                noteContent: note.content,
                action,
            });
            setAiResult(response.data.aiResponse || 'No result returned');
        } catch (err) {
            console.error('AI error:', err);
            setAiResult('Error processing AI request');
        } finally {
            setAiLoading(false);
        }
    };

    const isCompleted = note.status === 'Completed';

    return (
        <div 
            draggable={draggable}
            onDragStart={onDragStart ? (e) => onDragStart(e, note) : undefined}
            onDragEnd={onDragEnd}
            className={`kanban-card ${isCompleted ? 'completed-card' : ''} ${isAnimatingOut ? 'card-slide-out' : ''}`}
            style={{ backgroundColor: note.backgroundColor !== '#ffffff' ? note.backgroundColor : '#fffdf7' }}
        >
            <style>{`
                .kanban-card { transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.2s ease; position: relative; }
                .ai-hint { font-size: 0.95rem; line-height: 1.4; }
                .card-slide-out { transform: translateX(100px) !important; opacity: 0 !important; pointer-events: none; }
                .action-icon-always {
                    background: transparent; border: none; cursor: pointer;
                    font-size: 1rem; opacity: 1 !important; visibility: visible !important;
                    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .action-icon-always:hover { transform: scale(1.15); }
                .footer-actions { display: flex; gap: 8px; align-items: center; }
                .top-right-pin { position: absolute; top: 16px; right: 16px; z-index: 10; font-size: 1.2rem; }
            `}</style>
            
            <div className="card-tape"></div>
            
            {!note.isDeleted && onPin && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onPin(note._id); }} 
                    title={note.isPinned ? "Unpin Note" : "Pin Note"}
                    className="action-icon-always top-right-pin"
                    style={{ color: note.isPinned ? '#d97706' : '#a8a29e', textShadow: note.isPinned ? '0 0 8px rgba(217, 119, 6, 0.4)' : 'none' }}
                >📌</button>
            )}

            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {/* Dynamic Status Indicator Dot (Top Left) */}
                    <span style={{
                        width: '12px', height: '12px', borderRadius: '50%',
                        backgroundColor: note.status === 'Completed' ? '#22c55e' : 
                                       note.status === 'Review' ? '#a855f7' : 
                                       note.status === 'In Progress' ? '#3b82f6' : '#d97706',
                        boxShadow: `0 0 6px ${note.status === 'Completed' ? '#22c55e' : 
                                       note.status === 'Review' ? '#a855f7' : 
                                       note.status === 'In Progress' ? '#3b82f6' : '#d97706'}`,
                        transition: 'background-color 0.4s ease, box-shadow 0.4s ease'
                    }} title={`Status: ${note.status || 'Ideas'}`}></span>
                    
                    <span className={`priority-indicator priority-${note.priority?.toLowerCase() || 'low'}`} title={`Priority: ${note.priority || 'Low'}`}></span>
                    {isSyncing && <span style={{ fontSize: '0.8rem', color: '#1e3a5f', fontFamily: 'Caveat', fontStyle: 'italic', marginLeft: '5px' }}>Syncing...</span>}
                </div>
            </div>

            <h3 className="card-title" style={{ paddingRight: '20px' }}>{note.title}</h3>
            
            <div className="card-checklist-section">
                <p className="card-content">{note.content}</p>
            </div>

            <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div className="footer-left">
                    {note.tags && note.tags.length > 0 && (
                        <span className="card-category-tag">#{note.tags[0]}</span>
                    )}
                </div>
                
                <div className="footer-actions">
                    {!note.isDeleted && !note.isArchived && currentStatusIndex > 0 && <button onClick={handlePrevStatus} title="Move Left" className="action-icon-always move-btn">←</button>}
                    {!note.isDeleted && !note.isArchived && currentStatusIndex < statuses.length - 1 && <button onClick={handleNextStatus} title="Move Right" className="action-icon-always move-btn">→</button>}
                    {!note.isDeleted && <button onClick={() => onUpdate(note, note._id, false)} title="Edit Note" className="action-icon-always">✏️</button>}
                    
                    {onRestore && note.isDeleted && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRestore(note._id); }} 
                            title="Restore Note"
                            className="action-icon-always"
                        >↺</button>
                    )}

                    {!note.isDeleted && onArchive && (
                        <button 
                            onClick={handleArchiveClick} 
                            title={note.isArchived ? "Unarchive Note" : "Archive Note"}
                            className="action-icon-always"
                        >{note.isArchived ? "📤" : "📥"}</button>
                    )}
                    <button onClick={handleDeleteClick} title={note.isDeleted ? "Delete Permanently" : "Delete Note"} className="action-icon-always delete-icon">🗑️</button>
                    
                    {/* Magic AI Button - Hide in Trash */}
                    {!note.isDeleted && (
                        <div className="relative inline-block">
                            <button
                                onClick={() => setShowAIDropdown(!showAIDropdown)}
                                title="Magic AI"
                                className="action-icon-always"
                            >
                                <HiSparkles />
                            </button>
                            {showAIDropdown && (
                                <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                                    <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAI('summarize')}>Summarize</li>
                                    <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAI('improve')}>Improve Grammar</li>
                                    <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAI('tags')}>Generate Tags</li>
                                </ul>
                            )}
                        </div>
                    )}
                </div>
                {/* AI response sticky note */}
                {aiLoading && (
                    <div className="flex items-center justify-center mt-2 text-gray-600">
                        <svg className="animate-spin h-5 w-5 mr-2 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Thinking...
                    </div>
                )}
                {aiResult && (
                    <div className="ai-hint mt-2 p-3 border-l-4 border-yellow-400 bg-[#fffbeb] rounded shadow-sm" style={{fontFamily: 'Caveat, cursive'}}>
                        {aiResult}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteCard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceStats } from '../hooks/useWorkspaceStats';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Settings = ({ darkMode, toggleDarkMode }) => {
    const { logout, user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const { archive, pinned, total, refreshStats } = useWorkspaceStats();

    const [defaultView, setDefaultView] = useState(localStorage.getItem('defaultView') || '/dashboard');

    const handleViewChange = (e) => {
        const selectedView = e.target.value;
        setDefaultView(selectedView);
        localStorage.setItem('defaultView', selectedView);
        toast.info('Landing preference saved');
    };

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
    const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    // Live validation
    const isEmailValid = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isNameValid = name.trim().length >= 2;
    const isReadyToSave = isEmailValid && isNameValid && (newPassword ? newPassword.length >= 8 && currentPassword.length > 0 : true);

    useEffect(() => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setProfilePicture(user?.profilePicture || '');
        if (user?.dateOfBirth) {
            setDateOfBirth(new Date(user.dateOfBirth).toISOString().split('T')[0]);
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleUpdateProfile = async () => {
        if (!isReadyToSave) return;
        if (newPassword && !currentPassword) {
            toast.error("Current password required to change password.");
            return;
        }

        setIsSaving(true);
        const success = await updateProfile(name, email, currentPassword, newPassword, profilePicture, dateOfBirth);
        setIsSaving(false);
        
        if (success) {
            setCurrentPassword('');
            setNewPassword('');
        }
    };

    const handleClearTrash = async () => {
        try {
            const response = await api.delete('/notes/trash/empty');
            if (response.data.success) {
                toast.success('System Trash cleared successfully 🚀');
                refreshStats();
            }
        } catch (error) {
            toast.error('Failed to clear trash');
        }
    };

    const MAX_NOTES = 100;
    const usagePercent = Math.min(Math.round((total / MAX_NOTES) * 100), 100) || 0;

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
                    background-color: #f5f0e8;
                    background-image: repeating-linear-gradient(
                        to bottom, transparent, transparent 27px, #e5e0d8 27px, #e5e0d8 28px
                    );
                    position: relative;
                    overflow: hidden;
                    color: #292524;
                }

                /* Red Margin Line */
                .nkp-layout::before {
                    content: '';
                    position: absolute;
                    left: 280px;
                    top: 0; bottom: 0;
                    width: 2px;
                    background-color: rgba(239, 68, 68, 0.35);
                    z-index: 0;
                    pointer-events: none;
                }

                /* Floating Sticky Chips */
                .note-chip {
                    position: fixed;
                    padding: 8px 14px;
                    font-family: 'Caveat', cursive;
                    font-size: 1.15rem;
                    color: #57534e;
                    box-shadow: 2px 2px 8px rgba(0,0,0,0.08);
                    z-index: 0;
                    pointer-events: none;
                    border-radius: 2px;
                }
                .chip-1 { top: 12%; right: 8%; background: #fef08a; transform: rotate(5deg); }
                .chip-2 { bottom: 18%; right: 12%; background: #bbf7d0; transform: rotate(-4deg); }
                .chip-3 { bottom: 12%; left: 55%; background: #fed7aa; transform: rotate(3deg); }

                /* Sidebar — Notebook Spine */
                .nkp-sidebar {
                    width: 200px;
                    background: #1c1410;
                    color: #fff;
                    display: flex; flex-direction: column;
                    padding: 24px 20px;
                    z-index: 10;
                    box-shadow: 4px 0 20px rgba(0,0,0,0.15);
                    border-right: 1px solid #3d2b22;
                }

                .nkp-brand {
                    font-family: 'Caveat', cursive; font-size: 2rem;
                    color: #d97706; margin-bottom: 40px; transform: rotate(-3deg);
                }

                .nav-menu { display: flex; flex-direction: column; gap: 12px; flex: 1; }
                .nav-item {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 12px; border-radius: 8px;
                    color: #a8a29e; font-weight: 500; cursor: pointer;
                    transition: all 0.2s ease;
                }
                .nav-item:hover, .nav-item.active {
                    background: rgba(217, 119, 6, 0.15); color: #d97706;
                }

                .stats-box {
                    background: #291e18; border-radius: 12px; padding: 16px;
                    margin-top: auto; border: 1px solid #3d2b22;
                }
                .stats-title { font-family: 'Caveat', cursive; font-size: 1.2rem; color: #d97706; margin: 0 0 8px 0; }
                .stats-desc { font-size: 0.75rem; color: #a8a29e; margin: 0; }

                /* Main Content */
                .nkp-main { flex: 1; display: flex; flex-direction: column; height: 100vh; position: relative; z-index: 1; }

                .nkp-topnav {
                    height: 80px;
                    background: rgba(28, 20, 16, 0.85);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 40px; z-index: 20;
                }

                .top-tabs { display: flex; gap: 24px; }
                .top-tab {
                    color: #a8a29e; font-family: 'Lora', serif; font-size: 1.1rem;
                    cursor: pointer; position: relative; padding-bottom: 4px;
                }
                .top-tab.active { color: #f5f0e8; font-style: italic; }
                .top-tab.active::after {
                    content: ''; position: absolute; bottom: 0; left: 0;
                    width: 100%; height: 2px; background: #d97706;
                }

                .top-actions { display: flex; align-items: center; gap: 20px; }
                .profile-dropdown { color: white; cursor: pointer; font-size: 1.2rem; }
                .su-name { color: #f5f0e8; font-family: 'Inter'; font-size: 0.9rem; font-weight: 500; }

                /* Scroll Area */
                @keyframes dropIn {
                    0% { opacity: 0; transform: translateY(-15px) rotate(-0.5deg); }
                    100% { opacity: 1; transform: translateY(0) rotate(0); }
                }

                .settings-scroll-container {
                    flex: 1; padding: 40px 60px; overflow-y: auto; position: relative; z-index: 2;
                    display: flex; flex-direction: column; align-items: center;
                }

                .settings-stack {
                    display: flex; flex-direction: column; gap: 40px;
                    width: 100%; max-width: 620px; padding-bottom: 60px;
                }

                /* ===== NOTEBOOK PAPER CARD ===== */
                .nb-card {
                    background-color: #fffdf7;
                    background-image: repeating-linear-gradient(
                        to bottom, transparent, transparent 31px, #f1ece1 31px, #f1ece1 32px
                    );
                    border-radius: 6px;
                    border: 1.5px solid #1e3a5f;
                    box-shadow: 3px 3px 0px #e5dcc8, 6px 6px 0px #d4c9b0;
                    padding: 40px 30px 30px 65px;
                    position: relative;
                    display: flex; flex-direction: column; gap: 22px;
                    animation: dropIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                /* Red margin inside card */
                .nb-card::before {
                    content: '';
                    position: absolute;
                    left: 52px; top: 0; bottom: 0;
                    width: 2px;
                    background-color: rgba(239, 68, 68, 0.35);
                }

                /* Card Tape */
                .card-tape {
                    position: absolute;
                    top: -12px; left: 50%;
                    transform: translateX(-50%) rotate(-2deg);
                    width: 100px; height: 24px;
                    background: rgba(253, 224, 71, 0.7);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                    z-index: 3;
                }

                .nb-card-title {
                    font-family: 'Lora', serif;
                    font-size: 1.5rem; font-weight: 600;
                    color: #292524; margin: 0 0 6px 0;
                    border-bottom: 2px dashed rgba(28, 20, 16, 0.12);
                    padding-bottom: 10px;
                }

                .nb-card-title .title-icon {
                    font-size: 1.2rem; margin-right: 8px;
                }

                /* Input Groups */
                .nb-input-group {
                    display: flex; flex-direction: column; gap: 4px;
                    position: relative;
                }

                .nb-label {
                    font-family: 'Lora', serif;
                    font-size: 0.8rem; font-weight: 600;
                    text-transform: uppercase; letter-spacing: 0.06em;
                    color: #78716c; margin-bottom: 0;
                    display: flex; align-items: center; gap: 6px;
                }

                .nb-input {
                    background: transparent;
                    border: none;
                    border-bottom: 1.5px solid #d4c9b0;
                    padding: 8px 4px;
                    font-family: 'Inter', sans-serif; font-size: 1rem;
                    color: #292524;
                    transition: border-color 0.3s ease;
                    width: 100%;
                    line-height: 1.75;
                }
                .nb-input::placeholder {
                    color: #a8a29e; font-style: italic;
                    font-family: 'Inter', sans-serif; font-weight: 300;
                }
                .nb-input:focus {
                    outline: none;
                    border-bottom-color: #d97706;
                }
                .nb-input.invalid {
                    border-bottom-color: #ef4444;
                }

                .nb-error {
                    font-family: 'Caveat', cursive; font-size: 1.1rem;
                    color: #dc2626; margin-top: 2px;
                }

                .nb-hint {
                    font-family: 'Caveat', cursive; font-size: 1rem;
                    color: #a8a29e; margin-top: 2px;
                }

                /* Section Divider */
                .nb-section-divider {
                    font-family: 'Caveat', cursive; font-size: 1.3rem;
                    color: #d97706; margin-top: 10px; margin-bottom: 0;
                    display: flex; align-items: center; gap: 10px;
                }
                .nb-section-divider::after {
                    content: ''; flex: 1; height: 1px;
                    border-bottom: 2px dashed rgba(217, 119, 6, 0.3);
                }

                /* Avatar */
                .nb-avatar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 4px; }
                .nb-avatar-circle {
                    width: 60px; height: 60px; border-radius: 50%;
                    background: #d97706; color: white;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.6rem; font-family: 'Caveat', cursive;
                    box-shadow: 0 3px 10px rgba(217, 119, 6, 0.3);
                    object-fit: cover;
                    border: 3px solid #e5dcc8;
                }
                .nb-avatar-greeting {
                    font-family: 'Caveat', cursive; font-size: 1.5rem; color: #57534e;
                }

                /* Toggle Row (3D) */
                .nb-toggle-row {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 4px 0;
                }
                .nb-toggle-label {
                    font-family: 'Lora', serif; font-size: 0.95rem; color: #57534e;
                    font-style: italic;
                }
                .nb-toggle {
                    position: relative; width: 56px; height: 28px;
                    background: #e7e5e4; border-radius: 14px;
                    border: 1.5px solid #d4c9b0;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 0 #d4c9b0;
                    cursor: pointer; transition: all 0.3s;
                }
                .nb-toggle.active {
                    background: #d97706; border-color: #92400e;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), 0 2px 0 #92400e;
                }
                .nb-toggle-knob {
                    position: absolute; top: 2px; left: 2px;
                    width: 22px; height: 22px;
                    background: #fffdf7; border-radius: 50%;
                    box-shadow: 1px 1px 4px rgba(0,0,0,0.2), 0 2px 0 #d4c9b0;
                    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                }
                .nb-toggle.active .nb-toggle-knob {
                    transform: translateX(28px);
                    box-shadow: 1px 1px 4px rgba(0,0,0,0.2), 0 2px 0 #92400e;
                }

                /* Notebook Dropdown */
                .nb-select {
                    background: transparent;
                    border: none;
                    border-bottom: 1.5px solid #d4c9b0;
                    padding: 8px 4px; font-family: 'Inter', sans-serif;
                    font-size: 1rem; color: #292524; cursor: pointer;
                    width: 100%;
                }
                .nb-select:focus { outline: none; border-bottom-color: #d97706; }
                .nb-select option { background: #fffdf7; color: #292524; }

                /* Storage */
                .nb-storage-display { display: flex; flex-direction: column; gap: 10px; padding: 4px 0; }
                .nb-storage-text {
                    display: flex; justify-content: space-between;
                    font-family: 'Lora', serif; color: #57534e; font-weight: 500;
                }
                .nb-storage-percent {
                    color: #d97706; font-family: 'Caveat', cursive; font-size: 1.25rem;
                }
                .nb-storage-bar-bg {
                    width: 100%; height: 10px;
                    background: #e7e5e4; border-radius: 5px;
                    overflow: hidden; border: 1px solid #d4c9b0;
                }
                .nb-storage-bar-fill {
                    height: 100%; background: #d97706; border-radius: 5px;
                    transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .nb-storage-sub {
                    font-family: 'Caveat', cursive; font-size: 1rem;
                    color: #a8a29e;
                }

                /* Buttons — Dark notebook style */
                .btn-notebook {
                    width: 100%;
                    background-color: #292524; color: #d97706;
                    font-family: 'Lora', serif; font-style: italic;
                    font-size: 1.05rem;
                    border: none; border-radius: 4px; padding: 14px;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    box-shadow: 0 4px 0 #1c1410;
                    transition: all 0.15s ease; margin-top: 8px;
                }
                .btn-notebook:hover:not(:disabled) {
                    background-color: #1c1917;
                    box-shadow: 0 6px 0 #1c1410;
                    transform: translateY(-2px);
                }
                .btn-notebook:active:not(:disabled) {
                    transform: translateY(4px);
                    box-shadow: 0 0 0 #1c1410;
                }
                .btn-notebook:disabled {
                    background: #e7e5e4; color: #a8a29e;
                    box-shadow: 0 2px 0 #d4c9b0; cursor: not-allowed;
                }

                .btn-trash {
                    width: 100%;
                    background-color: #292524; color: #ef4444;
                    font-family: 'Lora', serif; font-style: italic;
                    font-size: 1.05rem;
                    border: none; border-radius: 4px; padding: 14px;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    box-shadow: 0 4px 0 #1c1410;
                    transition: all 0.15s ease; margin-top: 8px;
                }
                .btn-trash:hover { background-color: #1c1917; }
                .btn-trash:active {
                    transform: translateY(4px);
                    box-shadow: 0 0 0 #1c1410;
                }

                .spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(217, 119, 6, 0.3);
                    border-top-color: #d97706;
                    border-radius: 50%; animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Pencil BG Emoji */
                .pencil-bg {
                    position: fixed; bottom: 5%; right: 5%;
                    font-size: 6rem; opacity: 0.12;
                    transform: rotate(25deg); pointer-events: none; z-index: 0;
                }
            `}</style>

            {/* Background Chips */}
            <div className="note-chip chip-1">☑ buy groceries</div>
            <div className="note-chip chip-2">don't forget!</div>
            <div className="note-chip chip-3">ideas for Q2...</div>
            <div className="pencil-bg">✏️</div>

            {/* Sidebar */}
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
                    <div className="nav-item" onClick={() => navigate('/pinned')}>
                        <span className="icon">📌</span> Pinned
                        {pinned > 0 && <span style={{ background: 'rgba(217, 119, 6, 0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', marginLeft: 'auto', color: '#d97706', fontFamily: 'Inter' }}>{pinned}</span>}
                    </div>
                    <div className="nav-item" onClick={() => navigate('/account-settings')}>
                        <span className="icon">👤</span> Account Settings
                    </div>
                    <div className="nav-item active" onClick={() => navigate('/settings')}>
                        <span className="icon">⚙️</span> Settings
                    </div>
                    <div className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto', marginBottom: '20px', color: '#ef4444' }}>
                        <span className="icon">🚪</span> Logout
                    </div>
                </div>

                <div className="stats-box">
                    <h4 className="stats-title">Preferences</h4>
                    <p className="stats-desc">Account configuration</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="nkp-main">
                <div className="nkp-topnav">
                    <div className="top-tabs">
                        <div className="top-tab active">Control Center</div>
                    </div>
                    <div className="top-actions">
                        <span className="su-name">{user?.name}</span>
                        {profilePicture ? (
                             <img src={profilePicture} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <div className="profile-dropdown" title={user?.email}>👤</div>
                        )}
                    </div>
                </div>

                <div className="settings-scroll-container">
                    <div className="settings-stack">
                        
                        {/* Account Configuration Card */}
                        <div className="nb-card">
                            <div className="card-tape"></div>
                            <h2 className="nb-card-title">
                                <span className="title-icon">📝</span>
                                Profile Configuration
                            </h2>

                            <div className="nb-avatar-row">
                                {profilePicture ? (
                                    <img src={profilePicture} alt="Avatar" className="nb-avatar-circle" />
                                ) : (
                                    <div className="nb-avatar-circle">
                                        {(name || "U").charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="nb-avatar-greeting">Welcome back, {name}!</span>
                            </div>

                            <div className="nb-input-group">
                                <label className="nb-label">Full Name</label>
                                <input type="text" className="nb-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
                            </div>
                            
                            <div className="nb-input-group">
                                <label className="nb-label">Email Address</label>
                                <input 
                                    type="email" 
                                    className={`nb-input ${!isEmailValid ? 'invalid' : ''}`} 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="example@domain.com"
                                />
                                {!isEmailValid && <span className="nb-error">⚠ Invalid email format</span>}
                            </div>

                            <div className="nb-input-group">
                                <label className="nb-label">Profile Picture URL</label>
                                <input type="text" className="nb-input" value={profilePicture} onChange={e => setProfilePicture(e.target.value)} placeholder="https://..." />
                                <span className="nb-hint">paste an image link for your avatar</span>
                            </div>

                            <div className="nb-input-group">
                                <label className="nb-label">Date of Birth</label>
                                <input type="date" className="nb-input" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                            </div>

                            <div className="nb-section-divider">🔒 Security</div>
                            
                            <div className="nb-input-group">
                                <label className="nb-label">Current Password</label>
                                <input type="password" className="nb-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Required for password change" />
                            </div>
                            <div className="nb-input-group">
                                <label className="nb-label">New Password</label>
                                <input type="password" className="nb-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" />
                                <span className="nb-hint">leave blank if you don't want to change it</span>
                            </div>

                            <button className="btn-notebook" onClick={handleUpdateProfile} disabled={!isReadyToSave || isSaving}>
                                {isSaving && <div className="spinner"></div>}
                                {isSaving ? 'Syncing...' : 'Save Changes →'}
                            </button>
                        </div>

                        {/* System Preferences Card */}
                        <div className="nb-card">
                            <div className="card-tape"></div>
                            <h2 className="nb-card-title">
                                <span className="title-icon">⚙️</span>
                                System Preferences
                            </h2>
                            
                            <div className="nb-toggle-row">
                                <span className="nb-toggle-label">Dark Mode UI</span>
                                <div className={`nb-toggle ${darkMode ? 'active' : ''}`} onClick={toggleDarkMode}>
                                    <div className="nb-toggle-knob"></div>
                                </div>
                            </div>

                            <div className="nb-input-group" style={{ marginTop: '6px' }}>
                                <label className="nb-label">Default Landing View</label>
                                <select className="nb-select" value={defaultView} onChange={handleViewChange}>
                                    <option value="/dashboard">Kanban Board</option>
                                    <option value="/list">List View</option>
                                    <option value="/calendar">Calendar Matrix</option>
                                </select>
                                <span className="nb-hint">where you land after login</span>
                            </div>
                        </div>

                        {/* Workspace Storage Card */}
                        <div className="nb-card">
                            <div className="card-tape"></div>
                            <h2 className="nb-card-title">
                                <span className="title-icon">💾</span>
                                Workspace Storage
                            </h2>
                            
                            <div className="nb-storage-display">
                                <div className="nb-storage-text">
                                    <span>Cloud Capacity</span>
                                    <span className="nb-storage-percent">{usagePercent}% Used</span>
                                </div>
                                <div className="nb-storage-bar-bg">
                                    <div className="nb-storage-bar-fill" style={{ width: `${usagePercent}%` }}></div>
                                </div>
                                <span className="nb-storage-sub">{total} notes of {MAX_NOTES} allocated limit</span>
                            </div>

                            <button className="btn-trash" onClick={handleClearTrash}>
                                Clear System Trash 🗑️
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

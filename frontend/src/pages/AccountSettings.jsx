import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceStats } from '../hooks/useWorkspaceStats';
import { toast } from 'react-toastify';

const AccountSettings = ({ darkMode, toggleDarkMode }) => {
    const { logout, user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const { archive, pinned } = useWorkspaceStats();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
    const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    // Track touched fields
    const [touched, setTouched] = useState({});
    const markTouched = (field) => setTouched(prev => ({ ...prev, [field]: true }));

    // --- Validation ---
    const emailRegex = /^\S+@\S+\.\S+$/;
    const isEmailValid = email.trim() === '' || emailRegex.test(email.trim());
    const isEmailFilled = email.trim() !== '';
    const isNameValid = name.trim().length >= 2;

    // DOB age check (13+)
    const getDobError = () => {
        if (!dateOfBirth) return '';
        const dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        if (age < 13) return 'You must be at least 13 years old';
        return '';
    };
    const dobError = getDobError();

    const isPasswordChangeAttempted = newPassword.length > 0;
    const isNewPasswordValid = !isPasswordChangeAttempted || newPassword.length >= 8;
    const isCurrentPasswordFilled = !isPasswordChangeAttempted || currentPassword.length > 0;

    const isReadyToSave =
        isNameValid &&
        isEmailFilled &&
        isEmailValid &&
        !dobError &&
        isNewPasswordValid &&
        isCurrentPasswordFilled;

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

        setIsSaving(true);
        const success = await updateProfile(name, email, currentPassword, newPassword, profilePicture, dateOfBirth);
        setIsSaving(false);

        if (success) {
            setCurrentPassword('');
            setNewPassword('');
            setTouched({});
        }
    };

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
                .chip-1 { top: 10%; right: 6%; background: #fef08a; transform: rotate(-6deg); }
                .chip-2 { bottom: 20%; right: 10%; background: #e0e7ff; transform: rotate(4deg); }
                .chip-3 { bottom: 10%; left: 52%; background: #bbf7d0; transform: rotate(-3deg); }

                /* Sidebar */
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

                .accs-scroll-container {
                    flex: 1; padding: 40px 60px; overflow-y: auto; position: relative; z-index: 2;
                    display: flex; flex-direction: column; align-items: center;
                }

                .accs-stack {
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
                    color: #78716c;
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
                    width: 64px; height: 64px; border-radius: 50%;
                    background: #d97706; color: white;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.6rem; font-family: 'Caveat', cursive;
                    box-shadow: 0 3px 10px rgba(217, 119, 6, 0.3);
                    object-fit: cover;
                    border: 3px solid #e5dcc8;
                }
                .nb-avatar-info h3 {
                    font-family: 'Caveat', cursive; font-size: 1.5rem;
                    color: #57534e; margin: 0;
                }
                .nb-avatar-info p {
                    font-family: 'Lora', serif; font-style: italic;
                    font-size: 0.85rem; color: #a8a29e; margin: 2px 0 0;
                }

                /* Password wrapper */
                .nb-pw-wrapper {
                    position: relative; display: flex; align-items: center;
                }
                .nb-pw-wrapper .nb-input { padding-right: 40px; }
                .nb-pw-toggle {
                    position: absolute; right: 4px;
                    background: none; border: none; cursor: pointer;
                    color: #a8a29e; padding: 4px;
                    transition: color 0.2s;
                }
                .nb-pw-toggle:hover { color: #57534e; }

                /* Save Button */
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

                .spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(217, 119, 6, 0.3);
                    border-top-color: #d97706;
                    border-radius: 50%; animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Pencil BG */
                .pencil-bg {
                    position: fixed; bottom: 6%; right: 4%;
                    font-size: 6rem; opacity: 0.12;
                    transform: rotate(25deg); pointer-events: none; z-index: 0;
                }
            `}</style>

            {/* Background Chips */}
            <div className="note-chip chip-1">meeting notes →</div>
            <div className="note-chip chip-2">don't forget!</div>
            <div className="note-chip chip-3">☑ buy groceries</div>
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
                    <div className="nav-item active" onClick={() => navigate('/account-settings')}>
                        <span className="icon">👤</span> Account Settings
                    </div>
                    <div className="nav-item" onClick={() => navigate('/settings')}>
                        <span className="icon">⚙️</span> Settings
                    </div>
                    <div className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto', marginBottom: '20px', color: '#ef4444' }}>
                        <span className="icon">🚪</span> Logout
                    </div>
                </div>

                <div className="stats-box">
                    <h4 className="stats-title">Account</h4>
                    <p className="stats-desc">Manage your profile</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="nkp-main">
                <div className="nkp-topnav">
                    <div className="top-tabs">
                        <div className="top-tab active">Account Settings</div>
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

                <div className="accs-scroll-container">
                    <div className="accs-stack">

                        {/* Profile Information Card */}
                        <div className="nb-card">
                            <div className="card-tape"></div>
                            <h2 className="nb-card-title">
                                <span className="title-icon">👤</span>
                                Profile Information
                            </h2>

                            {/* Avatar */}
                            <div className="nb-avatar-row">
                                {profilePicture ? (
                                    <img src={profilePicture} alt="Profile" className="nb-avatar-circle" />
                                ) : (
                                    <div className="nb-avatar-circle">
                                        {(name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="nb-avatar-info">
                                    <h3>Welcome, {name || 'User'}!</h3>
                                    <p>{email || 'No email set'}</p>
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="nb-input-group">
                                <label className="nb-label">Full Name *</label>
                                <input
                                    id="accs-name"
                                    type="text"
                                    className={`nb-input ${touched.name && !isNameValid ? 'invalid' : ''}`}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    onBlur={() => markTouched('name')}
                                    placeholder="Enter your full name"
                                />
                                {touched.name && !isNameValid && (
                                    <span className="nb-error">⚠ Name is required (minimum 2 characters)</span>
                                )}
                            </div>

                            {/* Email */}
                            <div className="nb-input-group">
                                <label className="nb-label">Email Address *</label>
                                <input
                                    id="accs-email"
                                    type="email"
                                    className={`nb-input ${touched.email && (!isEmailValid || !isEmailFilled) ? 'invalid' : ''}`}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onBlur={() => markTouched('email')}
                                    placeholder="example@domain.com"
                                />
                                {touched.email && !isEmailFilled && (
                                    <span className="nb-error">⚠ Email is required</span>
                                )}
                                {touched.email && isEmailFilled && !isEmailValid && (
                                    <span className="nb-error">⚠ Invalid email format</span>
                                )}
                            </div>

                            {/* Profile Picture URL */}
                            <div className="nb-input-group">
                                <label className="nb-label">Profile Picture URL</label>
                                <input
                                    id="accs-picture"
                                    type="text"
                                    className="nb-input"
                                    value={profilePicture}
                                    onChange={e => setProfilePicture(e.target.value)}
                                    placeholder="https://example.com/photo.jpg"
                                />
                                <span className="nb-hint">paste an image link for your avatar</span>
                            </div>

                            {/* Date of Birth */}
                            <div className="nb-input-group">
                                <label className="nb-label">Date of Birth</label>
                                <input
                                    id="accs-dob"
                                    type="date"
                                    className={`nb-input ${touched.dob && dobError ? 'invalid' : ''}`}
                                    value={dateOfBirth}
                                    onChange={e => setDateOfBirth(e.target.value)}
                                    onBlur={() => markTouched('dob')}
                                />
                                {touched.dob && dobError && (
                                    <span className="nb-error">⚠ {dobError}</span>
                                )}
                            </div>
                        </div>

                        {/* Security Card */}
                        <div className="nb-card">
                            <div className="card-tape"></div>
                            <h2 className="nb-card-title">
                                <span className="title-icon">🔒</span>
                                Security
                            </h2>

                            <div className="nb-section-divider">Password Change</div>

                            {/* Current Password */}
                            <div className="nb-input-group">
                                <label className="nb-label">Current Password</label>
                                <div className="nb-pw-wrapper">
                                    <input
                                        id="accs-current-password"
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        className={`nb-input ${touched.currentPassword && isPasswordChangeAttempted && !isCurrentPasswordFilled ? 'invalid' : ''}`}
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        onBlur={() => markTouched('currentPassword')}
                                        placeholder="Required for password change"
                                    />
                                    <button type="button" className="nb-pw-toggle" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                        {showCurrentPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        )}
                                    </button>
                                </div>
                                {touched.currentPassword && isPasswordChangeAttempted && !isCurrentPasswordFilled && (
                                    <span className="nb-error">⚠ Current password is required</span>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="nb-input-group">
                                <label className="nb-label">New Password</label>
                                <div className="nb-pw-wrapper">
                                    <input
                                        id="accs-new-password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        className={`nb-input ${touched.newPassword && !isNewPasswordValid ? 'invalid' : ''}`}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        onBlur={() => markTouched('newPassword')}
                                        placeholder="Minimum 8 characters"
                                    />
                                    <button type="button" className="nb-pw-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        )}
                                    </button>
                                </div>
                                {touched.newPassword && !isNewPasswordValid && (
                                    <span className="nb-error">⚠ Password must be at least 8 characters</span>
                                )}
                                <span className="nb-hint">leave blank if you don't want to change it</span>
                            </div>

                            {/* Save Button */}
                            <button
                                id="accs-save-btn"
                                className="btn-notebook"
                                onClick={handleUpdateProfile}
                                disabled={!isReadyToSave || isSaving}
                            >
                                {isSaving && <div className="spinner"></div>}
                                {isSaving ? 'Saving Changes...' : 'Save Changes →'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;

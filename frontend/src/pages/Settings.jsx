import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceStats } from '../hooks/useWorkspaceStats';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';

const Settings = () => {
    const { user, updateProfile } = useAuth();
    const { total, refreshStats } = useWorkspaceStats();

    const [defaultView, setDefaultView] = useState(localStorage.getItem('defaultView') || '/dashboard');
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
    const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setProfilePicture(user?.profilePicture || '');
        if (user?.dateOfBirth) {
            setDateOfBirth(new Date(user.dateOfBirth).toISOString().split('T')[0]);
        }
    }, [user]);

    const handleUpdateProfile = async () => {
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
                toast.success('Trash cleared! 🚀');
                refreshStats();
            }
        } catch (error) {
            toast.error('Failed to clear trash');
        }
    };

    const usagePercent = Math.min(Math.round((total / 100) * 100), 100) || 0;

    return (
        <Layout notesCount={total}>
            <style>{`
                .settings-scroll-container { flex: 1; padding: 40px 60px; overflow-y: auto; display: flex; flex-direction: column; align-items: center; }
                @media (max-width: 768px) { .settings-scroll-container { padding: 20px 15px; } }

                .settings-stack { display: flex; flex-direction: column; gap: 40px; width: 100%; max-width: 620px; padding-bottom: 60px; }
                @media (max-width: 768px) { .settings-stack { gap: 25px; } }

                .nb-card {
                    background-color: #fffdf7; background-image: repeating-linear-gradient(to bottom, transparent, transparent 31px, #f1ece1 31px, #f1ece1 32px);
                    border-radius: 6px; border: 1.5px solid #1e3a5f; box-shadow: 3px 3px 0px #e5dcc8;
                    padding: 40px 30px 30px 65px; position: relative; display: flex; flex-direction: column; gap: 20px;
                }
                @media (max-width: 768px) {
                    .nb-card { padding: 30px 20px 20px 45px; gap: 15px; }
                    .nb-card::before { left: 35px !important; }
                }

                .nb-card::before { content: ''; position: absolute; left: 52px; top: 0; bottom: 0; width: 2px; background-color: rgba(239, 68, 68, 0.35); }
                .card-tape { position: absolute; top: -12px; left: 50%; transform: translateX(-50%) rotate(-2deg); width: 100px; height: 24px; background: rgba(253, 224, 71, 0.7); z-index: 3; }

                .nb-card-title { font-family: 'Lora', serif; font-size: 1.4rem; color: #292524; margin: 0; border-bottom: 2px dashed rgba(28, 20, 16, 0.1); padding-bottom: 10px; }
                
                /* Form Stacking Fix */
                .nb-input-group { display: flex; flex-direction: column; gap: 6px; }
                .nb-label { font-family: 'Lora', serif; font-size: 0.85rem; font-weight: 600; color: #78716c; text-transform: uppercase; }
                .nb-input { background: transparent; border: none; border-bottom: 1.5px solid #d4c9b0; padding: 8px 4px; font-size: 1rem; color: #292524; width: 100%; transition: border-color 0.3s; }
                .nb-input:focus { outline: none; border-bottom-color: #d97706; }

                .btn-notebook { background: #292524; color: #d97706; border: none; padding: 14px; border-radius: 4px; font-family: 'Lora', serif; font-style: italic; cursor: pointer; box-shadow: 0 4px 0 #1c1410; margin-top: 10px; }
                .btn-trash { background: #292524; color: #ef4444; border: none; padding: 14px; border-radius: 4px; font-family: 'Lora', serif; font-style: italic; cursor: pointer; box-shadow: 0 4px 0 #1c1410; margin-top: 10px; }
                
                .nb-avatar-row { display: flex; align-items: center; gap: 16px; }
                @media (max-width: 480px) { .nb-avatar-row { flex-direction: column; text-align: center; } }
                .nb-avatar-circle { width: 60px; height: 60px; border-radius: 50%; background: #d97706; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 3px solid #e5dcc8; }
            `}</style>

            <div className="settings-scroll-container">
                <div className="settings-stack">
                    <div className="nb-card">
                        <div className="card-tape"></div>
                        <h2 className="nb-card-title">Profile Update</h2>
                        
                        <div className="nb-avatar-row">
                            <div className="nb-avatar-circle">{(name || "U")[0].toUpperCase()}</div>
                            <span style={{ fontFamily: 'Caveat', fontSize: '1.4rem' }}>{name}, revise your details here.</span>
                        </div>

                        <div className="nb-input-group">
                            <label className="nb-label">Full Name</label>
                            <input type="text" className="nb-input" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="nb-input-group">
                            <label className="nb-label">Email Address</label>
                            <input type="email" className="nb-input" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="nb-input-group">
                            <label className="nb-label">Password Change</label>
                            <input type="password" placeholder="New Password (optional)" className="nb-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        </div>
                        <div className="nb-input-group">
                            <label className="nb-label">Confirm with Current Pass</label>
                            <input type="password" placeholder="Current Password" className="nb-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                        </div>

                        <button className="btn-notebook" onClick={handleUpdateProfile} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Sync Profile →'}
                        </button>
                    </div>

                    <div className="nb-card">
                        <div className="card-tape"></div>
                        <h2 className="nb-card-title">Workspace Storage</h2>
                        <div style={{ padding: '10px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontFamily: 'Lora' }}>Sync Status</span>
                                <span style={{ fontFamily: 'Caveat', fontSize: '1.2rem', color: '#d97706' }}>{usagePercent}% Full</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#e7e5e4', borderRadius: '4px', border: '1px solid #d4c9b0' }}>
                                <div style={{ width: `${usagePercent}%`, height: '100%', background: '#d97706', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <button className="btn-trash" onClick={handleClearTrash}>Empty System Trash 🗑️</button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;

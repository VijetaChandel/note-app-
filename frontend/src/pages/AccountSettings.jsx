import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceStats } from '../hooks/useWorkspaceStats';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';

const AccountSettings = () => {
    const { user, updateProfile } = useAuth();
    const { total } = useWorkspaceStats();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
    const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setProfilePicture(user?.profilePicture || '');
        if (user?.dateOfBirth) {
            setDateOfBirth(new Date(user.dateOfBirth).toISOString().split('T')[0]);
        }
    }, [user]);

    const handleUpdate = async () => {
        setIsSaving(true);
        const success = await updateProfile(name, email, '', '', profilePicture, dateOfBirth);
        setIsSaving(false);
        if (success) toast.success('Account updated 👤');
    };

    return (
        <Layout notesCount={total}>
            <style>{`
                .account-container { flex: 1; padding: 40px 60px; overflow-y: auto; display: flex; flex-direction: column; align-items: center; }
                @media (max-width: 768px) { .account-container { padding: 20px 15px; } }

                .nb-card {
                    background-color: #fffdf7; background-image: repeating-linear-gradient(to bottom, transparent, transparent 31px, #f1ece1 31px, #f1ece1 32px);
                    border-radius: 6px; border: 1.5px solid #1e3a5f; box-shadow: 3px 3px 0px #e5dcc8;
                    padding: 40px 30px 30px 65px; position: relative; display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 620px;
                }
                @media (max-width: 768px) {
                    .nb-card { padding: 30px 20px 20px 45px; gap: 15px; }
                    .nb-card::before { left: 35px !important; }
                }

                .nb-card::before { content: ''; position: absolute; left: 52px; top: 0; bottom: 0; width: 2px; background-color: rgba(239, 68, 68, 0.35); }
                .card-tape { position: absolute; top: -12px; left: 50%; transform: translateX(-50%) rotate(-1deg); width: 100px; height: 24px; background: rgba(253, 224, 71, 0.7); z-index: 3; }

                .nb-input-group { display: flex; flex-direction: column; gap: 6px; }
                .nb-label { font-family: 'Lora', serif; font-size: 0.85rem; font-weight: 600; color: #78716c; text-transform: uppercase; }
                .nb-input { background: transparent; border: none; border-bottom: 1.5px solid #d4c9b0; padding: 8px 4px; font-size: 1rem; color: #292524; width: 100%; }

                .btn-save { background: #292524; color: #d97706; border: none; padding: 14px; border-radius: 4px; font-family: 'Lora', serif; font-style: italic; cursor: pointer; box-shadow: 0 4px 0 #1c1410; margin-top: 10px; }
                
                .nb-avatar-display { width: 120px; height: 120px; border-radius: 50%; border: 4px solid #e5dcc8; object-fit: cover; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            `}</style>

            <div className="account-container">
                <div className="nb-card">
                    <div className="card-tape"></div>
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                        {profilePicture ? (
                            <img src={profilePicture} alt="Avatar" className="nb-avatar-display" />
                        ) : (
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#d97706', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto' }}>{(name || "U")[0].toUpperCase()}</div>
                        )}
                        <h1 style={{ fontFamily: 'Caveat', fontSize: '2rem', marginTop: '15px' }}>{name}</h1>
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
                        <label className="nb-label">Profile Image Link</label>
                        <input type="text" className="nb-input" value={profilePicture} onChange={e => setProfilePicture(e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="nb-input-group">
                        <label className="nb-label">Birth Date</label>
                        <input type="date" className="nb-input" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                    </div>

                    <button className="btn-save" onClick={handleUpdate} disabled={isSaving}>
                        {isSaving ? 'Updating...' : 'Save Profile Changes →'}
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default AccountSettings;

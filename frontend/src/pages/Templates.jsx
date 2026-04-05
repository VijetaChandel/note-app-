import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceStats } from '../hooks/useWorkspaceStats';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const Templates = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { refreshStats } = useWorkspaceStats();

    const templateList = [
        { id: 't1', title: 'Daily Journal', category: 'Personal', icon: '📔', content: 'Today I feel...\n\nThree things I am grateful for:\n1.\n2.\n3.\n\nHighlights of the day:\n- ' },
        { id: 't2', title: 'Meeting Notes', category: 'Work', icon: '💼', content: 'Date: \nAttendees: \n\nAgenda:\n- \n\nDecisions Made:\n- \n\nAction Items:\n- ' },
        { id: 't3', title: 'Project Plan', category: 'Work', icon: '🚀', content: 'Goal: \nTimeline: \n\nMilestones:\n1. \n2. \n3. \n\nPotential Risks:\n- ' },
        { id: 't4', title: 'Shopping List', category: 'General', icon: '🛒', content: 'Items to buy:\n- \n- \n- \n\nPriority items:\n- ' }
    ];

    const useTemplate = async (template) => {
        try {
            const response = await api.post('/notes', {
                title: template.title,
                content: template.content,
                category: template.category,
                status: 'Ideas'
            });
            if (response.data.success) {
                toast.success(`"${template.title}" draft created! ✨`);
                refreshStats();
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error('Failed to create note from template');
        }
    };

    return (
        <Layout>
            <style>{`
                .templates-container { flex: 1; padding: 40px 60px; overflow-y: auto; display: flex; flex-direction: column; align-items: center; }
                @media (max-width: 768px) { .templates-container { padding: 20px 15px; } }

                .templates-grid {
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; width: 100%; max-width: 1000px; padding-bottom: 60px;
                }
                @media (max-width: 768px) { .templates-grid { grid-template-columns: 1fr; gap: 20px; } }

                .template-card {
                    background: #fffdf7; border: 1.5px solid #1e3a5f; border-radius: 8px; padding: 30px 25px; position: relative;
                    box-shadow: 4px 4px 0 #e5dcc8; transition: all 0.2s ease; cursor: pointer; text-align: center;
                }
                .template-card:hover { transform: translateY(-5px); box-shadow: 8px 8px 0 #e5dcc8; }
                .template-card:active { transform: translateY(0); box-shadow: 2px 2px 0 #e5dcc8; }

                .card-tape { position: absolute; top: -10px; left: 50%; transform: translateX(-50%) rotate(-1deg); width: 80px; height: 20px; background: rgba(253, 224, 71, 0.5); z-index: 2; }
                
                .t-icon { font-size: 2.5rem; margin-bottom: 15px; }
                .t-title { font-family: 'Lora', serif; font-size: 1.4rem; color: #292524; margin: 0 0 8px 0; }
                .t-category { font-family: 'Caveat', cursive; font-size: 1.2rem; color: #d97706; }
                .t-preview { font-size: 0.85rem; color: #78716c; margin-top: 15px; font-style: italic; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

                .btn-use { 
                    margin-top: 20px; width: 100%; background: #292524; color: #d97706; border: none; padding: 12px; border-radius: 4px;
                    font-family: 'Lora', serif; font-style: italic; font-weight: 600; cursor: pointer; transition: background 0.2s;
                }
                .btn-use:hover { background: #1c1917; }
            `}</style>

            <div className="templates-container">
                <h1 style={{ fontFamily: 'Caveat', fontSize: '2.5rem', color: '#1c1410', marginBottom: '30px' }}>Select a starting point...</h1>
                <div className="templates-grid">
                    {templateList.map(template => (
                        <div className="template-card" key={template.id} onClick={() => useTemplate(template)}>
                            <div className="card-tape"></div>
                            <div className="t-icon">{template.icon}</div>
                            <h2 className="t-title">{template.title}</h2>
                            <span className="t-category">{template.category}</span>
                            <div className="t-preview">{template.content}</div>
                            <button className="btn-use">Use Draft →</button>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Templates;

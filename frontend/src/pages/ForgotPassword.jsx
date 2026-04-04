import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email.trim()) {
            setError('Please enter your registered email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
            setSuccess(response.data.message || 'If this email is registered, a reset link has been sent.');
            toast.success('Reset email sent if the account exists.');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to send reset email. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="notepad-viewport relative overflow-hidden font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

                .notepad-viewport {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #fdfaf3;
                    background-image: repeating-linear-gradient(to bottom, transparent, transparent 31px, #e8e3d7 31px, #e8e3d7 32px);
                    position: relative;
                    padding: 40px 20px;
                }

                .notepad-viewport::before {
                    content: '';
                    position: absolute;
                    left: 64px; top: 0; bottom: 0;
                    width: 2px; background-color: rgba(239, 68, 68, 0.3);
                    z-index: 0;
                }

                .notebook-card {
                    background: #fffdf7;
                    border: 1px solid rgba(28, 20, 16, 0.1);
                    border-radius: 12px;
                    box-shadow: 20px 20px 0px rgba(28, 20, 16, 0.08); /* Premium 3D offset */
                    padding: 48px 36px 36px;
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 440px;
                    transition: transform 0.3s ease;
                }

                .notebook-card:hover { transform: translateY(-4px); }

                .washi-tape {
                    position: absolute; top: -14px; left: 50%;
                    transform: translateX(-50%) rotate(-4deg);
                    width: 110px; height: 28px;
                    background: rgba(253, 224, 71, 0.7);
                    backdrop-filter: blur(2px);
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .sticky-note {
                    position: absolute;
                    width: 120px; padding: 12px;
                    font-family: 'Caveat', cursive;
                    font-size: 1.1rem;
                    box-shadow: 2px 4px 10px rgba(0,0,0,0.05);
                    z-index: 1;
                }

                .sticky-green { background: #dcfce7; transform: rotate(8deg); top: 10%; right: 5%; }
                .sticky-purple { background: #f3e8ff; transform: rotate(-6deg); bottom: 10%; left: 5%; }

                .headline { font-family: 'Lora', serif; font-size: 2rem; font-weight: 600; color: #1c1410; margin-bottom: 8px; }
                .subtext { font-family: 'Inter', sans-serif; color: #6b7280; font-size: 0.95rem; margin-bottom: 32px; line-height: 1.5; }

                .input-field {
                    width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb;
                    border-radius: 8px; background: rgba(255, 255, 255, 0.8);
                    font-family: 'Inter', sans-serif; transition: all 0.2s ease;
                }
                .input-field:focus { outline: none; border-color: #d97706; box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1); }

                .charcoal-btn {
                    width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px;
                    padding: 14px; border-radius: 10px; background: #1c1c1c; color: white;
                    font-weight: 600; border: none; cursor: pointer; transition: all 0.2s ease;
                }
                .charcoal-btn:hover { background: #333; transform: scale(1.01); }
                .charcoal-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                .message { padding: 12px 16px; border-radius: 8px; margin-top: 20px; font-size: 0.9rem; }
                .success-msg { background: #ecfdf5; color: #065f46; border: 1px solid #10b981; }
                .error-msg { background: #fef2f2; color: #991b1b; border: 1px solid #ef4444; }

                .links { margin-top: 24px; text-align: center; }
                .back-link { font-family: 'Caveat', cursive; font-size: 1.3rem; color: #d97706; text-decoration: none; }
                .back-link:hover { text-decoration: underline; }
            `}</style>
            
            {/* Background Decorations */}
            <div className="sticky-note sticky-green hidden md:block">
                Don't worry! <br/> We've got you. 🌱
            </div>
            <div className="sticky-note sticky-purple hidden md:block">
                Safe & Secure <br/> Reset 🔒
            </div>

            <div className="notebook-card">
                <div className="washi-tape"></div>
                <h1 className="headline">Forgot Password</h1>
                <p className="subtext">Enter your registered email and we'll send you a secure handwritten link to reset your account.</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block font-medium text-gray-700 mb-2 font-sans tracking-tight" htmlFor="email">Your Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. your@email.com"
                            required
                        />
                    </div>

                    <button type="submit" className="charcoal-btn" disabled={loading}>
                        {loading ? 'Sending Handwriting...' : (
                            <>
                                Send Reset Link <span className="text-xl">→</span>
                            </>
                        )}
                    </button>
                </form>

                {success && <div className="message success-msg">{success}</div>}
                {error && <div className="message error-msg">{error}</div>}

                <div className="links">
                    <span className="text-gray-500 font-sans text-sm">Remembered it? </span>
                    <Link to="/login" className="back-link">Back to login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

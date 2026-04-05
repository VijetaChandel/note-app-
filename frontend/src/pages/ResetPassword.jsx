import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validToken, setValidToken] = useState(false);
    const [message, setMessage] = useState('Verifying reset link...');
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await api.get(`/auth/reset-password/${token}`);
                setValidToken(true);
                setMessage('Enter your new password below.');
            } catch (err) {
                setValidToken(false);
                setError(err.response?.data?.message || 'This reset link is invalid or has expired.');
                setMessage('Unable to verify reset link.');
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(`/auth/reset-password/${token}`, { password, confirmPassword });
            toast.success(response.data.message || 'Password reset successfully.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="notepad-layout">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

                .notepad-layout * { box-sizing: border-box; }
                .notepad-layout {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f7f3ea;
                    background-image: repeating-linear-gradient(
                        to bottom,
                        transparent,
                        transparent 28px,
                        #e8e3d7 28px,
                        #e8e3d7 29px
                    );
                    padding: 24px;
                    position: relative;
                }
                @media (max-width: 600px) { .notepad-layout::after { content: ''; position: absolute; left: 40px; top: 0; bottom: 0; width: 2px; background: rgba(239, 68, 68, 0.2); } }

                .notepad-card {
                    width: min(500px, 100%);
                    background: #fffcf5;
                    border-radius: 10px;
                    border: 1.5px solid #18304b;
                    padding: 42px 36px 36px;
                    box-shadow: 8px 8px 0 rgba(24, 48, 75, 0.15);
                    position: relative;
                    z-index: 1;
                    background-image: repeating-linear-gradient(
                        to bottom,
                        transparent,
                        transparent 33px,
                        #f3ede2 33px,
                        #f3ede2 34px
                    );
                }
                @media (max-width: 600px) {
                    .notepad-card { padding: 40px 15px 30px 45px; width: 95%; box-shadow: 4px 4px 0 rgba(24, 48, 75, 0.1); }
                    .headline { font-size: 1.6rem; }
                }

                .tape-strip {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%) rotate(-3deg);
                    width: 96px;
                    height: 24px;
                    background: rgba(250, 202, 21, 0.85);
                    border-radius: 6px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.12);
                }

                .headline {
                    font-family: 'Lora', serif;
                    font-size: 2rem;
                    color: #1f2937;
                    margin-bottom: 10px;
                    line-height: 1.1;
                }

                .subtext {
                    font-family: 'Inter', sans-serif;
                    color: #57534e;
                    margin-bottom: 26px;
                    font-size: 1rem;
                }

                .form-group { margin-bottom: 22px; }
                .form-label {
                    display: block;
                    font-family: 'Caveat', cursive;
                    margin-bottom: 10px;
                    font-size: 1.05rem;
                    color: #6d6875;
                }

                .form-input {
                    width: 100%;
                    padding: 14px 14px;
                    border-radius: 8px;
                    border: 1px solid #c8b9a6;
                    background: rgba(255,255,255,0.95);
                    font-size: 1rem;
                    font-family: 'Inter', sans-serif;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #d97706;
                }

                .submit-btn {
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 10px;
                    background: #18304b;
                    color: #fff;
                    font-family: 'Lora', serif;
                    font-size: 1rem;
                    cursor: pointer;
                }

                .submit-btn:hover { background: #112938; }

                .message-box {
                    margin-top: 18px;
                    padding: 14px 16px;
                    border-radius: 10px;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.95rem;
                }

                .success-box { background: #d1fae5; color: #166534; }
                .error-box { background: #fee2e2; color: #991b1b; }

                .small-note {
                    margin-top: 16px;
                    font-family: 'Inter', sans-serif;
                    color: #4b5563;
                }

                .action-link {
                    color: #d97706;
                    text-decoration: none;
                    font-family: 'Caveat', cursive;
                }

                .action-link:hover { text-decoration: underline; }
            `}</style>

            <div className="notepad-card">
                <div className="tape-strip"></div>
                <h1 className="headline">Reset Your Password</h1>
                <p className="subtext">Create a new password for your NoteKeeper account.</p>

                {!validToken && <div className="message-box error-box">{message}</div>}

                {validToken && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">New Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Resetting password...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {error && <div className="message-box error-box">{error}</div>}

                <p className="small-note">
                    <Link to="/login" className="action-link">Return to login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;

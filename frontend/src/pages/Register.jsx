import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all fields.');
            return false;
        }
        if (formData.password.length < 6) {
           setError('Password must be at least 6 characters long.');
           return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="notepad-layout">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

                .notepad-layout * {
                    box-sizing: border-box;
                }

                .notepad-layout {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', sans-serif;
                    background-color: #f5f0e8;
                    /* Background horizontal ruled lines */
                    background-image: repeating-linear-gradient(
                        to bottom,
                        transparent,
                        transparent 27px,
                        #e5e0d8 27px,
                        #e5e0d8 28px
                    );
                    position: relative;
                    overflow: hidden;
                    padding: 20px;
                }

                /* Background Red Margin Line */
                .notepad-layout::before {
                    content: '';
                    position: absolute;
                    left: 60px;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background-color: rgba(239, 68, 68, 0.4);
                    z-index: 0;
                }
                @media (max-width: 600px) { .notepad-layout::before { left: 40px; } }

                /* Floating Sticky Chips */
                .sticky-chip {
                    position: absolute;
                    padding: 8px 14px;
                    font-family: 'Caveat', cursive;
                    font-size: 1.25rem;
                    color: #57534e;
                    box-shadow: 2px 2px 8px rgba(0,0,0,0.08);
                    z-index: 1;
                }

                .chip-tl { top: 15%; left: 10%; background: #fef08a; transform: rotate(-8deg); }
                .chip-tr { top: 20%; right: 12%; background: #bbf7d0; transform: rotate(5deg); }
                .chip-bl { bottom: 20%; left: 12%; background: #fed7aa; transform: rotate(3deg); }
                .chip-br { bottom: 15%; right: 15%; background: #e0e7ff; transform: rotate(-6deg); }
                @media (max-width: 480px) { .sticky-chip { display: none; } }

                /* Pencil Emoji */
                .pencil-bg {
                    position: absolute;
                    top: 10%;
                    right: 8%;
                    font-size: 8rem;
                    opacity: 0.25;
                    transform: rotate(25deg);
                    z-index: 0;
                    pointer-events: none;
                }

                /* The Main Card */
                .notepad-card {
                    width: 100%;
                    max-width: 400px;
                    background-color: #fffdf7;
                    border-radius: 6px;
                    border: 1.5px solid #1e3a5f;
                    box-shadow:
                        3px 3px 0px #1e3a5f,
                        6px 6px 0px #162d4a,
                        9px 9px 0px #0f1f33,
                        12px 12px 0px #0a1628,
                        0 25px 60px rgba(15, 31, 51, 0.2);
                    position: relative;
                    z-index: 10;
                    padding: 40px 30px 40px 65px;
                    /* Card internal horizontal ruled lines */
                    background-image: repeating-linear-gradient(
                        to bottom,
                        transparent,
                        transparent 31px,
                        #f1ece1 31px,
                        #f1ece1 32px
                    );
                    animation: dropIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    transform-origin: top center;
                }
                @media (max-width: 600px) {
                    .notepad-card { padding: 40px 20px 30px 45px; width: 95%; max-width: 100%; box-shadow: 6px 6px 0px #1e3a5f, 0 15px 40px rgba(0,0,0,0.15); }
                }

                /* Yellow Tape Strip */
                .tape-strip {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%) rotate(-2deg);
                    width: 100px;
                    height: 24px;
                    background: rgba(253, 224, 71, 0.8);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    z-index: 11;
                }

                /* Red Margin Line inside Card */
                    background-color: rgba(239, 68, 68, 0.4);
                }
                @media (max-width: 600px) { .notepad-card::before { left: 35px; } }

                @keyframes dropIn {
                    0% { opacity: 0; transform: translateY(-20px) rotate(-0.5deg); }
                    100% { opacity: 1; transform: translateY(0) rotate(0); }
                }

                /* Content Styles */
                .app-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-family: 'Caveat', cursive;
                    font-size: 1.25rem;
                    color: #d97706;
                    margin-bottom: 24px;
                }

                .app-tag-dot {
                    width: 8px;
                    height: 8px;
                    background-color: #d97706;
                    border-radius: 50%;
                    box-shadow: 0 0 6px #f59e0b;
                }

                .nc-heading {
                    font-family: 'Lora', serif;
                    font-size: 2rem;
                    color: #292524;
                    margin: 0 0 8px 0;
                    line-height: 1.1;
                }

                .nc-heading .writer {
                    font-family: 'Caveat', cursive;
                    color: #d97706;
                    display: block;
                    font-size: 2.2rem;
                    margin-top: -6px;
                }

                .nc-subtext {
                    font-family: 'Lora', serif;
                    font-style: italic;
                    color: #a8a29e;
                    margin: 0 0 24px 0;
                    font-size: 1rem;
                }

                .pills-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 32px;
                }

                .feature-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    border: 1px dashed #d6d3d1;
                    border-radius: 16px;
                    font-family: 'Caveat', cursive;
                    font-size: 1.1rem;
                    color: #57534e;
                    background: rgba(255, 255, 255, 0.5);
                }

                .pill-dot {
                    width: 4px;
                    height: 4px;
                    background-color: #d97706;
                    border-radius: 50%;
                }

                .form-group {
                    position: relative;
                    margin-bottom: 24px;
                }

                .form-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                    color: #78716c;
                    margin-bottom: 4px;
                }

                .form-label svg {
                    width: 14px;
                    height: 14px;
                }

                .form-input {
                    width: 100%;
                    background: #292524;
                    border: none;
                    border-bottom: 2px solid #e7e5e4;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 1rem;
                    font-family: 'Inter', sans-serif;
                    color: #fef3c7;
                    caret-color: #d97706;
                    transition: border-color 0.3s ease;
                }

                .form-input::placeholder {
                    color: #fef3c7;
                    opacity: 0.4;
                    font-style: italic;
                    font-family: 'Inter', sans-serif;
                    font-weight: 300;
                }

                .form-input:focus::placeholder {
                    opacity: 0.2;
                }

                .form-input:focus {
                    outline: none;
                    border-bottom-color: #d97706;
                }

                .password-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }

                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .toggle-btn {
                    position: absolute;
                    right: 0;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #a8a29e;
                    padding: 4px;
                }
                
                .toggle-btn:hover {
                    color: #57534e;
                }

                .submit-btn {
                    width: 100%;
                    background-color: #292524;
                    color: #fef3c7;
                    font-family: 'Lora', serif;
                    font-style: italic;
                    font-size: 1.1rem;
                    border: none;
                    border-radius: 4px;
                    padding: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    margin-top: 10px;
                }

                .submit-btn:hover {
                    background-color: #1c1917;
                }

                .submit-btn:active {
                    transform: scale(0.98);
                }

                .btn-arrow {
                    font-family: 'Caveat', cursive;
                    font-size: 1.4rem;
                    transition: transform 0.3s ease;
                    font-style: normal;
                }

                .submit-btn:hover .btn-arrow {
                    transform: translateX(6px);
                }

                .error-msg {
                    color: #dc2626;
                    font-size: 0.85rem;
                    margin-top: 12px;
                    text-align: center;
                    background: #fee2e2;
                    border: 1px dashed #fcd34d;
                    padding: 8px;
                    border-radius: 4px;
                }

                .register-footer {
                    margin-top: 32px;
                    padding-top: 16px;
                    border-top: 1px dashed #d6d3d1;
                    text-align: center;
                    font-family: 'Lora', serif;
                    font-style: italic;
                    color: #78716c;
                }

                .register-link {
                    font-family: 'Caveat', cursive;
                    color: #d97706;
                    text-decoration: none;
                    font-size: 1.3rem;
                    margin-left: 6px;
                    font-style: normal;
                }

                .register-link:hover {
                    text-decoration: underline;
                }
            `}</style>

            <div className="sticky-chip chip-tl">project ideas →</div>
            <div className="sticky-chip chip-tr">☑ finalize UI</div>
            <div className="sticky-chip chip-bl">ideas for Q3...</div>
            <div className="sticky-chip chip-br">don't forget!</div>
            <div className="pencil-bg">✏️</div>

            <div className="notepad-card">
                <div className="tape-strip"></div>
                
                <div className="app-tag">
                    <span className="app-tag-dot"></span>
                    NoteKeeper
                </div>

                <h1 className="nc-heading">
                    Start a fresh,
                    <span className="writer">page.</span>
                </h1>
                
                <p className="nc-subtext">Join NoteKeeper to organize your writing</p>

                <div className="pills-container">
                    <span className="feature-pill"><span className="pill-dot"></span> unlimited notes</span>
                    <span className="feature-pill"><span className="pill-dot"></span> cloud sync</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            Full Name
                        </label>
                        <input
                            className="form-input"
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            Email
                        </label>
                        <input
                            className="form-input"
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div className="password-header">
                            <label className="form-label" htmlFor="password">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                Password
                            </label>
                        </div>
                        <div className="input-wrapper">
                            <input
                                className="form-input"
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                            <button type="button" className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Sign Up'}
                        {!loading && <span className="btn-arrow">→</span>}
                    </button>
                    {error && <div className="error-msg">{error}</div>}
                </form>

                <div className="register-footer">
                    Already have an account? 
                    <Link to="/login" className="register-link">Log back in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

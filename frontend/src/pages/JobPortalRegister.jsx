import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JobPortalRegister = () => {
    const [userType, setUserType] = useState('seeker'); // 'seeker' or 'recruiter'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registration Data:', { ...formData, userType });
        // Logic for registration would go here
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-[#0a0a1a]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Lora:wght@700&display=swap');

                .job-portal-viewport {
                    font-family: 'Inter', sans-serif;
                }

                .left-panel {
                    position: relative;
                    flex: 1;
                    height: 100vh;
                    background: url('/images/job-portal-bg.png') center/cover no-repeat;
                }

                .left-panel::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(10, 10, 60, 0.85) 0%, rgba(30, 58, 138, 0.4) 100%);
                }

                .hero-text {
                    position: relative;
                    z-index: 10;
                    padding: 60px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .hero-text h1 {
                    font-family: 'Lora', serif;
                    font-size: clamp(2.5rem, 5vw, 4.5rem);
                    line-height: 1.1;
                    color: white;
                    margin-bottom: 24px;
                    text-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }

                .hero-text p {
                    font-size: 1.25rem;
                    color: rgba(255, 255, 255, 0.8);
                    max-width: 500px;
                }

                .right-panel {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    background: #0f172a;
                    position: relative;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 48px;
                    width: 100%;
                    max-width: 480px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .toggle-container {
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 50px;
                    padding: 4px;
                    display: flex;
                    margin-bottom: 32px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .toggle-btn {
                    flex: 1;
                    padding: 12px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    color: rgba(255, 255, 255, 0.5);
                }

                .toggle-btn.active {
                    background: white;
                    color: #0f172a;
                    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
                }

                .input-group {
                    margin-bottom: 20px;
                }

                .input-label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 8px;
                    margin-left: 4px;
                }

                .input-field {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 14px 18px;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                }

                .input-field:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: rgba(255, 255, 255, 0.08);
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }

                .primary-btn {
                    width: 100%;
                    background: #2563eb;
                    color: white;
                    padding: 16px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin-top: 12px;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
                }

                .primary-btn:hover {
                    background: #3b82f6;
                    transform: translateY(-2px);
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
                }

                .footer-dark {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 24px;
                    background: rgba(0, 0, 0, 0.2);
                    display: flex;
                    justify-content: center;
                    gap: 32px;
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                }

                .footer-dark a:hover {
                    color: white;
                }

                @media (max-width: 768px) {
                    .left-panel { display: none; }
                    .right-panel { background: #0f172a url('/images/job-portal-bg.png') center/cover no-repeat; }
                    .right-panel::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: rgba(15, 23, 42, 0.9);
                    }
                }
            `}</style>

            <div className="left-panel hidden md:block">
                <div className="hero-text">
                    <h1>Find Your<br />Next Innovator.</h1>
                    <p>Connecting the world's best talent with the most ambitious companies.</p>
                </div>
            </div>

            <div className="right-panel">
                <div className="glass-card">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400">Join the elite network of professionals</p>
                    </div>

                    <div className="toggle-container">
                        <button 
                            className={`toggle-btn ${userType === 'seeker' ? 'active' : ''}`}
                            onClick={() => setUserType('seeker')}
                        >
                            Job Seeker
                        </button>
                        <button 
                            className={`toggle-btn ${userType === 'recruiter' ? 'active' : ''}`}
                            onClick={() => setUserType('recruiter')}
                        >
                            Recruiter
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field" 
                                placeholder="Enter your full name" 
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field" 
                                placeholder="name@company.com" 
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Phone Number</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field" 
                                placeholder="+1 (555) 000-0000" 
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field" 
                                placeholder="••••••••" 
                                required
                            />
                        </div>

                        <button type="submit" className="primary-btn">
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
                    </div>
                </div>

                <div className="footer-dark hidden md:flex">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Help Center</a>
                    <span>&copy; 2026 JobPortal Inc.</span>
                </div>
            </div>
        </div>
    );
};

export default JobPortalRegister;

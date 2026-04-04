import React from 'react';

const FutureLoginIllustration = () => {
    return (
        <div className="future-illustration-wrapper">
            <style>{`
                .future-illustration-wrapper {
                    position: relative;
                    width: 100%;
                    height: 500px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: visible;
                }

                /* --- Virtual Login Screen --- */
                .virtual-screen-container {
                    position: absolute;
                    right: 40px;
                    top: 100px;
                    width: 200px;
                    height: 280px;
                    animation: floatScreen 6s ease-in-out infinite;
                    transform-origin: center;
                }

                .virtual-screen {
                    width: 100%;
                    height: 100%;
                    background: rgba(59, 130, 246, 0.1);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(59, 130, 246, 0.5);
                    border-radius: 16px;
                    box-shadow: 
                        0 0 40px rgba(59, 130, 246, 0.3),
                        inset 0 0 20px rgba(59, 130, 246, 0.2);
                    padding: 30px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    transform: perspective(800px) rotateY(-15deg);
                    position: relative;
                    overflow: hidden;
                }

                /* Holographic scan line effect */
                .virtual-screen::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.8);
                    box-shadow: 0 0 10px #fff;
                    animation: scanLine 3s linear infinite;
                }

                .screen-avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: 3px solid rgba(255, 255, 255, 0.9);
                    background: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
                }

                .screen-input {
                    width: 100%;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 6px;
                    position: relative;
                }
                
                .screen-input::before {
                    content: '';
                    position: absolute;
                    left: -20px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 10px;
                    height: 10px;
                    background: rgba(59, 130, 246, 0.8);
                    border-radius: 50%;
                    box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
                }

                .screen-button {
                    width: 80%;
                    height: 24px;
                    background: #3b82f6;
                    border-radius: 12px;
                    margin-top: 10px;
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.6);
                }

                /* --- Character (Girl) --- */
                .character {
                    position: absolute;
                    left: 20px;
                    top: 160px;
                    width: 180px;
                    height: 260px;
                    animation: floatChar 5s ease-in-out infinite alternate;
                }

                /* Backpack */
                .backpack {
                    position: absolute;
                    left: 0;
                    top: 60px;
                    width: 50px;
                    height: 80px;
                    background: #334155;
                    border-radius: 10px;
                    z-index: 1;
                }

                /* Body (T-shirt) */
                .body-torso {
                    position: absolute;
                    left: 30px;
                    top: 55px;
                    width: 60px;
                    height: 90px;
                    background: #ffffff;
                    border-radius: 20px 20px 15px 15px;
                    z-index: 3;
                    box-shadow: inset -5px -5px 10px rgba(0,0,0,0.1);
                }

                /* Head */
                .head {
                    position: absolute;
                    left: 45px;
                    top: 0;
                    width: 45px;
                    height: 50px;
                    background: #fcd34d; /* Skin tone approx */
                    border-radius: 50%;
                    z-index: 4;
                }
                
                /* Hair */
                .hair {
                    position: absolute;
                    left: 35px;
                    top: -10px;
                    width: 65px;
                    height: 60px;
                    background: #1e293b; /* Dark hair */
                    border-radius: 50% 50% 0 50%;
                    z-index: 5;
                }

                /* Legs (Jeans) */
                .leg-back, .leg-front {
                    position: absolute;
                    top: 140px;
                    width: 22px;
                    height: 90px;
                    background: #1e40af; /* Denim blue */
                    border-radius: 10px;
                }

                .leg-back {
                    left: 40px;
                    z-index: 1;
                    filter: brightness(0.8);
                    transform-origin: top;
                    transform: rotate(10deg);
                }

                .leg-front {
                    left: 60px;
                    z-index: 2;
                    transform-origin: top;
                    transform: rotate(-5deg);
                }

                /* Shoes */
                .shoe {
                    position: absolute;
                    bottom: -15px;
                    left: -5px;
                    width: 35px;
                    height: 18px;
                    background: #f8fafc;
                    border-radius: 10px 15px 5px 5px;
                }

                /* Arm interacting */
                .arm-interactive {
                    position: absolute;
                    left: 70px;
                    top: 70px;
                    width: 90px;
                    height: 16px;
                    background: #fcd34d; /* Skin */
                    border-radius: 8px;
                    z-index: 6;
                    transform-origin: left center;
                    animation: interactArm 4s ease-in-out infinite;
                }
                
                /* T-shirt sleeve */
                .sleeve {
                    position: absolute;
                    left: -5px;
                    top: -2px;
                    width: 30px;
                    height: 20px;
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
                }

                /* Glowing Touch Point */
                .touch-point {
                    content: '';
                    position: absolute;
                    right: -5px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 12px;
                    height: 12px;
                    background: #60a5fa;
                    border-radius: 50%;
                    box-shadow: 0 0 15px #60a5fa, 0 0 30px #3b82f6;
                    animation: pulseTouch 2s infinite;
                }

                /* Data flowing / Particles */
                .data-particle {
                    position: absolute;
                    background: #3b82f6;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #3b82f6;
                }

                .dp1 { width: 6px; height: 6px; top: 20%; left: 30%; animation: particleFloat 3s infinite 0.5s; }
                .dp2 { width: 10px; height: 10px; top: 60%; right: 40%; animation: particleFloat 4s infinite 1s; }
                .dp3 { width: 4px; height: 4px; top: 40%; left: 50%; animation: particleFloat 2.5s infinite 1.5s; }

                /* Animations */
                @keyframes floatScreen {
                    0%, 100% { transform: translateY(0) perspective(800px) rotateY(-15deg); }
                    50% { transform: translateY(-15px) perspective(800px) rotateY(-18deg); }
                }

                @keyframes floatChar {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes interactArm {
                    0%, 100% { transform: rotate(-10deg) scaleX(0.95); }
                    25% { transform: rotate(-5deg) scaleX(1.05); }
                    50% { transform: rotate(-15deg) scaleX(1); }
                    75% { transform: rotate(0deg) scaleX(1.08); }
                }

                @keyframes scanLine {
                    0% { top: -10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }

                @keyframes pulseTouch {
                    0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.6; }
                    50% { transform: translateY(-50%) scale(1.5); opacity: 1; }
                }

                @keyframes particleFloat {
                    0% { transform: translateY(0) scale(1); opacity: 0; }
                    50% { transform: translateY(-30px) scale(1.2); opacity: 0.8; }
                    100% { transform: translateY(-60px) scale(1); opacity: 0; }
                }

            `}</style>

            <div className="virtual-screen-container">
                <div className="virtual-screen">
                    <div className="screen-avatar"></div>
                    <div className="screen-input"></div>
                    <div className="screen-input" style={{ width: '70%' }}></div>
                    <div className="screen-button"></div>
                </div>
            </div>

            <div className="character">
                <div className="backpack"></div>
                <div className="leg-back">
                    <div className="shoe"></div>
                </div>
                <div className="leg-front">
                    <div className="shoe"></div>
                </div>
                <div className="body-torso"></div>
                <div className="head"></div>
                <div className="hair"></div>
                
                <div className="arm-interactive">
                    <div className="sleeve"></div>
                    <div className="touch-point"></div>
                </div>
            </div>

            <div className="data-particle dp1"></div>
            <div className="data-particle dp2"></div>
            <div className="data-particle dp3"></div>
        </div>
    );
};

export default FutureLoginIllustration;

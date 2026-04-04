import React from 'react';

const NotebookIllustration = () => {
    return (
        <div className="notebook-wrapper">
            <style>{`
                .notebook-wrapper {
                    position: relative;
                    width: 100%;
                    height: 480px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .notebook {
                    width: 260px;
                    height: 360px;
                    background: #ffffff;
                    border-radius: 6px 16px 16px 6px;
                    box-shadow: 
                        -15px 20px 40px rgba(0,0,0,0.1), 
                        inset -5px 0 15px rgba(0,0,0,0.02),
                        inset 2px 0 0 rgba(255,255,255,0.5);
                    position: relative;
                    transform: perspective(1000px) rotateY(-15deg) rotateX(10deg) rotateZ(-3deg);
                    animation: floatNotebook 6s ease-in-out infinite;
                    border-left: 14px solid #1e3a8a; /* Dark blue binding to match theme */
                }

                .notebook-binding {
                    position: absolute;
                    left: -20px;
                    top: 10%;
                    height: 80%;
                    width: 6px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                }

                .bind-ring {
                    width: 16px;
                    height: 6px;
                    background: linear-gradient(to right, #9ca3af, #d1d5db, #9ca3af);
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .notebook-page {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    bottom: 15px;
                    left: 20px;
                    border: 1px solid #e5e7eb;
                    border-radius: 2px 8px 8px 2px;
                    background: repeating-linear-gradient(
                        transparent,
                        transparent 27px,
                        #e5e7eb 27px,
                        #e5e7eb 28px
                    );
                    box-shadow: inset 10px 0 20px rgba(0,0,0,0.02);
                }

                /* Red margin line */
                .notebook-page::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 40px;
                    width: 2px;
                    background: rgba(239, 68, 68, 0.3);
                }

                .pencil-container {
                    position: absolute;
                    top: 45%;
                    left: 45%;
                    z-index: 10;
                    animation: writePencil 5s ease-in-out infinite;
                    transform-origin: left center;
                }

                .pencil {
                    position: relative;
                    width: 140px;
                    height: 18px;
                    background: linear-gradient(to bottom, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
                    border-radius: 2px;
                    box-shadow: 5px 15px 25px rgba(0,0,0,0.2);
                    display: flex;
                }

                .pencil-wood {
                    position: absolute;
                    left: -30px;
                    top: 0;
                    width: 0;
                    height: 0;
                    border-top: 9px solid transparent;
                    border-bottom: 9px solid transparent;
                    border-right: 30px solid #fcd34d;
                    filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1));
                }

                .pencil-lead {
                    position: absolute;
                    left: -30px;
                    top: 5px;
                    width: 0;
                    height: 0;
                    border-top: 4px solid transparent;
                    border-bottom: 4px solid transparent;
                    border-right: 10px solid #374151;
                }

                .pencil-metal {
                    width: 16px;
                    height: 100%;
                    background: linear-gradient(to bottom, #9ca3af, #d1d5db, #9ca3af);
                    border-left: 1px solid #6b7280;
                    border-right: 1px solid #6b7280;
                }

                .pencil-eraser {
                    width: 20px;
                    height: 100%;
                    background: linear-gradient(to bottom, #f472b6, #ec4899, #db2777);
                    border-radius: 0 4px 4px 0;
                }

                .pencil-body {
                    flex: 1;
                    height: 100%;
                    position: relative;
                }

                /* Pencil ridges */
                .pencil-body::after {
                    content: '';
                    position: absolute;
                    top: 6px;
                    left: 0;
                    right: 0;
                    height: 6px;
                    background: rgba(0,0,0,0.1);
                }

                /* Floating particles around notebook */
                .sparkle {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: #fbbf24;
                    border-radius: 50%;
                    filter: blur(1px);
                    animation: sparklePulse 3s infinite alternate;
                }

                .s1 { top: 10%; right: 20%; animation-delay: 0s; }
                .s2 { bottom: 20%; left: 10%; background: #60a5fa; animation-delay: 1s; }
                .s3 { top: 40%; left: 5%; width: 5px; height: 5px; background: #e879f9; animation-delay: 2s; }

                @keyframes floatNotebook {
                    0%, 100% { transform: perspective(1000px) rotateY(-15deg) rotateX(10deg) rotateZ(-3deg) translateY(0); }
                    50% { transform: perspective(1000px) rotateY(-18deg) rotateX(12deg) rotateZ(-2deg) translateY(-20px); }
                }

                @keyframes writePencil {
                    0% { transform: translate(-30px, -50px) rotate(-25deg); }
                    15% { transform: translate(50px, -50px) rotate(-15deg); }
                    30% { transform: translate(-20px, -10px) rotate(-22deg); }
                    45% { transform: translate(60px, -10px) rotate(-12deg); }
                    60% { transform: translate(-10px, 30px) rotate(-20deg); }
                    75% { transform: translate(70px, 30px) rotate(-10deg); }
                    90% { transform: translate(-30px, -50px) rotate(-28deg); }
                    100% { transform: translate(-30px, -50px) rotate(-25deg); }
                }

                @keyframes sparklePulse {
                    0% { transform: scale(0.8); opacity: 0.2; }
                    100% { transform: scale(1.5); opacity: 0.8; }
                }
            `}</style>

            <div className="notebook">
                <div className="notebook-binding">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bind-ring"></div>)}
                </div>
                <div className="notebook-page"></div>
            </div>

            <div className="pencil-container">
                <div className="pencil">
                    <div className="pencil-wood"></div>
                    <div className="pencil-lead"></div>
                    <div className="pencil-body"></div>
                    <div className="pencil-metal"></div>
                    <div className="pencil-eraser"></div>
                </div>
            </div>

            <div className="sparkle s1"></div>
            <div className="sparkle s2"></div>
            <div className="sparkle s3"></div>
        </div>
    );
};

export default NotebookIllustration;

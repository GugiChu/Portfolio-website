import React from 'react';

const Loader = () => {
    return (
        <div className="loader-overlay">
            <div className="loader-spinner"></div>
            <style>{`
                .loader-overlay {
                    position: fixed;
                    top: 0; 
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #111;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }
                .loader-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(255, 69, 0, 0.2);
                    border-top: 4px solid #ff4500;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loader;

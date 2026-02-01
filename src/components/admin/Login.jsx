import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Loader from '../common/Loader';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError("Invalid credentials. Access Denied.");
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access the dashboard</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        Sign In
                    </button>
                </form>
            </div>
            <style>{`
                .login-container {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #050505;
                    font-family: 'Inter', sans-serif;
                }
                .login-box {
                    background: rgba(26, 26, 26, 0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 48px;
                    border-radius: 24px;
                    width: 100%;
                    max-width: 420px;
                    box-shadow: 0 0 40px rgba(0,0,0,0.5);
                    animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 32px;
                }
                .login-header h2 {
                    color: #fff;
                    font-size: 2rem;
                    margin-bottom: 8px;
                    font-weight: 700;
                }
                .login-header p {
                    color: #888;
                    font-size: 0.95rem;
                }
                .input-group {
                    margin-bottom: 20px;
                }
                input {
                    width: 100%;
                    padding: 16px;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 12px;
                    color: white;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.3s ease;
                }
                input:focus {
                    border-color: #ff4500;
                    box-shadow: 0 0 0 2px rgba(255, 69, 0, 0.1);
                    background: #161616;
                }
                .login-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #ff4500, #cc3700);
                    border: none;
                    color: white;
                    font-size: 1rem;
                    font-weight: 600;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    margin-top: 12px;
                }
                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(255, 69, 0, 0.2);
                }
                .login-btn:active {
                    transform: scale(0.98);
                }
                .error-message {
                    background: rgba(255, 69, 0, 0.1);
                    color: #ff4500;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                    font-size: 0.9rem;
                    border: 1px solid rgba(255, 69, 0, 0.2);
                }

                @media (max-width: 480px) {
                    .login-container {
                        padding: 20px;
                    }
                    .login-box {
                        padding: 32px 24px;
                    }
                    .login-header h2 {
                        font-size: 1.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;

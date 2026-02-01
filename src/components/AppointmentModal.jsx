import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AppointmentModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ fullName: '', mobile: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null); // 'success' or 'error'

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "appointments"), {
                ...formData,
                createdAt: serverTimestamp()
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus(null);
                setFormData({ fullName: '', mobile: '' });
            }, 2000);
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatus('error');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>&times;</button>

                {status === 'success' ? (
                    <div className="success-message">
                        <h3>Thanks!</h3>
                        <p>We'll call you shortly.</p>
                    </div>
                ) : (
                    <>
                        <h2>Book an Appointment</h2>
                        <p className="modal-desc">Enter your details and we'll get back to you.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="Mobile Number"
                                    required
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                            </button>

                            {status === 'error' && <p className="error-msg">Something went wrong. Try again.</p>}
                        </form>
                    </>
                )}
            </div>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: #1a1a1a;
          padding: 40px;
          border-radius: 20px;
          width: 100%;
          max-width: 400px;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          animation: slideUp 0.3s ease;
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 20px;
          font-size: 24px;
          color: var(--text-gray);
        }
        
        .close-btn:hover { color: white; }

        h2 { font-size: 1.8rem; margin-bottom: 8px; color: var(--text-white); }
        .modal-desc { color: var(--text-gray); margin-bottom: 24px; font-size: 0.95rem; }

        .input-group { margin-bottom: 16px; }
        
        input {
          width: 100%;
          padding: 14px 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus { border-color: var(--accent-orange); }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: var(--accent-orange);
          color: #000;
          border-radius: 999px;
          font-weight: 600;
          margin-top: 8px;
          transition: opacity 0.2s;
        }
        
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .success-message { text-align: center; padding: 20px 0; }
        .success-message h3 { color: var(--accent-orange); font-size: 2rem; margin-bottom: 8px; }
        .error-msg { color: #ff4d4d; font-size: 0.9rem; margin-top: 12px; text-align: center; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default AppointmentModal;

import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Loader from '../common/Loader';

const AdminDashboard = () => {
    const [contacts, setContacts] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('contacts');
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Contacts
                const contactsQuery = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
                const contactsSnapshot = await getDocs(contactsQuery);
                setContacts(contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch Appointments
                const appointmentsQuery = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
                const appointmentsSnapshot = await getDocs(appointmentsQuery);
                setAppointments(appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        signOut(auth);
    };

    const openModal = (item, type) => {
        setSelectedItem({ ...item, type });
    };

    const closeModal = () => {
        setSelectedItem(null);
    };

    if (loading) return <Loader />;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="brand-dot"></div>
                    <h1>Admin Dashboard</h1>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </header>

            <div className="tabs-container">
                <button
                    className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('contacts')}
                >
                    Contacts <span className="badge">{contacts.length}</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('appointments')}
                >
                    Appointments <span className="badge">{appointments.length}</span>
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'contacts' && (
                    <div className="table-card fadeIn">
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Name</th>
                                        <th>Email & Type</th>
                                        <th>Budget</th>
                                        <th style={{ width: '30%' }}>Vision</th>
                                        <th style={{ width: '80px', textAlign: 'center' }}>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map(contact => (
                                        <tr key={contact.id}>
                                            <td className="date-cell">
                                                {contact.createdAt?.toDate().toLocaleDateString()}
                                                <small>{contact.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                            </td>
                                            <td className="name-cell">{contact.name}</td>
                                            <td>
                                                <div className="user-info">
                                                    <span className="email">{contact.email}</span>
                                                    <span className="service-tag">{contact.serviceType}</span>
                                                </div>
                                            </td>
                                            <td className="budget-cell">{contact.budget}</td>
                                            <td className="vision-cell-truncated">{contact.vision}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button className="icon-btn" onClick={() => openModal(contact, 'Contact')}>
                                                    <EyeIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="table-card fadeIn">
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Full Name</th>
                                        <th>Mobile Number</th>
                                        <th style={{ width: '80px', textAlign: 'center' }}>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(apt => (
                                        <tr key={apt.id}>
                                            <td className="date-cell">
                                                {apt.createdAt?.toDate().toLocaleDateString()}
                                                <small>{apt.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                            </td>
                                            <td className="name-cell">{apt.fullName}</td>
                                            <td className="mobile-cell">{apt.mobile}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button className="icon-btn" onClick={() => openModal(apt, 'Appointment')}>
                                                    <EyeIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {selectedItem && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedItem.type} Details</h2>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            {selectedItem.type === 'Contact' ? (
                                <>
                                    <DetailRow label="Name" value={selectedItem.name} />
                                    <DetailRow label="Email" value={selectedItem.email} />
                                    <DetailRow label="Service Type" value={selectedItem.serviceType} />
                                    <DetailRow label="Budget" value={selectedItem.budget} />
                                    <div className="detail-block">
                                        <label>Vision / Message</label>
                                        <p>{selectedItem.vision}</p>
                                    </div>
                                    <DetailRow date label="Submitted On" value={selectedItem.createdAt} />
                                </>
                            ) : (
                                <>
                                    <DetailRow label="Full Name" value={selectedItem.fullName} />
                                    <DetailRow label="Mobile Number" value={selectedItem.mobile} />
                                    <DetailRow date label="Submitted On" value={selectedItem.createdAt} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                :root {
                    --bg-dark: #050505;
                    --card-bg: #111;
                    --card-border: #222;
                    --primary: #ff4500;
                    --text-main: #fff;
                    --text-muted: #888;
                }

                .dashboard-container {
                    min-height: 100vh;
                    background: var(--bg-dark);
                    color: var(--text-main);
                    padding: 40px;
                    font-family: 'Inter', sans-serif;
                }

                /* Header */
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    padding-bottom: 24px;
                    border-bottom: 1px solid var(--card-border);
                }
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .brand-dot {
                    width: 12px;
                    height: 12px;
                    background: var(--primary);
                    border-radius: 50%;
                    box-shadow: 0 0 12px var(--primary);
                }
                .dashboard-header h1 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    letter-spacing: -0.5px;
                }
                .logout-btn {
                    background: #1a1a1a;
                    color: #ccc;
                    border: 1px solid #333;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .logout-btn:hover {
                    background: #222;
                    color: #fff;
                    border-color: #444;
                }

                /* Tabs */
                .tabs-container {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 32px;
                }
                .tab-btn {
                    background: transparent;
                    border: 1px solid transparent;
                    color: var(--text-muted);
                    padding: 10px 20px;
                    border-radius: 99px;
                    font-size: 0.95rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .tab-btn .badge {
                    background: #1a1a1a;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }
                .tab-btn:hover {
                    color: #fff;
                    background: #111;
                }
                .tab-btn.active {
                    background: rgba(255, 69, 0, 0.1);
                    color: var(--primary);
                    border-color: rgba(255, 69, 0, 0.2);
                }
                .tab-btn.active .badge {
                    background: var(--primary);
                    color: white;
                }

                /* Table Card */
                .table-card {
                    background: var(--card-bg);
                    border-radius: 16px;
                    border: 1px solid var(--card-border);
                    overflow: hidden;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                }
                .table-wrapper {
                    overflow-x: auto;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th {
                    background: #161616;
                    color: var(--text-muted);
                    font-weight: 500;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding: 16px 24px;
                    text-align: left;
                    white-space: nowrap;
                }
                td {
                    padding: 20px 24px;
                    border-bottom: 1px solid #1a1a1a;
                    color: #e0e0e0;
                    vertical-align: middle;
                    font-size: 0.95rem;
                }
                tr:last-child td {
                    border-bottom: none;
                }
                tr:hover td {
                    background: #161616;
                }

                /* Cell Styles */
                .date-cell {
                    white-space: nowrap;
                    color: #bbb;
                }
                .date-cell small {
                    display: block;
                    color: #666;
                    margin-top: 4px;
                    font-size: 0.8rem;
                }
                .name-cell {
                    font-weight: 600;
                    color: #fff;
                }
                .user-info {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .email {
                    color: #bbb;
                }
                .service-tag {
                    display: inline-block;
                    background: #222;
                    color: #aaa;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    width: fit-content;
                    border: 1px solid #333;
                }
                .budget-cell {
                    font-family: monospace;
                    color: #4ade80;
                }
                .vision-cell-truncated {
                    max-width: 250px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: #ccc;
                }
                .mobile-cell {
                    font-family: monospace;
                    letter-spacing: 1px;
                }

                /* Icon Button */
                .icon-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-btn:hover {
                    color: var(--primary);
                    background: rgba(255, 69, 0, 0.1);
                }

                /* Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s;
                }
                .modal-content {
                    background: #1a1a1a;
                    border: 1px solid #333;
                    width: 100%;
                    max-width: 600px;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                    animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    max-height: 90vh;
                    overflow-y: auto;
                }
                .modal-header {
                    padding: 24px;
                    border-bottom: 1px solid #333;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h2 {
                    margin: 0;
                    font-size: 1.25rem;
                }
                .close-btn {
                    background: transparent;
                    border: none;
                    color: #888;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .close-btn:hover { color: #fff; }
                
                .modal-body {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .detail-row {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .detail-row label, .detail-block label {
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .detail-row span, .detail-block p {
                    color: #fff;
                    font-size: 1rem;
                    line-height: 1.5;
                }
                .detail-block {
                    background: #111;
                    padding: 16px;
                    border-radius: 8px;
                    border: 1px solid #333;
                }
                .detail-block p {
                    white-space: pre-wrap;
                    margin-top: 8px;
                }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                /* Responsive Adjustments */
                @media (max-width: 1024px) {
                    .dashboard-container { padding: 30px; }
                }

                @media (max-width: 768px) {
                    .dashboard-container { padding: 20px; }
                    .dashboard-header { flex-direction: column; gap: 16px; align-items: flex-start; }
                    .header-left { width: 100%; }
                    .logout-btn { align-self: flex-end; }
                    
                    /* Tabs scrollable on mobile */
                    .tabs-container { overflow-x: auto; padding-bottom: 8px; -webkit-overflow-scrolling: touch; }
                    .tab-btn { flex-shrink: 0; }

                    /* Modal Mobile */
                    .modal-content { width: 90%; max-height: 80vh; margin: 20px; }
                    .modal-header { padding: 20px; }
                    .modal-body { padding: 20px; }
                }

                @media (max-width: 480px) {
                    .dashboard-header h1 { font-size: 1.25rem; }
                    th, td { padding: 12px 16px; font-size: 0.85rem; }
                    
                    /* Hide less important columns on very small screens if needed, 
                       but horizontal scroll is active so user can scroll. 
                       Maybe reduce max-width of truncated vision cell */
                    .vision-cell-truncated { max-width: 150px; }
                }
            `}</style>
        </div>
    );
};

// Helper Components
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const DetailRow = ({ label, value, date }) => {
    let displayValue = value;
    if (date && value) {
        displayValue = value.toDate().toLocaleString();
    }
    return (
        <div className="detail-row">
            <label>{label}</label>
            <span>{displayValue || '-'}</span>
        </div>
    );
};

export default AdminDashboard;

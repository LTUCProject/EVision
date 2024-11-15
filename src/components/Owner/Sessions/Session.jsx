import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Session.css';

const Session = ({ stationId, clientId }) => {
    const [sessions, setSessions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [newEnergyConsumed, setNewEnergyConsumed] = useState(0);
    const [newCost, setNewCost] = useState(0);
    const [isFetchingSessions, setIsFetchingSessions] = useState(false);
    const [startSessionModalOpen, setStartSessionModalOpen] = useState(false);
    const [endSessionModalOpen, setEndSessionModalOpen] = useState(false);

    // مرجع لنموذج "Start New Session"
    const startSessionModalRef = useRef(null);
    // مرجع لنموذج "End Session"
    const endSessionModalRef = useRef(null);

    useEffect(() => {
        if (stationId) {
            fetchSessions();
        }
    }, [stationId]);

    const fetchSessions = async () => {
        try {
            const response = await axios.get(`https://localhost:7080/api/Owner/byChargingStation/${stationId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setSessions(response.data.$values);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            toast.error("Failed to load sessions.");
        }
    };

    const handleStartSession = async () => {
        try {
            const requestData = {
                clientId: clientId,
                chargingStationId: stationId,
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
                energyConsumed: 1,
                cost: 1
            };

            const response = await axios.post('https://localhost:7080/api/Owner/start', requestData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                }
            });

            toast.success("Session started successfully!");
            fetchSessions();
            setModalOpen(false);
        } catch (error) {
            console.error('Error starting session:', error);
            toast.error("Failed to start session.");
        }
    };

    const handleEndSession = async () => {
        if (selectedSession) {
            const endTime = new Date().toISOString();
            const updatedCost = calculateCost(newEnergyConsumed);

            try {
                const requestUrl = `https://localhost:7080/api/Owner/end/${selectedSession.sessionId}?energyConsumed=${newEnergyConsumed}&cost=${updatedCost}`;
                console.log('Request URL:', requestUrl);

                await axios.post(requestUrl, null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    }
                });

                toast.success("Session ended successfully!");
                fetchSessions();
                setEndSessionModalOpen(false); // Close the modal after successful end
            } catch (error) {
                console.error('Error ending session:', error);
                toast.error("Failed to end session.");
            }
        }
    };

    const closeModal = () => {
        setEndSessionModalOpen(false);
        setSelectedSession(null);
        setNewEnergyConsumed(0);
        setNewCost(0);
    };

    const calculateCost = (energyConsumed) => {
        const costPerkWh = 0.25;
        const cost = energyConsumed * costPerkWh;
        return Math.round(cost);
    };

    const openEndSessionModal = (session) => {
        setSelectedSession(session);
        setNewEnergyConsumed(session.energyConsumed || 0);
        setNewCost(session.cost || 0);
        setEndSessionModalOpen(true); // Manually open the modal for the selected session
        // التمرير التلقائي إلى النموذج
        endSessionModalRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const openStartSessionModal = () => {
        setEndSessionModalOpen(false);
        setStartSessionModalOpen(true);
        // التمرير التلقائي إلى النموذج
        startSessionModalRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="session-container">
            <h2 className="session-title">Sessions for Station {stationId}</h2>
            <button className="button-toggle" onClick={fetchSessions}>
                Refresh Sessions
            </button>
            {sessions.length > 0 ? (
                <ul className="session-list">
                    {sessions.map(session => (
                        <li key={session.sessionId} className="session-item">
                            <strong>Session ID:</strong> {session.sessionId} |
                            <strong> Client ID:</strong> {session.clientId} |
                            <strong> Start Time:</strong> {new Date(session.startTime).toLocaleString()} |
                            <strong> End Time:</strong> {session.endTime ? new Date(session.endTime).toLocaleString() : 'Not Ended'} |
                            <strong> Energy Consumed:</strong> {session.energyConsumed} kWh |
                            <strong> Cost:</strong> ${session.cost}
                            <div className="button-container">
                                <button className="update-button" onClick={() => openEndSessionModal(session)}>End Session</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-sessions-message">No sessions available for this station.</p>
            )}

            <button className="start-session-button" onClick={openStartSessionModal}>
                Start New Session
            </button>

            {startSessionModalOpen && (
                <div className="modal-overlay" ref={startSessionModalRef}>
                    <div className="modal-content">
                        <h2>Start New Session</h2>
                        <button onClick={handleStartSession}>Start Session</button>
                        <button onClick={() => setStartSessionModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {endSessionModalOpen && selectedSession && (
                <div className="modal-overlay" ref={endSessionModalRef}>
                    <div className="modal-content">
                        <h2>End Session</h2>
                        <label>
                            Energy Consumed (kWh):
                            <input
                                type="number"
                                value={newEnergyConsumed}
                                onChange={(e) => {
                                    setNewEnergyConsumed(e.target.value);
                                    setNewCost(calculateCost(e.target.value));
                                }}
                            />
                        </label>
                        <label>
                            Cost ($):
                            <input
                                type="number"
                                value={newCost}
                                onChange={(e) => setNewCost(e.target.value)}
                                disabled
                            />
                        </label>
                        <button
                            onClick={handleEndSession}
                            style={{
                                backgroundColor: "#007bff", color: "white", padding: "12px 24px", cursor: "pointer", borderRadius: "8px"
                            }}
                        >
                            End Session
                        </button>
                        <button
                            onClick={closeModal}
                            style={{
                                backgroundColor: "#f8d7da", color: "#721c24", padding: "12px 24px", cursor: "pointer", borderRadius: "8px"
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Session;
   
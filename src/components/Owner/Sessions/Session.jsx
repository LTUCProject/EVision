import React, { useEffect, useState } from 'react';
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
                clientId: clientId, // Make sure the field names match the Swagger request
                chargingStationId: stationId,
                startTime: new Date().toISOString(), // Ensure this format matches the expected one
                endTime: new Date().toISOString(), // Adjust accordingly
                energyConsumed: 1, // Set to a positive value for testing
                cost: 1 // Set to a positive value for testing
            };

            const response = await axios.post('https://localhost:7080/api/Owner/start', requestData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is included
                    "Content-Type": "application/json",
                }
            });

            toast.success("Session started successfully!");
            fetchSessions();
            setModalOpen(false);
        } catch (error) {
            console.error('Error starting session:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data); // Log detailed error
                toast.error("Failed to start session.");
            }
        }
    };



    const handleEndSession = async () => {
        if (selectedSession) {
            const endTime = new Date().toISOString();
            const updatedCost = calculateCost(newEnergyConsumed); // This now returns an integer
    
            try {
                // Log the request URL to verify query parameters
                const requestUrl = `https://localhost:7080/api/Owner/end/${selectedSession.sessionId}?energyConsumed=${newEnergyConsumed}&cost=${updatedCost}`;
                console.log('Request URL:', requestUrl);
    
                // Sending query parameters without request body
                await axios.post(requestUrl, null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    }
                });
    
                toast.success("Session ended successfully!");
                fetchSessions();
                setModalOpen(false);
            } catch (error) {
                console.error('Error ending session:', error);
                toast.error("Failed to end session.");
            }
        }
    };
    

    const openStartSessionModal = () => {
        setModalOpen(true);
        setSelectedSession(null); // Ensure no session is selected when starting a new one
    };

    const openEndSessionModal = (session) => {
        setSelectedSession(session);
        setNewEnergyConsumed(session.energyConsumed || 0);
        setNewCost(session.cost || 0);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedSession(null);
        setNewEnergyConsumed(0);
        setNewCost(0);
    };

    const calculateCost = (energyConsumed) => {
        const costPerkWh = 0.25; 
        const cost = energyConsumed * costPerkWh;
    
       
        return Math.round(cost);
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

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {selectedSession ? (
                            <div>
                                <h2>End Session</h2>
                                <label>
                                    Energy Consumed (kWh):
                                    <input
                                        type="number"
                                        value={newEnergyConsumed}
                                        onChange={(e) => {
                                            setNewEnergyConsumed(e.target.value);
                                            setNewCost(calculateCost(e.target.value)); // Recalculate cost when energy changes
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
                                <button onClick={handleEndSession}>End Session</button>
                            </div>
                        ) : (
                            <div>
                                <h2>Start New Session</h2>
                                <button onClick={handleStartSession}>Start Session</button>
                            </div>
                        )}
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Session;

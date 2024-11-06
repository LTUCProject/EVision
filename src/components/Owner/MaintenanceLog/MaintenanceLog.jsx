import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './MaintenanceLog.css';


const MaintenanceLog = ({ stationId }) => {
    const [logs, setLogs] = useState([]);
    const [newLog, setNewLog] = useState({
        chargingStationId: stationId,
        maintenanceDate: '',
        performedBy: '',
        details: '',
        cost: ''
    });

    useEffect(() => {
        // Fetch logs whenever stationId changes
        if (stationId) {
            fetchMaintenanceLogs();
            setNewLog(prevLog => ({
                ...prevLog,
                chargingStationId: stationId
            }));
        }
    }, [stationId]);

    const fetchMaintenanceLogs = async () => {
        console.log(`Fetching logs for station ID: ${stationId}`); // Debugging log
        try {
            const response = await axios.get(`https://localhost:7080/api/Owner/maintenance/${stationId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            console.log('Logs fetched:', response.data); // Debugging log
            
            // Ensure logs is always an array
            const fetchedLogs = Array.isArray(response.data.$values) ? response.data.$values : [];
            
            // Format the logs to match the expected structure
            const formattedLogs = fetchedLogs.map(log => ({
                maintenanceLogId: log.maintenanceLogId,
                maintenanceDate: log.maintenanceDate,
                performedBy: log.performedBy,
                details: log.details,
                cost: log.cost
            }));
            
            setLogs(formattedLogs); // Update state with formatted logs
        } catch (error) {
            console.error('Error fetching maintenance logs:', error);
            toast.error("Failed to load maintenance logs.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLog({ ...newLog, [name]: value });
    };

    const handleAddLog = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7080/api/Owner/maintenance', newLog, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            toast.success("Maintenance log added successfully");
            setLogs(prevLogs => [...prevLogs, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error adding maintenance log:', error);
            toast.error("Failed to add maintenance log: " + (error.response?.data?.message || "Server error"));
        }
    };

    const handleDeleteLog = async (logId) => {
        try {
            await axios.delete(`https://localhost:7080/api/Owner/maintenance/${logId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            toast.success("Maintenance log deleted successfully");
            setLogs(prevLogs => prevLogs.filter(log => log.maintenanceLogId !== logId));
        } catch (error) {
            console.error('Error deleting maintenance log:', error);
            toast.error("Failed to delete maintenance log: " + (error.response?.data?.message || "Server error"));
        }
    };

    const resetForm = () => {
        setNewLog({
            chargingStationId: stationId,
            maintenanceDate: '',
            performedBy: '',
            details: '',
            cost: ''
        });
    };

    return (
        <div className="maintenance-log-container">
            <h2 className="maintenance-log-title">Maintenance Logs for Station {stationId}</h2>
            <form className="maintenance-log-form" onSubmit={handleAddLog}>
                <input
                    type="date"
                    name="maintenanceDate"
                    className="maintenance-log-input"
                    value={newLog.maintenanceDate}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="performedBy"
                    placeholder="Performed By"
                    className="maintenance-log-input"
                    value={newLog.performedBy}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="details"
                    placeholder="Details"
                    className="maintenance-log-textarea"
                    value={newLog.details}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="cost"
                    placeholder="Cost"
                    className="maintenance-log-input"
                    value={newLog.cost}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit" className="maintenance-log-button"  style={{ backgroundColor: '#007bff' }}>Add Maintenance Log</button>
            </form>
    
            <h3 className="maintenance-log-subtitle">Existing Maintenance Logs</h3>
            <ul className="maintenance-log-list">
    {logs.length > 0 ? (
        logs.map(log => (
            <li key={log.maintenanceLogId} className="maintenance-log-item">
                <div className="maintenance-log-info">
                    <div className="maintenance-log-label">Date:</div>
                    <div className="maintenance-log-value">{new Date(log.maintenanceDate).toLocaleDateString()}</div>
                </div>
                <div className="maintenance-log-info">
                    <div className="maintenance-log-label">Performed By:</div>
                    <div className="maintenance-log-value">{log.performedBy}</div>
                </div>
                <div className="maintenance-log-info">
                    <div className="maintenance-log-label">Details:</div>
                    <div className="maintenance-log-value">{log.details}</div>
                </div>
                <div className="maintenance-log-info">
                    <div className="maintenance-log-label">Cost:</div>
                    <div className="maintenance-log-value">${log.cost}</div>
                </div>
                <button 
                    className="maintenance-log-delete-button" 
                    onClick={() => handleDeleteLog(log.maintenanceLogId)}
                >
                    Delete
                </button>
            </li>
        ))
    ) : (
        <li className='samar'>No maintenance logs available for this station.</li>
    )}
</ul>

        </div>
    );
    
};

export default MaintenanceLog;
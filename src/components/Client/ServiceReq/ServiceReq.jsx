import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServiceReq.css';

const ServiceReq = () => {
    const [username, setUsername] = useState('');
    const [serviceRequests, setServiceRequests] = useState([]);
    const [serviceInfos, setServiceInfos] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [vehicleId, setVehicleId] = useState('');
    const [serviceInfoId, setServiceInfoId] = useState('');
    const [providerId, setProviderId] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');

    // Fetch client vehicles
    const loadClientVehicles = async () => {
        try {
            const response = await axios.get('https://localhost:7080/api/Clients/vehicle', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setVehicles(response.data.$values || []);
        } catch (error) {
            setMessage('Failed to load vehicles.');
        }
    };

    // Fetch client service requests
    const loadClientServiceRequests = async () => {
        try {
            const response = await axios.get('https://localhost:7080/api/Clients/service-requests', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setServiceRequests(response.data.$values || []);
        } catch (error) {
            setMessage('Failed to load service requests.');
        }
    };

    // Fetch available service infos (providers, services)
    const loadServiceInfos = async () => {
        try {
            const response = await axios.get('https://localhost:7080/api/Clients/service-infos', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setServiceInfos(response.data.$values || []);
        } catch (error) {
            setMessage('Failed to load service info.');
        }
    };

    useEffect(() => {
        loadClientServiceRequests();
        loadServiceInfos();
        loadClientVehicles(); // Load vehicles when component mounts
        setUsername(localStorage.getItem("username") || "Guest");
    }, []);

    const handleServiceInfoChange = (e) => {
        const selectedServiceInfoId = e.target.value;
        setServiceInfoId(selectedServiceInfoId);

        // Find the corresponding serviceInfo from the serviceInfos array
        const selectedServiceInfo = serviceInfos.find(info => info.serviceInfoId === parseInt(selectedServiceInfoId)); // Ensure to match the correct ID

        if (selectedServiceInfo) {
            // Extract providerId from the selected serviceInfo's provider object
            setProviderId(selectedServiceInfo.provider.providerId); // Set the providerId automatically from the nested provider field
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        // Make sure providerId is set properly before submitting
        if (!providerId) {
            setMessage("Please select a valid service info with a provider.");
            return;
        }

        const serviceRequestData = {
            vehicleId,
            serviceInfoId,
            providerId,
            status: "Pending"  // Set the status directly in the data object
        };
        


        try {
            const response = await axios.post('https://localhost:7080/api/Clients/service-requests', serviceRequestData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            const { serviceRequestId, vehicleId, serviceInfoId, status } = response.data;
            setMessage(`Service Request added successfully! ID: ${serviceRequestId}, Vehicle ID: ${vehicleId}, Service ID: ${serviceInfoId}, Status: ${status}`);

            setVehicleId('');
            setServiceInfoId('');
            setProviderId('');
            setStatus('');
            loadClientServiceRequests(); // Reload service requests
        } catch (error) {
            setMessage(`Error adding service request: ${error.response ? error.response.data : error.message}`);
        }
    };



    // Handle deletion of service request
    const handleDelete = async (requestId) => {
        try {
            await axios.delete(`https://localhost:7080/api/Clients/service-requests/${requestId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setMessage(`Service Request with ID ${requestId} deleted successfully.`);
            loadClientServiceRequests(); // Reload service requests
        } catch (error) {
            setMessage(`Error deleting service request: ${error.response ? error.response.data : error.message}`);
        }
    };

    return (
        <div className="service-req-dashboard">
            <div className="service-info-container">
                <h1 className="service-info-title">Available Services </h1>

                {message && <p className="error-message">{message}</p>}

                <div className="service-info-list">
                    {serviceInfos.length === 0 ? (
                        <p>No service information available.</p>
                    ) : (
                        serviceInfos.map((service) => (
                            <div key={service.serviceInfoId} className="service-info-card">
                                <h2 className="service-name">{service.name}</h2>
                                <p className="service-description">{service.description}</p>
                                <p className="service-contact">Contact: {service.contact}</p>
                                <div className="provider-info">
                                    <h3 className="provider-title">Provider:</h3>
                                    <p>Name: {service.provider.name}</p>
                                    {/* <p>Email: {service.provider.email}</p> */}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="service-req-dashboard-content">
                <h1 className="service-req-title">Manage Your Service Requests</h1>

                <div className="service-req-main-content">
                    {/* Form to create new service request */}
                    <div className="request-form-box">
                        <h2 className="form-title">Create a New Service Request</h2>
                        <form onSubmit={handleSubmit} className="request-form">
                            <div className="input-group">
                                <label className="input-label">Vehicle:</label>
                                <select
                                    value={vehicleId}
                                    onChange={(e) => setVehicleId(e.target.value)}
                                    required
                                    className="input-field"
                                >
                                    <option value="">Select a vehicle</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                            {vehicle.model} {/* Show vehicle model */}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Service Info:</label>
                                <select
                                    value={serviceInfoId}
                                    onChange={handleServiceInfoChange} // Update serviceInfoId based on selection
                                    required
                                    className="input-field"
                                >
                                    <option value="">Select a service</option>
                                    {serviceInfos.map(info => (
                                        <option key={info.serviceInfoId} value={info.serviceInfoId}>
                                            {info.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                {/* <label className="input-label">Status:</label> */}
                                <input
                                    type="hidden"
                                    value="Pending"  // Always set to "Pending"
                                    readOnly           // Prevent user from editing
                                    className="status-field"
                                />
                            </div>
                            <button type="submit" className="submit-btn">
                                Create Request
                            </button>
                        </form>
                        {message && <p className="form-message">{message}</p>}
                    </div>

                    {/* Service Requests List */}
                    {serviceRequests.length > 0 && (
                        <div className="service-req-table-box">
                            <h2 className="table-title">{username}'s Service Requests</h2>
                            <table className="requests-table">
                                <thead>
                                    <tr className="table-header">
                                        <th>Vehicle ID</th>
                                        <th>Service Info</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceRequests.map((request) => (
                                        <tr key={request.serviceRequestId} className="table-row">
                                            <td>{request.vehicleModel}</td>
                                            <td>{request.serviceInfoName}</td>
                                            <td>{request.status}</td>
                                            <td>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(request.serviceRequestId)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceReq;
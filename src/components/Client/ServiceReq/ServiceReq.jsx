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
    const [feedbacks, setFeedbacks] = useState({}); // State to store feedbacks for each serviceInfoId
    const [rating, setRating] = useState(0); // Default rating is 0
    const [comment, setComment] = useState(''); // Default comment is empty
    const [favoriteServices, setFavoriteServices] = useState([]); // State to store the client's favorite services



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

    // Function to add a service to favorites
    const addToFavorites = async (serviceInfoId) => {
        // Check if service is already in favorites
        if (favoriteServices.some(service => service.serviceInfoId === serviceInfoId)) {
            alert("This service is already in your favorites!");
            return; // Do nothing if already in favorites
        }
    
        const favoriteData = {
            clientId: GetClientIdFromToken(),
            serviceInfoId: serviceInfoId,
        };
    
        try {
            const response = await axios.post(
                'https://localhost:7080/api/Clients/ServiceInfoFavorites',
                favoriteData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            alert(`Service ${response.data.serviceInfoName} added to favorites successfully!`);
            setFavoriteServices((prevFavorites) => [...prevFavorites, response.data]); // Update favorites state
        } catch (error) {
            console.error('Error adding to favorites:', error);
            alert('Failed to add service to favorites.');
        }
    };
    
    // Fetch feedbacks for a specific serviceInfoId
    const loadFeedbacksForService = async (serviceInfoId) => {
        try {
            const response = await axios.get(`https://localhost:7080/api/Clients/feedbacks/service/${serviceInfoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const feedbackList = response.data.$values || []; // Extract the $values array

            setFeedbacks((prevFeedbacks) => ({
                ...prevFeedbacks,
                [serviceInfoId]: feedbackList // Update feedbacks for this serviceInfoId
            }));
        } catch (error) {
            console.error(`Failed to load feedbacks for ServiceInfoId ${serviceInfoId}:`, error);
        }
    };

    // Function to submit feedback to the API
    const handleFeedbackSubmit = async (serviceInfoId) => {
        const feedbackData = {
            clientId: GetClientIdFromToken(), // Retrieve clientId from token
            serviceInfoId: serviceInfoId, // Use serviceInfoId automatically
            rating: rating, // Use rating from state
            comments: comment, // Use comment from state
            date: new Date().toISOString()
        };

        try {
            const response = await axios.post('https://localhost:7080/api/Clients/feedbacks', feedbackData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            alert("Feedback added successfully");
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('An error occurred while submitting feedback.');
        }
    };

    // Function to extract clientId from the token
    const GetClientIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
        return decodedToken.clientId; // Ensure clientId is present in the token
    };




    useEffect(() => {
        loadClientServiceRequests();
        loadServiceInfos();
        loadClientVehicles(); // Load vehicles when component mounts
        setUsername(localStorage.getItem("username") || "Guest");
    }, []);

    // Fetch feedbacks for all services after service infos are loaded
    useEffect(() => {
        if (serviceInfos.length > 0) {
            serviceInfos.forEach((service) => {
                loadFeedbacksForService(service.serviceInfoId);
            });
        }
    }, [serviceInfos]);


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

    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [isFeedbackListModalOpen, setFeedbackListModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const openFeedbackModal = (service) => {
        setSelectedService(service);
        setFeedbackModalOpen(true);
    };

    const openFeedbackListModal = (service) => {
        setSelectedService(service);
        setFeedbackListModalOpen(true);
    };

    const closeModals = () => {
        setFeedbackModalOpen(false);
        setFeedbackListModalOpen(false);
        setSelectedService(null);
    };

    return (
        <div className="service-req-dashboard">
            <div className="service-info-container">
            <h1 className="service-info-title">Available Services</h1>

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
                                <p className="pN">Name: <span>{service.provider.name}</span></p>
                            </div>
                            {/* Add to Favorites Button */}
                            <button
    onClick={() => addToFavorites(service.serviceInfoId)}
    className="add-favorite-btn"
    disabled={favoriteServices.some(favService => favService.serviceInfoId === service.serviceInfoId)} // Disable if already in favorites
>
    {favoriteServices.some(favService => favService.serviceInfoId === service.serviceInfoId) ? 'Already in Favorites' : 'Add to Favorite'}
</button>

                            {/* Buttons to open modals */}
                            <button onClick={() => openFeedbackModal(service)} className="modal-btnPR">
                                Provide Feedback
                            </button>
                            <button onClick={() => openFeedbackListModal(service)} className="modal-btnVI">
                                View Feedback
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Feedback Modal */}
            {isFeedbackModalOpen && (
                <div className="modalFeed">
                    <div className="modal-contentFEed">
                        <h2 className='NProviderFeed'>Provide Feedback for {selectedService?.name}</h2>
                        <div>
                            <label className='LaCOmment'>Rating (1 to 5):</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                className="ratinginputTT"
                            />
                        </div>
                        <div>
                            <label className='LaCOmment'>Comment:</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="commentinputTT"
                            />
                        </div>
                        <button
                            onClick={() => {
                                handleFeedbackSubmit(selectedService.serviceInfoId);
                                closeModals();
                            }}
                            className="feedback-btnFeed"
                        >
                            Submit Feedback
                        </button>
                        <button onClick={closeModals} className="modalclose-btnClOs">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Feedback List Modal */}
            {isFeedbackListModalOpen && (
    <div className="modalFeAd">
        <div className="modalcontentENnt">
            <h2>Feedback for {selectedService?.name}</h2>
            {feedbacks[selectedService.serviceInfoId] && feedbacks[selectedService.serviceInfoId].length > 0 ? (
                <div className="feedback-list">
                    <ul>
                        {feedbacks[selectedService.serviceInfoId].map((feedback) => (
                            <li key={feedback.feedbackId}>
                                {feedback.comments} (Rating: {feedback.rating})
                            </li>
                        ))}
                    </ul>
                    <div className="scroll-indicator"></div> {/* مؤشر الصعود والنزول */}
                </div>
            ) : (
                <p>No feedback available.</p>
            )}
            <button onClick={closeModals} className="modalclose-btnClos">
                Close
            </button>
        </div>
    </div>
)}

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
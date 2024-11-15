import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ServiceInfo.css';
import SendNotifications from '../SendNotifications/SendNotifications'

const ServiceInfo = () => {
    const [serviceData, setServiceData] = useState({
        name: '',
        description: '',
        contact: '',
        type: '',
        id: null,
    });

    const [serviceList, setServiceList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serviceRequestDetails, setServiceRequestDetails] = useState(null); // For viewing specific requests
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false); // For modal visibility
    const [status, setStatus] = useState(''); // To update request status
    const [selectedClientId, setSelectedClientId] = useState(null); 
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false); 
    

    const apiRequest = async (method, url, data = null) => {
        const options = {
            method,
            url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            data,
        };

        try {
            const response = await axios(options);
            return response.data;
        } catch (error) {
            console.error('Error with API request:', error);
            toast.error(error.response?.data?.message || "Server error");
            throw error;
        }
    };

    const fetchServiceInfos = async () => {
        try {
            const services = await apiRequest('GET', 'https://localhost:7080/api/Servicer/serviceinfo');
            setServiceList(services.$values || []);
        } catch (error) { }
    };

    const fetchServiceRequestById = async (serviceInfoId) => {
        try {
            const response = await apiRequest('GET', `https://localhost:7080/api/Servicer/servicerequests/serviceinfo/${serviceInfoId}`);
            const serviceRequests = response.$values || [];

            if (serviceRequests.length > 0) {
                setServiceRequestDetails(serviceRequests); // Store all service requests
                setIsRequestModalOpen(true); // Open modal with request details
            } else {
                toast.info("No service requests found for this service info ID.");
            }
        } catch (error) {
            console.error('Error fetching service requests:', error);
        }
    };


    const updateServiceRequestStatus = async (requestId, status) => {
        try {
            const response = await axios.put(`https://localhost:7080/api/Servicer/servicerequest/${requestId}/status`, status, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Service request status updated successfully:', response.data);
        } catch (error) {
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Status code:', error.response.status);
            } else {
                console.error('Error with API request:', error.message);
            }
        }
    };




    const deleteServiceRequest = async (id) => {
        try {
            await apiRequest('DELETE', `https://localhost:7080/api/Servicer/servicerequest/${id}`);
            toast.success("Service request deleted successfully");
            fetchServiceInfos(); // Refresh list
        } catch (error) { }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData({ ...serviceData, [name]: value });
    };

    const resetForm = () => {
        setServiceData({
            name: '',
            description: '',
            contact: '',
            type: '',
            id: null,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const serviceInfoDto = {
                Name: serviceData.name,
                Description: serviceData.description,
                Contact: serviceData.contact,
                Type: serviceData.type,
            };

            if (serviceData.id) {
                await apiRequest('PUT', `https://localhost:7080/api/Servicer/serviceinfo/${serviceData.id}`, serviceInfoDto);
                toast.success("Service Info updated successfully");
            } else {
                await apiRequest('POST', 'https://localhost:7080/api/Servicer/serviceinfo', serviceInfoDto);
                toast.success("Service Info created successfully");
            }
            resetForm();
            fetchServiceInfos();
            setIsModalOpen(false);
        } catch (error) { }
    };

    const handleEdit = (service) => {
        setServiceData({
            name: service.name,
            description: service.description,
            contact: service.contact,
            type: service.type,
            id: service.serviceInfoId,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        await deleteServiceRequest(id);
    };

    const handleNotificationClick = (clientId) => {
        setSelectedClientId(clientId); // Set the client ID for notification
        setIsNotificationModalOpen(true); // Open the notification modal
    };

    useEffect(() => {
        fetchServiceInfos();
    }, []);


    return (
        <div className="Collers">
        <div className="service-info-containerrrrr">
    <h2 className="form-title">Service Info Management</h2>
    <button className="service-info-action-button" onClick={() => { resetForm(); setIsModalOpen(true); }}>
        Create Service Info
    </button>
    <br>
    </br>
    <h3 className="serviceHED">Service List</h3>
    <ul className="service-info-list">
  {serviceList.map((service) => (
    <li className="service-info-list-itemmmm" key={service.serviceInfoId}>
      <div className="service-info">
        <strong className="service-name">{service.name}</strong>
        <p className="service-description">{service.description}</p>
      </div>
      <div className="button-group">
        <button
          className="button edit-button"
          onClick={() => handleEdit(service)}
        >
          Edit
        </button>
        <button
          className="button delete-button"
          onClick={() => handleDelete(service.serviceInfoId)}
        >
          Delete
        </button>
        <button
          className="button details-button"
          onClick={() => fetchServiceRequestById(service.serviceInfoId)}
        >
          View Request
        </button>
      </div>
    </li>
  ))}
</ul>


    {/* Modal for sending notifications */}
    {isNotificationModalOpen && selectedClientId && (
        <div className="modal-overlayyyy">
            <div className="notification-modal">
                <button className="modal-close-button" onClick={() => setIsNotificationModalOpen(false)}>&times;</button>
                <SendNotifications
                    clientId={selectedClientId}
                    closeModal={() => setIsNotificationModalOpen(false)}
                />
            </div>
        </div>
    )}

    {isModalOpen && (
        <div className="service-info-modal">
            <div className="service-info-modal-content">
                <span className="modal-close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
                <h2 className='CSI'>{serviceData.id ? 'Update' : 'Create'} Service Info</h2>
                <form onSubmit={handleSubmit}>
                    <div><label>Name:</label><input type="text" name="name" value={serviceData.name} onChange={handleChange} required /></div>
                    <div><label>Description:</label><textarea name="description" value={serviceData.description} onChange={handleChange} required /></div>
                    <div><label>Contact:</label><input type="text" name="contact" value={serviceData.contact} onChange={handleChange} required /></div>
                    <div><label>Type:</label><input type="text" name="type" value={serviceData.type} onChange={handleChange} required /></div>
                    <button className="service-info-action-button" type="submit">{serviceData.id ? 'Update' : 'Create'} Service Info</button>
                </form>
            </div>
        </div>
    )}

    {isRequestModalOpen && serviceRequestDetails.length > 0 && (
        <div className="service-info-modal">
            <div className="service-info-modal-content">
                <span className="modal-close-button" onClick={() => setIsRequestModalOpen(false)}>&times;</span>
                <h2>Service Request Details</h2>
                {serviceRequestDetails.map((request) => (
                    <div key={request.serviceRequestId}>
                        <div><strong>ID:</strong> {request.serviceRequestId}</div>
                        <div><strong>Status:</strong> {request.status}</div>
                        <div><strong>Client Name:</strong> {request.client?.name}</div>
                        <div><strong>Client Email:</strong> {request.client?.email}</div>
                        <div><strong>Provider Name:</strong> {request.provider?.name}</div>
                        <div><strong>Vehicle License Plate:</strong> {request.vehicle?.licensePlate}</div>
                        <div><strong>Vehicle Model:</strong> {request.vehicle?.model}</div>
                        <div><label>Update Status:</label>
                            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
                            <button onClick={() => updateServiceRequestStatus(request.serviceRequestId, status)}>Update</button>
                        </div>
                        <hr />
                        <button
                            className="service-info-action-button service-info-notification-button"
                            onClick={() => handleNotificationClick(request.client?.clientId)}>
                            Send Notification
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )}
</div>
</div>
    );
};

export default ServiceInfo;
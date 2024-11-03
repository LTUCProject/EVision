import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ServiceInfo.css'; // Assuming you'll create a CSS file for styling

const ServiceInfo = () => {
    const [serviceData, setServiceData] = useState({
        name: '',
        description: '',
        contact: '',
        type: '',
        id: null, // Track the ID for updates
    });

    const [serviceList, setServiceList] = useState([]); // To hold the list of services
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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
            return response.data; // Return data for further use if necessary
        } catch (error) {
            console.error('Error with API request:', error);
            toast.error(error.response?.data?.message || "Server error");
            throw error; // Rethrow the error for further handling if needed
        }
    };

    const fetchServiceInfos = async () => {
        try {
            const services = await apiRequest('GET', 'https://localhost:7080/api/Servicer/serviceinfo');
            setServiceList(services.$values || []); // Extract the array from the response
        } catch (error) {
            // Handle error
        }
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
                // Update existing service
                await apiRequest('PUT', `https://localhost:7080/api/Servicer/serviceinfo/${serviceData.id}`, serviceInfoDto);
                toast.success("Service Info updated successfully");
            } else {
                // Create new service
                await apiRequest('POST', 'https://localhost:7080/api/Servicer/serviceinfo', serviceInfoDto);
                toast.success("Service Info created successfully");
            }
            resetForm();
            fetchServiceInfos(); // Refresh the list after submit
            setIsModalOpen(false); // Close modal after submit
        } catch (error) {
            // Error handling is done in apiRequest
        }
    };

    const handleEdit = (service) => {
        setServiceData({
            name: service.name,
            description: service.description,
            contact: service.contact,
            type: service.type,
            id: service.serviceInfoId, // Set the ID for updates
        });
        setIsModalOpen(true); // Open modal for editing
    };

    const handleDelete = async (id) => {
        try {
            await apiRequest('DELETE', `https://localhost:7080/api/Servicer/serviceinfo/${id}`);
            toast.success("Service Info deleted successfully");
            fetchServiceInfos(); // Refresh the list after deletion
        } catch (error) {
            // Handle error
        }
    };

    useEffect(() => {
        fetchServiceInfos(); // Fetch services when the component mounts
    }, []);

    return (
        <div className="service-info-container">
            <h2 className="service-info-title">Service Info Management</h2>
            <button className="service-info-button" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                Create Service Info
            </button>
            <h3 className="service-info-title">Service List</h3>
            <ul className="service-info-list">
                {serviceList.map(service => (
                    <li className="service-info-list-item" key={service.serviceInfoId}>
                        <div>
                            <strong>{service.name}</strong> - {service.description}
                        </div>
                        <div>
                            <button className={`service-info-button edit-button`} onClick={() => handleEdit(service)}>Edit</button>
                            <button className={`service-info-button delete-button`} onClick={() => handleDelete(service.serviceInfoId)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
    
            {/* Modal */}
            {isModalOpen && (
                <div className="service-info-modal">
                    <div className="service-info-modal-content">
                        <span className="service-info-close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>{serviceData.id ? 'Update' : 'Create'} Service Info</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={serviceData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={serviceData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Contact:</label>
                                <input
                                    type="text"
                                    name="contact"
                                    value={serviceData.contact}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Type:</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={serviceData.type}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button className="service-info-button" type="submit">
                                {serviceData.id ? 'Update' : 'Create'} Service Info
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
      
};

export default ServiceInfo;

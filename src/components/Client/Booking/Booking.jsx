import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Booking.css';

// Utility for authenticated API requests
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
        console.error('API request error:', error);
        toast.error(error.response?.data?.message || "Server error");
        throw error;
    }
};

// Define bounds for Jordan
const jordanBounds = [
    [29.1852, 34.9596],
    [33.3742, 39.3012]
];

// Main Booking Component
const Booking = () => {
    const [vehicles, setVehicles] = useState([]);
    const [chargingStations, setChargingStations] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // Fetch vehicles and charging stations on mount
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('https://localhost:7080/api/Clients/vehicle', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                });
                setVehicles(response.data.$values || []);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                toast.error('Failed to load vehicles.');
            }
        };

        const fetchChargingStations = async () => {
            try {
                const data = await apiRequest('GET', 'https://localhost:7080/api/Clients/ChargingStations');
                setChargingStations(data.$values);
            } catch (error) {
                console.error('Failed to fetch charging stations:', error);
            }
        };

        fetchVehicles();
        fetchChargingStations();
    }, []);

    // Handle form submission to create a booking
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedVehicle || !selectedStation || !startTime || !endTime) {
            toast.error("Please fill in all fields.");
            return;
        }

        const bookingData = {
            vehicleId: selectedVehicle,
            chargingStationId: selectedStation.chargingStationId,
            startTime,
            endTime,
            status: "Pending",
            cost: 0
        };

        try {
            await apiRequest('POST', 'https://localhost:7080/api/Clients/bookings', bookingData);
            toast.success("Booking created successfully.");

            // Clear fields after successful booking
            setSelectedVehicle(null);
            setSelectedStation(null);
            setStartTime('');
            setEndTime('');
        } catch (error) {
            console.error('Failed to create booking:', error);
        }
    };

    return (
        <div className="backGR">
            <div className="reservation-form">
                <h2 className="form-title">Book a Charging Station</h2>
                
                {/* Vehicle Selection */}
                <label className="label-field">
                    Select Vehicle:
                    <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)} className="dropdown-input">
                        <option value="">Select a vehicle</option>
                        {vehicles.map((vehicle) => (
                            <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                {vehicle.make} {vehicle.model}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Date and Time Selection */}
                <div className="schedule-selection">
                    <label className="label-field">
                        Start Time:
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="date-time-picker"
                        />
                    </label>

                    <label className="label-field">
                        End Time:
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="date-time-picker"
                        />
                    </label>
                </div>

                {/* Map for Charging Station Selection */}
                <MapContainer
                    center={[31.5, 36.0]}
                    zoom={8}
                    style={{ height: '500px', width: '100%' }}
                    bounds={jordanBounds}
                    className="map-view"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {chargingStations.map((station) => (
                        <Marker
                            key={station.chargingStationId}
                            position={[station.latitude, station.longitude]}
                            eventHandlers={{
                                click: () => setSelectedStation(station)
                            }}
                        >
                            <Popup>
                                <strong>{station.name}</strong><br />
                                {station.address}<br />
                                Status: {station.status}<br />
                                Payment Method: {station.paymentMethod}<br />
                                Provider: {station.provider.name} ({station.provider.email})
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {selectedStation && (
                    <p className="chosen-station-text">Selected Charging Station: {selectedStation.name}</p>
                )}

                {/* Submit Button */}
                <button onClick={handleSubmit} className="submit-button">Create Booking</button>
            </div>

            {/* Toast Container */}
            <ToastContainer 
                position="top-center" 
                autoClose={3000} 
                hideProgressBar={false} 
                closeOnClick 
                draggable 
                pauseOnHover 
                style={{ fontSize: '20px', maxWidth: '500px' }} // Centered and larger font
            />
        </div>
    );
};

export default Booking;
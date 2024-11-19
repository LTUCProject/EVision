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
        // toast.error(error.response?.data?.message || "Server error");
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
    const [clientBookings, setClientBookings] = useState([]);  // State for storing bookings

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

        // Fetch client bookings
        const fetchClientBookings = async () => {
            try {
                const data = await apiRequest('GET', 'https://localhost:7080/api/Clients/bookings');
                setClientBookings(data.$values);  // Set the fetched bookings in state
            } catch (error) {
                // console.error('Error fetching bookings:', error);
                // toast.error('You dont have any Booking.');
            }
        };

        fetchVehicles();
        fetchChargingStations();
        fetchClientBookings();  // Fetch bookings on mount
    }, []);

    

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
            // Send the POST request to create the booking
            const response = await apiRequest('POST', 'https://localhost:7080/api/Clients/bookings', bookingData);

            // Assuming the API returns the full booking object with bookingId
            toast.success("Booking created successfully.");

            // Add the new booking to the clientBookings state with the bookingId from the response
            setClientBookings((prevBookings) => [...prevBookings, response]);

            // Clear fields after successful booking
            setSelectedVehicle(null);
            setSelectedStation(null);
            setStartTime('');
            setEndTime('');
        } catch (error) {
            console.error('Failed to create booking:', error);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        try {
            await apiRequest('DELETE', `https://localhost:7080/api/Clients/bookings/${bookingId}`);
            toast.success("Booking deleted successfully.");

            // Update the clientBookings state by removing the deleted booking
            setClientBookings((prevBookings) => prevBookings.filter((booking) => booking.bookingId !== bookingId));
        } catch (error) {
            console.error('Failed to delete booking:', error);
            toast.error('Failed to delete booking.');
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


            <div className="client-bookings">
                <h3>Your Bookings</h3>
                {clientBookings && clientBookings.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    <ul>
                        {clientBookings.map((booking) => (
                            <li key={booking.bookingId}>
                                <div>
                                    <p><strong>Start Time:</strong> {new Date(booking.startTime).toLocaleString()}</p>
                                    <p><strong>End Time:</strong> {new Date(booking.endTime).toLocaleString()}</p>
                                    <p><strong>Status:</strong> {booking.status}</p>
                                    <p><strong>Cost:</strong> ${booking.cost}</p>
                                </div>
                                <button onClick={() => handleDeleteBooking(booking.bookingId)} className="delete-button">Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>


        </div>
    );
};

export default Booking;

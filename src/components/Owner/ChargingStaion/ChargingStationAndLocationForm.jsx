import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './ChargingStationAndLocationForm.css';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';


const jordanBounds = [
    [29.1852, 34.9596],
    [33.3742, 39.3012]
];

const LocationClicker = ({ onLocationSelect }) => {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(event) {
            const { lat, lng } = event.latlng;
            setPosition({ lat, lng });
            onLocationSelect(lat, lng);
        },
    });

    return position ? <Marker position={position} /> : null;
};

const ChargingStationAndLocationForm = () => {
    const [chargerData, setChargerData] = useState({
        stationLocation: '',
        name: '',
        hasParking: true,
        status: '',
        paymentMethod: '',
        address: '',
        latitude: '',
        longitude: ''
    });

    const [chargerInfo, setChargerInfo] = useState({
        type: '',
        power: '',
        speed: '',
        chargingStationId: ''
    });

    const [mapCenter, setMapCenter] = useState([31.5, 36.0]);
    const [chargingStations, setChargingStations] = useState([]);
    const [selectedStationId, setSelectedStationId] = useState(null);


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapCenter([latitude, longitude]);
                    setChargerData((prevData) => ({
                        ...prevData,
                        latitude,
                        longitude,
                    }));
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast.error("Could not get current location.");
                }
            );
        }

        // Load all charging stations
        loadChargingStations();
    }, []);

    const loadChargingStations = async () => {
        try {
            const response = await axios.get('https://localhost:7080/api/Owner/chargingstations', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setChargingStations(response.data);
        } catch (error) {
            console.error('Error fetching charging stations:', error);
            toast.error("Failed to load charging stations.");
        }
    };

    const handleChargerChange = (e) => {
        const { name, value } = e.target;
        setChargerData({ ...chargerData, [name]: value });
    };

    const handleChargerInfoChange = (e) => {
        const { name, value } = e.target;
        setChargerInfo({ ...chargerInfo, [name]: value });
    };

    const handleParkingChange = (e) => {
        setChargerData({ ...chargerData, hasParking: e.target.checked });
    };

    const handleLocationSelect = (lat, lng) => {
        setChargerData({ ...chargerData, latitude: lat, longitude: lng });
    };

    const resetForm = () => {
        setChargerData({
            stationLocation: '',
            name: '',
            hasParking: true,
            status: '',
            paymentMethod: '',
            address: '',
            latitude: '',
            longitude: ''
        });
        setChargerInfo({
            type: '',
            power: '',
            speed: '',
            chargingStationId: ''
        });
        setSelectedStationId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const stationRequest = {
                StationLocation: chargerData.stationLocation,
                Name: chargerData.name,
                HasParking: chargerData.hasParking,
                Status: chargerData.status,
                PaymentMethod: chargerData.paymentMethod,
                Address: chargerData.address,
                Latitude: parseFloat(chargerData.latitude),
                Longitude: parseFloat(chargerData.longitude),
            };

            await axios.post('https://localhost:7080/api/Owner/chargingstations', stationRequest, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            toast.success("Charging Station created successfully");
            resetForm();
            loadChargingStations();
        } catch (error) {
            console.error('Error creating charging station:', error);
            toast.error("Failed to create Charging Station: " + (error.response?.data?.message || "Server error"));
        }
    };

    const handleChargerSubmit = async (e) => {
        e.preventDefault();
        try {
            const chargerRequest = {
                Type: chargerInfo.type,
                Power: chargerInfo.power,
                Speed: chargerInfo.speed,
                ChargingStationId: selectedStationId
            };

            await axios.post('https://localhost:7080/api/Owner/chargers', chargerRequest, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            toast.success("Charger created successfully");
            resetForm();
        } catch (error) {
            console.error('Error creating charger:', error);
            toast.error("Failed to create Charger: " + (error.response?.data?.message || "Server error"));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const stationRequest = {
                StationLocation: chargerData.stationLocation,
                Name: chargerData.name,
                HasParking: chargerData.hasParking,
                Status: chargerData.status,
                PaymentMethod: chargerData.paymentMethod,
                Address: chargerData.address,
                Latitude: parseFloat(chargerData.latitude),
                Longitude: parseFloat(chargerData.longitude),
            };

            await axios.put(`https://localhost:7080/api/Owner/chargingstations/${selectedStationId}`, stationRequest, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            toast.success("Charging Station updated successfully");
            resetForm();
            loadChargingStations();
        } catch (error) {
            console.error('Error updating charging station:', error);
            toast.error("Failed to update Charging Station: " + (error.response?.data?.message || "Server error"));
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7080/api/Owner/chargingstations/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            toast.success("Charging Station deleted successfully");
            loadChargingStations();
        } catch (error) {
            console.error('Error deleting charging station:', error);
            toast.error("Failed to delete Charging Station: " + (error.response?.data?.message || "Server error"));
        }
    };

    const handleDeleteCharger = async (chargerId) => {
        try {
            await axios.delete(`https://localhost:7080/api/Owner/chargers/${chargerId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            toast.success("Charger deleted successfully");
            loadChargingStations();
        } catch (error) {
            console.error('Error deleting charger:', error);
            toast.error("Failed to delete Charger: " + (error.response?.data?.message || "Server error"));
        }
    };


    return (
        <div className="charging-station-form-container">
            <form className="charging-station-form" onSubmit={selectedStationId ? handleUpdate : handleSubmit}>
                <h2 className="form-title">{selectedStationId ? 'Update Charging Station' : 'Create Charging Station'}</h2>
                <label className="form-label">
                    Station Location:
                    <input
                        type="text"
                        name="stationLocation"
                        className="form-input"
                        placeholder="Station Location"
                        value={chargerData.stationLocation}
                        onChange={handleChargerChange}
                        required
                    />
                </label>
                <label className="form-label">
                    Charging Station Name:
                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Charging Station Name"
                        value={chargerData.name}
                        onChange={handleChargerChange}
                        required
                    />
                </label>
                <label className="form-label">
                    Station Status:
                    <input
                        type="text"
                        name="status"
                        className="form-input"
                        placeholder="Station Status"
                        value={chargerData.status}
                        onChange={handleChargerChange}
                        required
                    />
                </label>
                <label className="form-label">
                    Payment Method:
                    <input
                        type="text"
                        name="paymentMethod"
                        className="form-input"
                        placeholder="Payment Method"
                        value={chargerData.paymentMethod}
                        onChange={handleChargerChange}
                        required
                    />
                </label>
                <label className="form-label">
                    Address:
                    <input
                        type="text"
                        name="address"
                        className="form-input"
                        placeholder="Address"
                        value={chargerData.address}
                        onChange={handleChargerChange}
                        required
                    />
                </label>
                <label className="form-label">
                    Latitude:
                    <input
                        type="number"
                        name="latitude"
                        className="form-input"
                        placeholder="Latitude"
                        value={chargerData.latitude}
                        onChange={handleChargerChange}
                        required
                        readOnly
                    />
                </label>
                <label className="form-label">
                    Longitude:
                    <input
                        type="number"
                        name="longitude"
                        className="form-input"
                        placeholder="Longitude"
                        value={chargerData.longitude}
                        onChange={handleChargerChange}
                        required
                        readOnly
                    />
                </label>

                <label className="form-label parking-checkbox">
                    <input
                        type="checkbox"
                        checked={chargerData.hasParking}
                        onChange={handleParkingChange}
                    />
                    Has Parking
                </label>

                <Button type="submit" variant="primary" className="form-submit-button">
                    {selectedStationId ? 'Update Charging Station' : 'Create Charging Station'}
                </Button>
            </form>

            {/* Charger Form - This will only show if there are charging stations */}
            {chargingStations.length > 0 && (
                <form className="charger-form" onSubmit={handleChargerSubmit}>
                    <h2>Create Charger</h2>
                    <label className="form-label">
                        Charger Type:
                        <input
                            type="text"
                            name="type"
                            className="form-input"
                            placeholder="Charger Type"
                            value={chargerInfo.type}
                            onChange={handleChargerInfoChange}
                            required
                        />
                    </label>
                    <label className="form-label">
                        Power:
                        <input
                            type="text"
                            name="power"
                            className="form-input"
                            placeholder="Power (kW)"
                            value={chargerInfo.power}
                            onChange={handleChargerInfoChange}
                            required
                        />
                    </label>
                    <label className="form-label">
                        Speed:
                        <input
                            type="text"
                            name="speed"
                            className="form-input"
                            placeholder="Charging Speed"
                            value={chargerInfo.speed}
                            onChange={handleChargerInfoChange}
                            required
                        />
                    </label>
                    <label className="form-label">
                        Charging Station:
                        <select
                            value={selectedStationId}
                            onChange={(e) => setSelectedStationId(e.target.value)}
                            className="form-input"
                            required
                        >
                            <option value="">Select a Charging Station</option>
                            {chargingStations.map((station) => (
                                <option key={station.chargingStationId} value={station.chargingStationId}>
                                    {station.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Button type="submit" className="form-button">Create Charger</Button>
                </form>
            )}

            <div className="charging-station-form-container">
                <div className="charging-stations-list">
                    <h3 className="list-title">Charging Stations</h3>
                    <ul className="station-list">
                        {chargingStations.map((station) => (
                            <li key={station.chargingStationId} className="station-item">
                                <div className="station-details">
                                    <h4 className="station-name">{station.name}</h4>
                                    <p className="station-info">Location: {station.stationLocation}</p>
                                    <p className="station-info">Status: {station.status}</p>
                                    <p className="station-info">Parking Available: {station.hasParking ? 'Yes' : 'No'}</p>
                                    <p className="station-info">Payment Method: {station.paymentMethod}</p>
                                    <p className="station-info">Address: {station.address}</p>
                                </div>
                                <div className="charger-details">
                                    <h5 className="charger-title">Chargers:</h5>
                                    <ul className="charger-list">
                                        {station.chargers.map((charger) => (
                                            <li key={charger.chargerId} className="charger-item">
                                                <p className="charger-info">Type: {charger.type}</p>
                                                <p className="charger-info">Power: {charger.power} kW</p>
                                                <p className="charger-info">Speed: {charger.speed} kW/h</p>
                                                {/* Charger actions with specific ID */}
                                                <div className="charger-actions">
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteCharger(charger.chargerId)}  // Pass specific charger ID for deletion
                                                    >
                                                        Delete Charger
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Station actions */}
                                <div className="station-actions">
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setChargerData({
                                                stationLocation: station.stationLocation,
                                                name: station.name,
                                                hasParking: station.hasParking,
                                                status: station.status,
                                                paymentMethod: station.paymentMethod,
                                                address: station.address
                                            });
                                            setSelectedStationId(station.chargingStationId);  // Store the ID of the station being edited
                                        }}
                                    >
                                        Edit Station
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(station.chargingStationId)}  // Pass specific station ID for deletion
                                    >
                                        Delete Station
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <MapContainer center={mapCenter} zoom={8} style={{ height: '400px', width: '100%' }} bounds={jordanBounds}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationClicker onLocationSelect={handleLocationSelect} />
            </MapContainer>
        </div>
    );

};

export default ChargingStationAndLocationForm;
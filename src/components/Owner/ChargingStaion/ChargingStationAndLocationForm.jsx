import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './ChargingStationAndLocationForm.css';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import MaintenanceLog from '../MaintenanceLog/MaintenanceLog';
import Booking from '../Booking/Booking';
import { Modal } from 'react-bootstrap';


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
    const [selectedMaintenanceStationId, setSelectedMaintenanceStationId] = useState(null);
    const [selectedBookingStationId, setSelectedBookingStationId] = useState(null);

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

    const loadChargingStations = async () => {
        try {
            const data = await apiRequest('GET', 'https://localhost:7080/api/Owner/chargingstations');
            setChargingStations(data.$values);
        } catch (error) {
            console.error('Error fetching charging stations:', error);
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

            await apiRequest('POST', 'https://localhost:7080/api/Owner/chargingstations', stationRequest);
            toast.success("Charging Station created successfully");
            resetForm();
            loadChargingStations();
        } catch (error) {
            // Error handling is done in apiRequest
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

            await apiRequest('POST', 'https://localhost:7080/api/Owner/chargers', chargerRequest);
            toast.success("Charger created successfully");
            resetForm();
        } catch (error) {
            // Error handling is done in apiRequest
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

            await apiRequest('PUT', `https://localhost:7080/api/Owner/chargingstations/${selectedStationId}`, stationRequest);
            toast.success("Charging Station updated successfully");
            resetForm();
            loadChargingStations();
        } catch (error) {
            // Error handling is done in apiRequest
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiRequest('DELETE', `https://localhost:7080/api/Owner/chargingstations/${id}`);
            toast.success("Charging Station deleted successfully");
            loadChargingStations();
        } catch (error) {
            // Error handling is done in apiRequest
        }
    };

    const handleDeleteCharger = async (chargerId) => {
        try {
            await apiRequest('DELETE', `https://localhost:7080/api/Owner/chargers/${chargerId}`);
            toast.success("Charger deleted successfully");
            loadChargingStations();
        } catch (error) {
            // Error handling is done in apiRequest
        }
    };

    const handleStationSelect = (id) => {
        setSelectedStationId(id);
    };
    const [selectedStation, setSelectedStation] = useState(null); // الحالة للتحكم في عرض تفاصيل المحطة
 const handleStationClick = (station) => {
    setSelectedStation(station); // تعيين المحطة المحددة لعرض تفاصيلها
  };

    return (
        <div className="Collers">
    <div className="Abed" style={{  width: '80%' }}> 
    <div className='aya' >
                <h2 className="form-title">{selectedStationId ? 'Charging Station Management' : 'Charging Station Management'}</h2>
                </div>
        {/* Flex container for form and map */}
        <div className="form-map-container">
            {/* Main Form for Creating/Updating Charging Station */}
            <form className="charging-station-form" onSubmit={selectedStationId ? handleUpdate : handleSubmit}>
                
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
                    <select
                        name="status"
                        className="form-input"
                        value={chargerData.status}
                        onChange={handleChargerChange}
                        required
                    >
                        <option value="" disabled>Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                    </select>
                </label>

                <label className="form-label">
                    Payment Method:
                    <select
                        name="paymentMethod"
                        className="form-input"
                        value={chargerData.paymentMethod}
                        onChange={handleChargerChange}
                        required
                    >
                        <option value="" disabled>Select Payment Method</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit Card & Cash">Credit Card & Cash</option>
                    </select>
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

                <Button type="submit" variant="primary" className="form-submit-button"  style={{ backgroundColor: '#007bff' }}>
                    {selectedStationId ? 'Update Charging Station' : 'Create Charging Station'}
                </Button>
            </form>

            {/* Map Container */}
            <MapContainer center={mapCenter} zoom={8} style={{ height: '700px', width: '600px',marginTop: '40px' }} bounds={jordanBounds}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationClicker onLocationSelect={handleLocationSelect} />
            </MapContainer>
        </div>

            {/* Charger Form - This will only show if there are charging stations */}
            {chargingStations.length > 0 && (
                <form className="charger-form" onSubmit={handleChargerSubmit}>
                    <h2>Create Charger</h2>
                    <label className="form-label">
                        Charger Type:
                        <select
                            name="type"
                            className="form-input"
                            value={chargerInfo.type}
                            onChange={handleChargerInfoChange}
                            required
                        >
                            <option value="" disabled>Select Charger Type</option>
                            <option value="Type 1">Type 1</option>
                            <option value="Type 2">Type 2</option>
                            <option value="CCS">CCS</option>
                            <option value="CHAdeMO">CHAdeMO</option>
                        </select>
                    </label>

                    <label className="form-label">
                        Power:
                        <select
                            name="power"
                            className="form-input"
                            value={chargerInfo.power}
                            onChange={handleChargerInfoChange}
                            required
                        >
                            <option value="" disabled>Select Power Output (kW)</option>
                            <option value="7">7 kW</option>
                            <option value="22">22 kW</option>
                            <option value="50">50 kW</option>
                            <option value="150">150 kW</option>
                        </select>
                    </label>

                    <label className="form-label">
                        Speed:
                        <select
                            name="speed"
                            className="form-input"
                            value={chargerInfo.speed}
                            onChange={handleChargerInfoChange}
                            required
                        >
                            <option value="" disabled>Select Charging Speed</option>
                            <option value="Standard">Standard</option>
                            <option value="Fast">Fast</option>
                            <option value="Ultra-fast">Ultra-fast</option>
                        </select>
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
                    <Button type="submit" className="bt-for" style={{ backgroundColor: '#007bff' }}>Create Charger</Button>
                    </form>
            )}

<div className="charging-station-form-container">
  <div className="charging-stations-list">
    <h3 className="list-title">Charging Stations</h3>
    <ul className="station-list">
      {chargingStations.map((station) => (
        <li key={station.chargingStationId} className="station-item">
          <div className="station-details">
            <h4
              className="station-name"
              onClick={() => handleStationClick(station)} // عند النقر على اسم المحطة
            >
              {station.name}
            </h4>
          </div>
        </li>
      ))}
    </ul>
  </div>

  {/* النافذة المنبثقة لعرض تفاصيل المحطة المحددة */}
  {selectedStation && (
    <div className="modal-overlay" onClick={() => setSelectedStation(null)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-close" onClick={() => setSelectedStation(null)}>&times;</span>
          <h2> {selectedStation.name}</h2>
        </div>
        <div className="modal-body">
          <p className="station-info">Location: {selectedStation.stationLocation}</p>
          <p className="station-info">Status: {selectedStation.status}</p>
          <p className="station-info">Parking Available: {selectedStation.hasParking ? 'Yes' : 'No'}</p>
          <p className="station-info">Payment Method: {selectedStation.paymentMethod}</p>
          <p className="station-info">Address: {selectedStation.address}</p>

          <div className="charger-details">
            <h5 className="charger-title">Chargers:</h5>
            <ul className="charger-list">
              {selectedStation.chargers.$values.map((charger) => (
                <li key={charger.chargerId} className="charger-item">
                  <p className="charger-info">Type: {charger.type}</p>
                  <p className="charger-info">Power: {charger.power} kW</p>
                  <p className="charger-info">Speed: {charger.speed} kW/h</p>
                  <div className="charger-actions">
                    <button
                      className="delete-charger-btn"
                      onClick={() => handleDeleteCharger(charger.chargerId)} // Pass specific charger ID for deletion
                    >
                      Delete Charger
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="edit-station-btn"
            onClick={() => {
              setChargerData({
                stationLocation: selectedStation.stationLocation,
                name: selectedStation.name,
                hasParking: selectedStation.hasParking,
                status: selectedStation.status,
                paymentMethod: selectedStation.paymentMethod,
                address: selectedStation.address
              });
              setSelectedStationId(selectedStation.chargingStationId); // Store the ID of the station being edited
            }}
          >
            Edit Station
          </button>
          <button
            className="delete-station-btn"
            onClick={() => handleDelete(selectedStation.chargingStationId)} // Pass specific station ID for deletion
          >
            Delete Station
          </button>
        </div>
      </div>
    </div>
  )}
</div>


            <div  style={{ justifyContent: 'center', alignItems: 'center'}}>
                {/* Select Station Dropdown for Maintenance Log */}
                <label className="form-label">
                    Station's Maintenance Log:
                    <select
                        onChange={(e) => setSelectedMaintenanceStationId(e.target.value)}
                        value={selectedMaintenanceStationId}
                        className="form-input"
                        required
                    >
                        <option value="">Select a Charging Station</option>
                        {chargingStations.map(station => (
                            <option key={station.chargingStationId} value={station.chargingStationId}>
                                {station.name} - {station.stationLocation}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Show MaintenanceLog if a station is selected */}
                {selectedMaintenanceStationId && <MaintenanceLog stationId={selectedMaintenanceStationId} />}

                {/* Select Station Dropdown for Bookings */}
                <label className="form-label">
                    Station's Bookings:
                    <select
                        onChange={(e) => setSelectedBookingStationId(e.target.value)}
                        value={selectedBookingStationId}
                        className="form-input"
                        required
                    >
                        <option value="">Select a Charging Station</option>
                        {chargingStations.map(station => (
                            <option key={station.chargingStationId} value={station.chargingStationId}>
                                {station.name} - {station.stationLocation}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Booking component rendering */}
                {selectedBookingStationId && <Booking stationId={selectedBookingStationId} />}
            </div>

        </div>
        </div>
    );


};

export default ChargingStationAndLocationForm;
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { toast } from 'react-toastify';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Default icon setup for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// API request utility
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

// Define bounds for Jordan
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

const Location = () => {
  const [chargingStations, setChargingStations] = useState([]);
  const [mapCenter, setMapCenter] = useState([31.5, 36.0]);

  useEffect(() => {
    const fetchChargingStations = async () => {
      try {
        const data = await apiRequest('GET', 'https://localhost:7080/api/Admins/ChargingStations');
        const stations = data.$values; // Extracting the charging stations from the API response
        setChargingStations(stations);
      } catch (error) {
        console.error('Failed to fetch charging stations:', error);
      }
    };

    fetchChargingStations();
  }, []);

  const handleLocationSelect = (lat, lng) => {
    console.log("Selected location:", lat, lng);
  };

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={8} 
      style={{ height: '500px', width: '100%' }}
      bounds={jordanBounds}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {chargingStations.map((station) => (
        <Marker 
          key={station.chargingStationId} 
          position={[station.latitude, station.longitude]}
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
      <LocationClicker onLocationSelect={handleLocationSelect} />
    </MapContainer>
  );
};

export default Location;

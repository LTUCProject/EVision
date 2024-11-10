import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { toast } from 'react-toastify';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Modal from 'react-modal'; // Ensure to install react-modal or use your preferred modal library
import ClientFavorite from '../ClientFavorite/ClientFavorite';
import './Location.css';

// Default icon setup for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom user location icon using a circle
const userLocationIcon = L.divIcon({
  className: 'user-location-marker', // Custom class for styling
  html: `<div style="background-color: #ff0000; border-radius: 50%; width: 20px; height: 20px; border: 2px solid #fff;"></div>`, // Circle shape with white border
  iconSize: [20, 20], // Icon size
  iconAnchor: [10, 10], // Anchor point in the center of the circle
  popupAnchor: [0, -20], // Popup position above the circle
});

const apiRequest = async (method, url, data = null) => {
  const options = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
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
  [33.3742, 39.3012],
];

const Location = () => {
  const [chargingStations, setChargingStations] = useState([]);
  const [mapCenter, setMapCenter] = useState([31.5, 36.0]); // Initial map center (Jordan)
  const [userLocation, setUserLocation] = useState(null); // State to store user location
  const [selectedStation, setSelectedStation] = useState(null); // State to store selected station for "Get Location" click
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [favoriteStationId, setFavoriteStationId] = useState(null); // State to store station ID for modal

  useEffect(() => {
    // Get the user's location with high accuracy
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude }); // Store user location in state
          setMapCenter([latitude, longitude]); // Center the map on the user's location
        },
        (error) => {
          toast.error("Failed to get user location");
          console.error(error);
        },
        {
          enableHighAccuracy: true, // Request higher accuracy
          timeout: 5000, // Set a timeout limit for the location request (5 seconds)
          maximumAge: 0, // Ensure the location is fresh (no cached data)
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  
    const fetchChargingStations = async () => {
      try {
        const data = await apiRequest('GET', 'https://localhost:7080/api/Clients/ChargingStations');
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
    // Set the selected station for "Get Location" button
    setSelectedStation({ lat, lng });
  };

  const handleFavoriteClick = (stationId) => {
    setFavoriteStationId(stationId); // Set the station ID to pass to Favorite
    setModalIsOpen(true); // Open modal
  };

  const handleGetLocationClick = () => {
    if (selectedStation) {
      const googleMapsUrl = `https://www.google.com/maps?q=${selectedStation.lat},${selectedStation.lng}`;
      window.open(googleMapsUrl, "_blank");
    }
  };

  const handleFavoriteClick2 = async (stationId) => {
    try {
      await apiRequest('POST', 'https://localhost:7080/api/Clients/ChargingStationFavorites', {
        ChargingStationId: stationId,
      });
      toast.success("Favorite added");
      //setModalIsOpen(true); // Open modal
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };
  const [isMapVisible, setIsMapVisible] = useState(true);

  const handleViewFavoriteStations = () => {
    setIsMapVisible(false);
    setModalIsOpen(true); 
  };
  const handleCloseModal = () => {
    setIsMapVisible(true);
    setModalIsOpen(false); 
  };
  return (
    <div className="backpage">
      {isMapVisible && (
        <MapContainer
         className="map-container"
          center={mapCenter}
          zoom={8}
          bounds={jordanBounds}
        >
          <TileLayer className="tilelyer"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Render charging station markers */}
          {chargingStations.map((station) => (
            <Marker className="marker2"
              key={station.chargingStationId}
              position={[station.latitude, station.longitude]}
              eventHandlers={{
                click: () => handleLocationSelect(station.latitude, station.longitude),
              }}
            >
              <Popup className="prpupp1">
                <strong>{station.name}</strong><br />
                {station.address}<br />
                Status: {station.status}<br />
                Payment Method: {station.paymentMethod}<br />
                Provider: {station.provider.name} ({station.provider.email})<br />
                <button onClick={handleGetLocationClick}>Get Location</button>
                <button onClick={() => handleFavoriteClick2(station.chargingStationId)}>Add to Favorite</button>
              </Popup>
            </Marker>
          ))}
          {/* Render user's unique location marker */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon} className="marker">
              <Popup className="prpupp2">
                <div>
                  <p>Your current location</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      )}

      <br />
      <button onClick={handleViewFavoriteStations} className="btL">View Favorite Stations</button>

      {/* Modal for Favorite component */}
      <Modal className="modell"
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Favorite Modal"
      >
        <ClientFavorite stationId={favoriteStationId} onClose={handleCloseModal} />
        <button onClick={handleCloseModal} className="close">Close</button>
      </Modal>
    </div>
  );
};

export default Location;
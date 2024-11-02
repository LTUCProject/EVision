import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const LocationSelector = () => {
    // Define the handleSubmit function
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        // You can add your form submission logic here
        console.log("Form submitted"); // Placeholder for form submission
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Location" />
                <button type="submit">Submit</button>
            </form>

            <div className="static-map-container">
                <MapContainer center={[31.5, 36.5]} zoom={7} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Add any markers or other map elements here */}
                    <Marker position={[31.5, 36.5]}>
                        <Popup>
                            Example Location
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
};

export default LocationSelector;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Vehicle.css';

const Vehicle = () => {
    const [username, setUsername] = useState("");
    const [licensePlate, setLicensePlate] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState(2024);
    const [batteryCapacity, setBatteryCapacity] = useState(0);
    const [electricType, setElectricType] = useState('');
    const [message, setMessage] = useState('');
    const [vehicles, setVehicles] = useState([]);

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
            console.error('Error fetching vehicles:', error);
            setMessage('Failed to load vehicles.');
        }
    };

    useEffect(() => {
        loadClientVehicles();
        setUsername(localStorage.getItem("username") || "Guest");
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const vehicleData = {
            licensePlate,
            model,
            year,
            batteryCapacity,
            electricType
        };

        try {
            const response = await axios.post('https://localhost:7080/api/Clients/add-vehicle', vehicleData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            const { vehicleId, licensePlate, model, year } = response.data;
            setMessage(`Vehicle added successfully! ID: ${vehicleId}, License Plate: ${licensePlate}, Model: ${model}, Year: ${year}`);

            setLicensePlate('');
            setModel('');
            setYear(2024);
            setBatteryCapacity(0);
            setElectricType('');
            loadClientVehicles();
        } catch (error) {
            setMessage(`Error adding vehicle: ${error.response ? error.response.data : error.message}`);
        }
    };

    const handleDelete = async (vehicleId) => {
        try {
            await axios.delete(`https://localhost:7080/api/Clients/vehicles/${vehicleId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setMessage(`Vehicle with ID ${vehicleId} deleted successfully.`);
            loadClientVehicles();
        } catch (error) {
            setMessage(`Error deleting vehicle: ${error.response ? error.response.data : error.message}`);
        }
    };

    return (
        <div className="Collers">
            <div className="vehicle-management">
                <h1 className="form-title">Vehicle Management</h1>
                <div className="content-wrapper">
                    <div className="add-vehicle-form">
                        <h2 className='VH2'>Add a New Vehicle</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className='LAb'>License Plate:</label>
                                <input
                                    type="text"
                                    value={licensePlate}
                                    onChange={(e) => setLicensePlate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className='LAb'>Model:</label>
                                <input
                                    type="text"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className='LAb'>Year:</label>
                                <input
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className='LAb'>Battery Capacity:</label>
                                <input
                                    type="number"
                                    value={batteryCapacity}
                                    onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className='LAb'>Electric Type:</label>
                                <input
                                    type="text"
                                    value={electricType}
                                    onChange={(e) => setElectricType(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    padding: '14px 24px',
                                    fontSize: '1.1rem',
                                    fontWeight: '500',
                                    color: '#fff',
                                    backgroundColor: '#3498db',

                                }}
                            >
                                Add Vehicle
                            </button>

                        </form>
                        {message && <p className="status-message">{message}</p>}
                    </div>

                    {/* Conditionally render the vehicle list section */}
                    {vehicles.length > 0 && (
                        <div className="vehicle-collection">
                            <h2 className='VH2'>{username}'s Vehicles</h2>
                            <table className="vehicle-info-table">
                                <thead>
                                    <tr>
                                        {/* <th>ID</th> */}
                                        <th>License Plate</th>
                                        <th>Model</th>
                                        <th>Year</th>
                                        <th>Battery (kWh)</th>
                                        <th>Type</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map((vehicle) => (
                                        <tr key={vehicle.vehicleId}>
                                            {/* <td>{vehicle.vehicleId}</td> */}
                                            <td>{vehicle.licensePlate}</td>
                                            <td>{vehicle.model}</td>
                                            <td>{vehicle.year}</td>
                                            <td>{vehicle.batteryCapacity}</td>
                                            <td>{vehicle.electricType}</td>
                                            <td>
                                                <button
                                                    className="remove-button"
                                                    onClick={() => handleDelete(vehicle.vehicleId)}
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

export default Vehicle;

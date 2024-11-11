import React, { useEffect, useState } from 'react';
import './ElectricCars.css';

const ElectricCars = () => {
  const [electricCars, setElectricCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [carImages, setCarImages] = useState({});

  const getCarImageUrl = async (make, model) => {
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${make} ${model} car&per_page=1`, {
        method: 'GET',
        headers: {
          'Authorization': 'WJlGfPF5qI4oBuOpGCp9eCQjsoqYJ8ehH8PJetEtOUWJBabRnBXHuMz0'
        }
      });
      const data = await response.json();
      return data?.photos?.[0]?.src?.small || '';
    } catch (error) {
      console.error('Error fetching car image:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('https://api.api-ninjas.com/v1/cars?limit=100&fuel_type=electricity', {
          method: 'GET',
          headers: {
            'X-Api-Key': 'O5y2mZJ/JDRU2BE7BP9I2A==fYMnsfbOPWSYx1gm'
          }
        });
        const data = await response.json();
        const cars = Array.isArray(data) ? data : [];
        setElectricCars(cars);
        
        const images = {};
        for (const car of cars) {
          const imageUrl = await getCarImageUrl(car.make, car.model);
          images[`${car.make}-${car.model}`] = imageUrl;
        }
        setCarImages(images);

        setLoadingCars(false);
      } catch (error) {
        console.error('Error fetching electric cars:', error);
        setLoadingCars(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="electric-cars-container">
      <h2>Electric Cars</h2>
      {loadingCars ? (
        <p>Loading electric cars...</p>
      ) : (
        <ul className="electric-cars-list">
          {electricCars.map((car, index) => (
            <li key={index} className="electric-car-item">
              <h3>{car.make} {car.model} ({car.year})</h3>
              <img 
                src={carImages[`${car.make}-${car.model}`] || 'default-image-url.jpg'} 
                alt={`${car.make} ${car.model}`} 
                className="car-image" 
              />
              <p>Class: {car.class}</p>
              <p>MPG (City/Highway): {car.city_mpg}/{car.highway_mpg}</p>
              <p>Transmission: {car.transmission}</p>
              <p>Drive Type: {car.drive}</p>
              <p>Engine Size: {car.engine_size} L</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ElectricCars;

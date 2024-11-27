import React, { useState } from "react";
import ElectricCarsData from "./ElectricCarsData.json";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import "./ElectricCars.css";

const ElectricCars = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; // Display 50 cars per page

  // Filter cars by name only
  const filteredCategories = ElectricCarsData.ElectricCars.map((category) => ({
    ...category,
    Cars: category.Cars.filter((car) => {
      // Only check if the car name includes the search term
      return car.Name.toLowerCase().includes(searchTerm.toLowerCase());
    }),
  })).filter((category) => category.Cars.length > 0);

  // Calculate pagination
  const totalCars = filteredCategories.reduce(
    (acc, category) => acc + category.Cars.length,
    0
  );
  const totalPages = Math.ceil(totalCars / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Flatten cars into a single array for pagination
  const allCars = filteredCategories.flatMap((category) => category.Cars);
  const currentCars = allCars.slice(startIndex, startIndex + itemsPerPage);

  // Handle Page Change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="electric-cars-container">
      <h1 className="electric-cars-title">Electric Cars</h1>

      {/* Search Input */}
      <div className="electric-cars-search">
        <input
          type="text"
          placeholder="Search by car name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="electric-cars-search-input"
        />
      </div>

      {/* Electric Cars by Category */}
      <div className="electric-car-list-container">
        {currentCars.length > 0 ? (
          currentCars.map((car, index) => (
            <div key={index} className="electric-car-card">
              <h3 className="electric-car-name">{car.Name}</h3>
              {car.ImageURL && (
                <img
                  src={car.ImageURL}
                  alt={car.Name}
                  className="electric-car-image"
                />
              )}
              <div className="electric-car-detailss">
                <div className="electric-car-meta" style={{ color: "#6a7074" }}>
                  <p style={{ color: "#6a7074" }}>
                    <strong>Year:</strong> {car.Year}
                  </p>
                  <p style={{ color: "#6a7074" }}>
                    <strong>Range:</strong> {car.Range}
                  </p>
                  <p style={{ color: "#6a7074" }}>
                    <strong>Price:</strong> {car.Price}
                  </p>
                </div>
                <p style={{ color: "#6a7074", textAlign: "left" }}>
                  <strong>Performance:</strong>
                  <ul>
                    <li style={{ color: "#6a7074", textAlign: "left" }}>
                      Top Speed: {car.Performance.TopSpeed}
                    </li>
                    <li style={{ color: "#6a7074", textAlign: "left" }}>
                      Acceleration: {car.Performance.Acceleration}
                    </li>
                  </ul>
                </p>
                <p style={{ color: "#6a7074", textAlign: "left" }}>
                  <strong>Charging:</strong>
                  <ul>
                    <li style={{ color: "#6a7074", textAlign: "left" }}>
                      Fast Charging: {car.Charging.FastCharging}
                    </li>
                    <li style={{ color: "#6a7074", textAlign: "left" }}>
                      Port Type: {car.Charging.PortType}
                    </li>
                  </ul>
                </p>
                <p style={{ color: "#6a7074", textAlign: "left" }}>
                  <strong>Explanation:</strong> {car.Explanation}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="electric-cars-no-results">
            No cars match your search criteria.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                currentPage === 1 ? "text-gray-400" : "text-indigo-600 hover:bg-gray-50"
              }`}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 text-sm font-semibold ${
                  page === currentPage ? "bg-indigo-600 text-white" : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                currentPage === totalPages ? "text-gray-400" : "text-indigo-600 hover:bg-gray-50"
              }`}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ElectricCars;

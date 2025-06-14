import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminHome.css";
import { Link } from "react-router-dom";

export default function AdminHome() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("https://4b61-140-213-74-72.ngrok-free.app/cars");
      setCars(response.data);
    } catch (err) {
      console.error("Failed to fetch car data:", err);
      setError("Failed to fetch car data. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Kendaraan akan dihapus?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://4b61-140-213-74-72.ngrok-free.app/cars/${id}`);
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (err) {
      console.error("Failed to delete car:", err);
      alert("An error occurred while deleting the car. Please try again.");
    }
  };

  return (
    <div className="admin-home">
      <h1>Car List</h1>

      {loading && <p>Loading cars...</p>} {/* Loading message */}

      {error && <p className="error">{error}</p>}

      {cars.length === 0 && !loading ? (
        <p>No cars available.</p>
      ) : (
        <div className="admin-cars-container">
          {cars.map((car) => (
            <div key={car.id} className="admin-car-card">
              <img
                src={car.image || "/default-car.png"}
                alt={car.name}
                className="admin-car-image"
              />
              <div className="admin-car-info">
                <h3>{car.name}</h3>
                <p>{car.description}</p>
                <p>
                  <strong>Price:</strong> Rp.{" "}
                  {Number(car.price).toLocaleString("id-ID")}
                </p>
                <p>
                  <strong>Rating:</strong> {car.rating || "N/A"} ⭐
                </p>
                <p>
                  <strong>Type:</strong> {car.type}
                </p>
                <div className="admin-actions">
                  <Link to={`/admin/edit-car/${car.id}`} className="btn-edit" aria-label={`Edit ${car.name}`}>
                    Edit
                  </Link>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(car.id)}
                    aria-label={`Delete ${car.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="add-car-button">
        <Link to="/admin/add-car" className="btn-add" aria-label="Add a new vehicle">
          + Add Vehicle
        </Link>
      </div>
    </div>
  );
}

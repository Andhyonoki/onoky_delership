import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminHome.css";
import { Link } from "react-router-dom";

export default function AdminHome() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    axios
      .get("http://localhost:5000/cars")
      .then((res) => {
        setCars(res.data);
      })
      .catch((err) => {
        console.error("Gagal mengambil data mobil:", err);
        setError("Gagal mengambil data mobil.");
      });
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Apakah kamu yakin ingin menghapus mobil ini?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/cars/${id}`);
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (err) {
      console.error("Gagal menghapus mobil:", err);
      alert("Terjadi kesalahan saat menghapus mobil.");
    }
  };

  return (
    <div className="admin-home">
      <h1>Daftar Mobil</h1>

      {error && <p className="error">{error}</p>}

      {cars.length === 0 ? (
        <p>Tidak ada data mobil yang tersedia.</p>
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
                  <strong>Harga:</strong> Rp.{" "}
                  {Number(car.price).toLocaleString("id-ID")}
                </p>
                <p>
                  <strong>Rating:</strong> {car.rating || "N/A"} ⭐
                </p>
                <p>
                  <strong>Tipe:</strong> {car.type}
                </p>
                <div className="admin-actions">
                  <button className="btn-edit">✏️ Edit</button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(car.id)}
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="add-car-button">
        <Link to="/admin/add-car" className="btn-add">
          + Tambah Kendaraan
        </Link>
      </div>

    </div>
  );
}

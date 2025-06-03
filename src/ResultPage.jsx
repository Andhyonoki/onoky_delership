import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Sidebar from "./component/Navbar"; // Asumsi ada komponen Sidebar
import "./ResultPage.css";

export default function ResultPage() {
  const location = useLocation();
  const results = location.state?.results || [];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (err) {
      console.error("Gagal parsing user:", err);
    }
  }, []);

  if (!results.length) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="empty-message">Tidak ada hasil ditemukan.</div>
      </>
    );
  }

  return (
    <div className="result-page">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="main-content"
        style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
      >
        <div className="header">
          <h1>Hasil Pencarian</h1>
          <div className="user-info">
            <span>Hello, {user?.name || "Guest"}</span>
            <img src="/user-icon.png" alt="User Icon" className="user-icon" />
          </div>
        </div>
        <div className="card-container">
          {results.map((car) => (
            <div className="car-card" key={car.id}>
              <div className="card-image-wrapper">
                <img
                  src={car.image || "/default-car.png"}
                  alt={car.name || "Car"}
                  className="card-image"
                />
                <div className="rating-badge">
                  {car.rating || "N/A"} <span>⭐</span>
                </div>
              </div>
              <div className="card-body">
                <h2>{car.name || "Nama tidak tersedia"}</h2>
                <p className="description">
                  {car.description || "Deskripsi tidak tersedia"}
                </p>
                <p className="price">
                  <strong>Price</strong>
                  <br />
                  Rp. {(car.price || 0).toLocaleString("id-ID")}
                </p>
                <Link
                  to={`/car/${car.id}`}
                  state={{ car }}
                  className="detail-link"
                >
                  View Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

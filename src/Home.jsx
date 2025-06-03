import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./component/Navbar";
import "./Home.css";

const carTypes = [
  { label: "All", icon: "🌐" },
  { label: "SUV", icon: "🚙" },
  { label: "Sedan", icon: "🚗" },
  { label: "Coupe", icon: "🚘" },
  { label: "Convertible", icon: "🏎️" },
  { label: "Van", icon: "🚐" },
  { label: "Truck", icon: "🚚" },
];

export default function Home() {
  const [cars, setCars] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    axios
      .get("http://localhost:3000/cars")
      .then((res) => setCars(res.data))
      .catch((err) => console.error(err));

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCars = cars.filter((car) => {
    const matchesType = selectedType === "All" || car.type === selectedType;
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="home-page">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className="home-main"
        style={{
          marginLeft: sidebarOpen ? "250px" : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div className="topbar">
          <p>Hello, {user ? user.name : "Guest"} 👤</p>
        </div>

        <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for any possible car on the market"
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

        <div className="car-types-wrapper">
          <div className="car-types">
            {carTypes.map((type) => (
              <button
                key={type.label}
                className={`car-type-btn ${selectedType === type.label ? "selected" : ""}`}
                onClick={() => setSelectedType(type.label)}
              >
                <span className="icon">{type.icon}</span> {type.label}
              </button>
            ))}
          </div>
        </div>

        <h2 className="section-title">Popular</h2>

        <div className="card-container">
          {filteredCars.length === 0 ? (
            <div className="empty-message">No cars found.</div>
          ) : (
            filteredCars.map((car) => (
              <div key={car.id} className="car-card">
                <div className="card-image-wrapper">
                  <img
                    src={car.image || "/default-car.png"}
                    alt={car.name}
                    className="card-image"
                  />
                  <div className="rating-badge">
                    {car.rating || "N/A"} <span>⭐</span>
                  </div>
                </div>
                <div className="card-body">
                  <h2>{car.name}</h2>
                  <p className="description">{car.description}</p>
                  <p className="price">
                    Rp. {Number(car.price).toLocaleString("id-ID")}
                  </p>
                  <a href={`/car/${car.id}`} className="detail-link">
                    View Detail
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

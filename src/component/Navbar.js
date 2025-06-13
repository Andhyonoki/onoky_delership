// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Sidebar({ isOpen, toggleSidebar, onLogout }) {
  const navigate   = useNavigate();
  const location   = useLocation();

  // Daftar menu & route
  const menus = [
    { name: "Home",    path: "/" },
    { name: "Search",  path: "/search" },
    { name: "Trade-in", path: "/tradein" },
    { name: "Schedul", path: "/jadwal" },
  ];

  const [activeMenu, setActiveMenu] = useState("");

  // Deteksi halaman aktif dari URL
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveMenu("Home");
    } else if (
      location.pathname === "/search" ||
      location.pathname === "/results" ||
      location.pathname.startsWith("/car/")
    ) {
      setActiveMenu("Search");
    } else if (location.pathname === "/tradein") {
      setActiveMenu("Trade-in");
    } else if (location.pathname === "/jadwal") {
      setActiveMenu("Schedul");
    } else {
      setActiveMenu("");
    }
  }, [location.pathname]);

  // Navigasi saat menu diklik
  const handleMenuClick = (menu) => {
    setActiveMenu(menu.name);
    navigate(menu.path);
  };

  // Logout + redirect ke /login
  const handleLogoutClick = () => {
    localStorage.removeItem("user");      // hapus user
    if (onLogout) onLogout();             // reset state di App.js
    navigate("/login", { replace: true }); // langsung ke halaman login
  };

  return (
    <>
      {/* ————————————— Sidebar ————————————— */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <h1 className="logo">{isOpen ? "ONOKY DEALERSHIP" : ""}</h1>

        <ul className="menu">
          {menus.map((menu) => (
            <li
              key={menu.name}
              className={activeMenu === menu.name ? "active" : ""}
              onClick={() => handleMenuClick(menu)}
            >
              {menu.name}
            </li>
          ))}
        </ul>

        {isOpen && (
          <div className="logout-section">
            <button className="logout-btn" onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        )}

        {isOpen && (
          <p className="footer">© 2024 onoky.com. All rights reserved.</p>
        )}
      </div>

      {/* ——————————— Tombol toggle ——————————— */}
      <button
        className={`toggle-btn ${isOpen ? "open" : "closed"}`}
        onClick={toggleSidebar}
      >
        {isOpen ? "⏴" : "⏵"}
      </button>
    </>
  );
}

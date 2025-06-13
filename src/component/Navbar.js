import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
  { name: "Home", path: "/" },
  { name: "Search", path: "/search" },
  { name: "Trade-in", path: "/tradein" },
  { name: "Ajukan Jadwal", path: "/jadwal" },  // ← tambah ini
];


  const [activeMenu, setActiveMenu] = useState("");

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
    setActiveMenu("Ajukan Jadwal"); // ← tambahkan ini
  } else {
    setActiveMenu("");
  }
}, [location.pathname]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu.name);
    navigate(menu.path);
  };

  return (
    <>
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
          <p className="footer">© 2024 onoky.com. All rights reserved.</p>
        )}
      </div>

      <button
        className={`toggle-btn ${isOpen ? "open" : "closed"}`}
        onClick={toggleSidebar}
      >
        {isOpen ? "⏴" : "⏵"}
      </button>
    </>
  );
}

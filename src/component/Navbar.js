import React from "react";
import "./Navbar.css";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <h1 className="logo">{isOpen ? "ONOKY DEALERSHIP" : ""}</h1>
        <ul className="menu">
          <li>Home</li>
          <li className="active">Search</li>
          <li>Trade-in</li>
          <li>Test Schedule</li>
          <li>Gallery</li>
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

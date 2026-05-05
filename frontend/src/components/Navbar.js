// =============================================
// src/components/Navbar.js
// Top navigation bar — shown when user is logged in
// =============================================

import React from "react";

function Navbar({ user, currentPage, onNavigate, onLogout }) {
  return (
    <nav className="navbar">
      {/* App Title */}
      <h1>📚 EduShare</h1>

      {/* Navigation links */}
      <div className="navbar-links">
        {/* All users can view resources */}
        <button onClick={() => onNavigate("resources")}>
          Resources
        </button>

        {/* Only teachers and admins can upload */}
        {(user.role === "teacher" || user.role === "admin") && (
          <button onClick={() => onNavigate("upload")}>
            Upload
          </button>
        )}

        {/* Only admins see the admin panel */}
        {user.role === "admin" && (
          <button onClick={() => onNavigate("admin")}>
            Admin Panel
          </button>
        )}

        {/* Show who is logged in */}
        <span style={{ fontSize: "13px", opacity: 0.85 }}>
          Hi, {user.name} ({user.role})
        </span>

        {/* Logout button */}
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;

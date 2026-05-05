// =============================================
// src/App.js — Main application component
// Handles routing between pages based on login state
// =============================================

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResourcesPage from "./pages/ResourcesPage";
import UploadPage from "./pages/UploadPage";
import AdminPage from "./pages/AdminPage";

function App() {
  // 'page' tells us which page to show
  const [page, setPage] = useState("login");

  // 'user' stores the logged-in user info (from JWT)
  const [user, setUser] = useState(null);

  // On app load, check if a user is already logged in (saved in localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setPage("resources"); // Go directly to resources page
    }
  }, []);

  // Called when user logs in successfully
  const handleLogin = (userData, token) => {
    // Save user info and token in browser localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setPage("resources");
  };

  // Called when user clicks Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setPage("login");
  };

  // ---- Render the correct page ----
  return (
    <div>
      {/* Show navbar only when logged in */}
      {user && (
        <Navbar
          user={user}
          currentPage={page}
          onNavigate={setPage}
          onLogout={handleLogout}
        />
      )}

      {/* Show the correct page based on 'page' state */}
      {!user && page === "login" && (
        <LoginPage onLogin={handleLogin} onGoRegister={() => setPage("register")} />
      )}

      {!user && page === "register" && (
        <RegisterPage onGoLogin={() => setPage("login")} />
      )}

      {user && page === "resources" && <ResourcesPage user={user} />}

      {user && page === "upload" && <UploadPage user={user} onSuccess={() => setPage("resources")} />}

      {user && page === "admin" && user.role === "admin" && <AdminPage />}
    </div>
  );
}

export default App;

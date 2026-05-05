// =============================================
// src/pages/LoginPage.js
// Login form — email + password
// =============================================

import React, { useState } from "react";
import { loginUser } from "../api";

function LoginPage({ onLogin, onGoRegister }) {
  // Form field values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // To show error or loading messages
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Called when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError("");
    setLoading(true);

    try {
      // Call the backend login API
      const response = await loginUser({ email, password });
      const { user, token } = response.data;

      // Tell App.js the user has logged in
      onLogin(user, token);
    } catch (err) {
      // Show error message from server (or fallback)
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Login to EduShare</h2>

        {/* Show error if any */}
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Link to Register page */}
        <div className="auth-switch">
          Don't have an account?{" "}
          <span 
            onClick={onGoRegister} 
            style={{ color: "#2563eb", fontWeight: "500", cursor: "pointer" }}
          >
            Register here
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

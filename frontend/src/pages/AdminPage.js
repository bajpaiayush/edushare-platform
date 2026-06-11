// =============================================
// src/pages/AdminPage.js
// Admin Panel — view all users, delete resources
// Only accessible to users with role = 'admin'
// =============================================

import React, { useState, useEffect } from "react";
import { fetchAllUsers, fetchResources, deleteResource } from "../api";

function AdminPage() {
  const [activeTab, setActiveTab] = useState("users"); // Which tab is active

  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "users") loadUsers();
    if (activeTab === "resources") loadResources();
  }, [activeTab]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchAllUsers();
      setUsers(response.data);
    } catch (err) {
      setMessage("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const loadResources = async () => {
    setLoading(true);
    try {
      const response = await fetchResources();
      setResources(response.data);
    } catch (err) {
      setMessage("Failed to load resources.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a resource and refresh the list
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await deleteResource(id);
      setMessage("Resource deleted successfully.");
      // Remove from the local list without reloading
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setMessage("Failed to delete resource.");
    }
  };

  // Badge color based on role
  const roleBadge = (role) => {
    const cls = role === "admin" ? "badge-admin" : role === "teacher" ? "badge-teacher" : "badge-student";
    return <span className={`badge ${cls}`}>{role}</span>;
  };

  return (
    <div className="container" style={{ marginTop: "30px" }}>
      <h2 className="page-title">Admin Panel</h2>

      {message && (
        <div className="success-msg">{message}</div>
      )}

      {/* Tab buttons */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => { setActiveTab("users"); setMessage(""); }}
        >
          All Users
        </button>
        <button
          className={`tab-btn ${activeTab === "resources" ? "active" : ""}`}
          onClick={() => { setActiveTab("resources"); setMessage(""); }}
        >
          Manage Resources
        </button>
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading...</p>}

      {/* Users Tab */}
      {activeTab === "users" && !loading && (
        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{roleBadge(u.role)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p style={{ padding: "16px", color: "#6b7280" }}>No users found.</p>
          )}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && !loading && (
        <div>
          {resources.length === 0 && (
            <div className="card" style={{ textAlign: "center", color: "#6b7280" }}>
              No resources found.
            </div>
          )}
          {resources.map((r) => (
            <div className="resource-card" key={r.id}>
              <div className="resource-info">
                <h3>{r.title}</h3>
                <p>{r.subject} — by {r.uploader_name || "Unknown"}</p>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(r.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPage;

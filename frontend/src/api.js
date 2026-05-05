// =============================================
// src/api.js
// Central place for all API calls (backend URL)
// Change REACT_APP_API_URL in .env to your Render URL
// =============================================

import axios from "axios";

// Base URL of the backend
// In development: http://localhost:5000
// In production: your Render URL (set in .env)
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper: get the stored JWT token from localStorage
const getToken = () => localStorage.getItem("token");

// Helper: build headers with the Authorization token
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

// ---- Auth API calls ----
export const registerUser = (data) =>
  axios.post(`${API_BASE}/api/auth/register`, data);

export const loginUser = (data) =>
  axios.post(`${API_BASE}/api/auth/login`, data);

// ---- Resource API calls ----
export const fetchResources = (search = "") =>
  axios.get(`${API_BASE}/api/resources?search=${search}`, authHeaders());

export const uploadResource = (formData) =>
  axios.post(`${API_BASE}/api/resources/upload`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data", // Required for file uploads
    },
  });

// ---- Admin API calls ----
export const fetchAllUsers = () =>
  axios.get(`${API_BASE}/api/admin/users`, authHeaders());

export const deleteResource = (id) =>
  axios.delete(`${API_BASE}/api/admin/resources/${id}`, authHeaders());

// =============================================
// src/pages/ResourcesPage.js
// Shows all uploaded resources with search
// All logged-in users can see and download resources
// =============================================

import React, { useState, useEffect } from "react";
import { fetchResources } from "../api";

function ResourcesPage({ user }) {
  const [resources, setResources] = useState([]); // List of resources
  const [search, setSearch] = useState("");        // Search input value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load resources when the page first loads
  useEffect(() => {
    loadResources("");
  }, []);

  // Fetch resources from the backend
  const loadResources = async (searchTerm) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchResources(searchTerm);
      setResources(response.data);
    } catch (err) {
      setError("Failed to load resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Called when the search button is clicked
  const handleSearch = () => {
    loadResources(search);
  };

  // Allow pressing Enter to search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="container" style={{ marginTop: "30px" }}>
      <h2 className="page-title">Learning Resources</h2>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        {search && (
          <button
            className="btn"
            style={{ background: "#e5e7eb" }}
            onClick={() => { setSearch(""); loadResources(""); }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Error message */}
      {error && <div className="error-msg">{error}</div>}

      {/* Loading state */}
      {loading && <p style={{ color: "#6b7280" }}>Loading resources...</p>}

      {/* Show resources */}
      {!loading && resources.length === 0 && (
        <div className="card" style={{ textAlign: "center", color: "#6b7280" }}>
          No resources found.
        </div>
      )}

      {!loading && resources.map((resource) => (
        <div className="resource-card" key={resource.id}>
          <div className="resource-info">
            {/* Resource title and subject */}
            <h3>{resource.title}</h3>
            <p>
              {resource.subject}
              {resource.description && ` — ${resource.description}`}
            </p>
            <p style={{ marginTop: "4px", fontSize: "12px", color: "#9ca3af" }}>
              Uploaded by: {resource.uploader_name || "Unknown"}
            </p>
          </div>

          {/* Download button — opens the file URL */}
          <a
            href={resource.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-sm"
            style={{ textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}

export default ResourcesPage;

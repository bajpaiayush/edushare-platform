// =============================================
// src/pages/UploadPage.js
// Form to upload a new resource (PDF, PPT, DOC)
// Only teachers and admins can access this
// =============================================

import React, { useState } from "react";
import { uploadResource } from "../api";

function UploadPage({ user, onSuccess }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // The selected file

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);

    // FormData is used to send both text fields AND the file together
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("file", file); // 'file' must match what the backend expects

    try {
      await uploadResource(formData);
      setSuccess("Resource uploaded successfully!");
      // Reset the form
      setTitle("");
      setSubject("");
      setDescription("");
      setFile(null);
      // Optionally go back to resources page after 1.5 seconds
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: "30px", maxWidth: "600px" }}>
      <h2 className="page-title">Upload Resource</h2>

      <div className="card">
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Resource Title *</label>
            <input
              type="text"
              placeholder="e.g. Chapter 3 - Data Structures"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Subject *</label>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              rows="3"
              placeholder="Brief description of the resource..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="file-input">Select File (PDF, PPT, DOC) *</label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            {/* Show the name of selected file */}
            {file && (
              <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
                Selected: {file.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Uploading... please wait" : "Upload Resource"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;

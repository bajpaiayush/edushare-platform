// =============================================
// controllers/resourceController.js
// Handles uploading & listing resources
// =============================================

const cloudinary = require("../config/cloudinary");
const ResourceModel = require("../models/resourceModel");

// ---- UPLOAD RESOURCE ----
// POST /api/resources/upload
// Only teachers and admins can upload
const uploadResource = async (req, res) => {
  const { title, subject, description } = req.body;

  // Make sure a file was included in the request
  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: "Please select a file to upload." });
  }

  if (!title || !subject) {
    return res.status(400).json({ message: "Title and subject are required." });
  }

  const file = req.files.file; // The actual uploaded file

  try {
    // Upload the file to Cloudinary
    // resource_type: "raw" means non-image files (PDF, PPT, DOC, etc.)
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "raw",
      folder: "edu-resources", // Store in a folder called 'edu-resources'
    });

    // Save resource info to the database
    const newResource = await ResourceModel.create(
      title,
      subject,
      description,
      uploadResult.secure_url, // The Cloudinary URL of the file
      req.user.id               // Who uploaded it
    );

    res.status(201).json({
      message: "Resource uploaded successfully!",
      resource: newResource,
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Server error during file upload." });
  }
};

// ---- GET ALL RESOURCES ----
// GET /api/resources
// Optional query: /api/resources?search=math
const getAllResources = async (req, res) => {
  const search = req.query.search || ""; // Get search term from URL if provided

  try {
    const resources = await ResourceModel.getAll(search);
    res.json(resources);
  } catch (err) {
    console.error("Fetch resources error:", err.message);
    res.status(500).json({ message: "Server error while fetching resources." });
  }
};

module.exports = { uploadResource, getAllResources };

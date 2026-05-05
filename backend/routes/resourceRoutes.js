// =============================================
// routes/resourceRoutes.js
// Defines URL paths for resources
// =============================================

const express = require("express");
const router = express.Router();
const { uploadResource, getAllResources } = require("../controllers/resourceController");
const { protect, teacherOrAdmin } = require("../middleware/authMiddleware");

// GET /api/resources — Get all resources (anyone logged in can see)
// Optional: ?search=keyword
router.get("/", protect, getAllResources);

// POST /api/resources/upload — Upload a new resource
// Only teachers and admins can upload
router.post("/upload", protect, teacherOrAdmin, uploadResource);

module.exports = router;

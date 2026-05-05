// =============================================
// routes/adminRoutes.js
// Admin-only routes — protected by adminOnly middleware
// =============================================

const express = require("express");
const router = express.Router();
const { getAllUsers, deleteResource } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// GET /api/admin/users — View all registered users
router.get("/users", protect, adminOnly, getAllUsers);

// DELETE /api/admin/resources/:id — Delete a resource by ID
router.delete("/resources/:id", protect, adminOnly, deleteResource);

module.exports = router;

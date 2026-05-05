// =============================================
// controllers/adminController.js
// Admin-only actions: view users, delete resources
// =============================================

const UserModel = require("../models/userModel");
const ResourceModel = require("../models/resourceModel");

// ---- GET ALL USERS ----
// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAll();
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err.message);
    res.status(500).json({ message: "Server error while fetching users." });
  }
};

// ---- DELETE A RESOURCE ----
// DELETE /api/admin/resources/:id
const deleteResource = async (req, res) => {
  const resourceId = req.params.id; // Get the ID from the URL

  try {
    const deleted = await ResourceModel.deleteById(resourceId);

    if (!deleted) {
      return res.status(404).json({ message: "Resource not found." });
    }

    res.json({ message: "Resource deleted successfully.", resource: deleted });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Server error while deleting resource." });
  }
};

module.exports = { getAllUsers, deleteResource };

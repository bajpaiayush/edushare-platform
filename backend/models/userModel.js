// =============================================
// models/userModel.js
// All database queries related to USERS go here
// =============================================

const pool = require("../config/db");

const UserModel = {
  // Find a user by their email address
  findByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0]; // Returns the user object or undefined
  },

  // Create a new user in the database
  create: async (name, email, hashedPassword, role) => {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role]
    );
    return result.rows[0]; // Returns the newly created user
  },

  // Get all users (for admin panel)
  getAll: async () => {
    const result = await pool.query("SELECT id, name, email, role FROM users ORDER BY id");
    return result.rows;
  },
};

module.exports = UserModel;

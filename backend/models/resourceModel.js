// =============================================
// models/resourceModel.js
// All database queries related to RESOURCES go here
// =============================================

const pool = require("../config/db");

const ResourceModel = {
  // Save a new resource to the database
  create: async (title, subject, description, fileUrl, uploadedBy) => {
    const result = await pool.query(
      `INSERT INTO resources (title, subject, description, file_url, uploaded_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, subject, description, fileUrl, uploadedBy]
    );
    return result.rows[0];
  },

  // Get ALL resources (optionally filter by search term)
  getAll: async (search = "") => {
    // If search is empty, return everything
    // If search is provided, filter by title OR subject (case-insensitive)
    const query = search
      ? `SELECT resources.*, users.name AS uploader_name 
         FROM resources 
         LEFT JOIN users ON resources.uploaded_by = users.id
         WHERE LOWER(resources.title) LIKE $1 OR LOWER(resources.subject) LIKE $1
         ORDER BY resources.created_at DESC`
      : `SELECT resources.*, users.name AS uploader_name 
         FROM resources 
         LEFT JOIN users ON resources.uploaded_by = users.id
         ORDER BY resources.created_at DESC`;

    const params = search ? [`%${search.toLowerCase()}%`] : [];
    const result = await pool.query(query, params);
    return result.rows;
  },

  // Delete a resource by ID (admin only)
  deleteById: async (id) => {
    const result = await pool.query("DELETE FROM resources WHERE id = $1 RETURNING *", [id]);
    return result.rows[0]; // Returns the deleted resource or undefined
  },
};

module.exports = ResourceModel;

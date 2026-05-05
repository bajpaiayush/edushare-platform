// =============================================
// server.js — The main entry point of the app
// This starts the Express server
// =============================================

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config(); // Loads variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
// Allow requests from frontend (React app)
app.use(cors());

// Allow the server to read JSON data from requests
app.use(express.json());

// Allow file uploads
app.use(fileUpload({ useTempFiles: true }));

// ---- Routes ----
// Import and use route files
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ---- Health Check ----
// Visit http://localhost:5000/ to confirm the server is running
app.get("/", (req, res) => {
  res.send("Educational Resource Platform API is running!");
});

// ---- TEMPORARY ADMIN HELPER (DELETE AFTER USE) ----
// Visit http://localhost:5000/api/make-admin?email=0403ayush@gmail.com
app.get("/api/make-admin", async (req, res) => {
  const { email } = req.query;
  const pool = require("./config/db");
  try {
    await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [email]);
    res.send(`Successfully made ${email} an admin! You can now login and see the admin panel.`);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

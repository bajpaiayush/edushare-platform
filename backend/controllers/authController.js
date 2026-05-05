// =============================================
// controllers/authController.js
// Handles Register & Login logic
// =============================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

// ---- REGISTER ----
// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields." });
  }

  try {
    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash the password (never save plain text passwords!)
    // bcrypt adds random "salt" and hashes it 10 times
    const hashedPassword = await bcrypt.hash(password, 10);

    // Only allow 'student' or 'teacher' role during registration
    // Admin is set manually in DB for security
    const safeRole = role === "teacher" ? "teacher" : "student";

    // Save the user to the database
    const newUser = await UserModel.create(name, email, hashedPassword, safeRole);

    res.status(201).json({
      message: "Registration successful!",
      user: newUser,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// ---- LOGIN ----
// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields." });
  }

  try {
    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare entered password with the hashed one in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create a JWT token that expires in 7 days
    // The token stores user's id, name, and role
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

module.exports = { register, login };

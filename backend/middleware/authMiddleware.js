// =============================================
// middleware/authMiddleware.js
// This runs BEFORE a route to check if the user is logged in
// It reads the JWT token from the request header
// =============================================

const jwt = require("jsonwebtoken");

// Middleware: checks if the user sent a valid JWT token
function protect(req, res, next) {
  // Get the token from the "Authorization" header
  // Format: "Bearer eyJhbGci..."
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not logged in. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract just the token part

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next(); // Allow the request to continue to the route
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired." });
  }
}

// Middleware: only allows 'admin' role to access a route
function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next(); // Admin is allowed
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
}

// Middleware: only allows 'teacher' or 'admin' to upload
function teacherOrAdmin(req, res, next) {
  if (req.user && (req.user.role === "teacher" || req.user.role === "admin")) {
    next();
  } else {
    return res.status(403).json({ message: "Only teachers or admins can upload." });
  }
}

module.exports = { protect, adminOnly, teacherOrAdmin };

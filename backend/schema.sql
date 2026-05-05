-- =============================================
-- schema.sql — Database Table Definitions
-- Run this SQL in your Neon PostgreSQL console
-- to create the required tables
-- =============================================

-- Users table: stores all registered users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,               -- auto-incrementing ID
  name VARCHAR(100) NOT NULL,          -- user's full name
  email VARCHAR(150) UNIQUE NOT NULL,  -- must be unique
  password TEXT NOT NULL,              -- hashed password (never plain text)
  role VARCHAR(20) DEFAULT 'student'   -- role: 'admin', 'teacher', 'student'
);

-- Resources table: stores uploaded files and their info
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,         -- title of the resource
  subject VARCHAR(100) NOT NULL,       -- subject it belongs to
  description TEXT,                    -- optional short description
  file_url TEXT NOT NULL,              -- Cloudinary URL of the uploaded file
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- who uploaded it
  created_at TIMESTAMP DEFAULT NOW()   -- when was it uploaded
);

-- Optional: Downloads table to track who downloaded what
CREATE TABLE IF NOT EXISTS downloads (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP DEFAULT NOW()
);

// =============================================
// config/db.js — Database connection setup
// We use the 'pg' library to connect to PostgreSQL
// =============================================

const { Pool } = require("pg");
const { URL } = require("url");

// Parse the DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);

// Workaround for restricted campus/lab networks that block DNS for neon.tech
// We map the hostname directly to Neon's Asia Pacific IP address
let host = dbUrl.hostname;
if (host.includes("aws.neon.tech")) {
  host = "18.138.49.39"; // Direct IP to bypass DNS block
}

// Create a connection pool using the parsed variables
// Neon (free tier) may sleep — so we set a longer connection timeout
const pool = new Pool({
  user: dbUrl.username,
  password: dbUrl.password,
  host: host,
  database: dbUrl.pathname.slice(1),
  port: dbUrl.port || 5432,
  ssl: { 
    rejectUnauthorized: false,
    servername: dbUrl.hostname // Required for Neon's SNI proxy to route correctly
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 5,
});

// Test if connection works when server starts
// Neon free tier may take a few seconds to "wake up" — that's normal
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL (Neon) successfully!");
    client.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Database connection failed:", err.message);
    console.log("Retrying connection in 5 seconds...");
    // Retry once after 5 seconds (Neon may be waking up)
    setTimeout(async () => {
      try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL (Neon) successfully on retry!");
        client.release();
      } catch (retryErr) {
        console.error("Retry also failed:", retryErr.message);
        console.log("Check your DATABASE_URL in the .env file.");
      }
    }, 5000);
  }
};

testConnection();

// Export the pool so other files can use it to run queries
module.exports = pool;

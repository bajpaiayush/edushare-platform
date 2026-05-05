const { Pool } = require("pg");
const { URL } = require("url");

const dbUrl = new URL('postgresql://neondb_owner:npg_PV1AuQdY5Hyk@ep-odd-bonus-aol4bwbx-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

const pool = new Pool({
  user: dbUrl.username,
  password: dbUrl.password,
  host: '18.138.49.39', // override host
  database: dbUrl.pathname.slice(1),
  port: dbUrl.port || 5432,
  ssl: {
    rejectUnauthorized: false,
    servername: dbUrl.hostname // required for SNI
  }
});

pool.connect()
  .then((client) => {
    console.log("SUCCESS WITH URL PARSING!");
    client.release();
    return pool.end();
  })
  .catch(err => console.error("ERROR:", err.message));

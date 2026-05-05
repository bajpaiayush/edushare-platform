const { Pool } = require("pg");

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_PV1AuQdY5Hyk@ep-odd-bonus-aol4bwbx-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  host: '18.138.49.39',
  ssl: {
    rejectUnauthorized: false,
    servername: 'ep-odd-bonus-aol4bwbx-pooler.c-2.ap-southeast-1.aws.neon.tech'
  }
});

pool.connect()
  .then((client) => {
    console.log("SUCCESS OVERRIDING CONNECTION STRING!");
    client.release();
    return pool.end();
  })
  .catch(err => console.error("ERROR:", err.message));

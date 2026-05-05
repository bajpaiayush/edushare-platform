const { Client } = require("pg");

const client = new Client({
  user: 'neondb_owner',
  password: 'npg_PV1AuQdY5Hyk',
  host: '18.138.49.39',
  database: 'neondb',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
    servername: 'ep-odd-bonus-aol4bwbx-pooler.c-2.ap-southeast-1.aws.neon.tech'
  }
});

client.connect()
  .then(() => {
    console.log("SUCCESS!");
    return client.end();
  })
  .catch(err => console.error("ERROR:", err.message));

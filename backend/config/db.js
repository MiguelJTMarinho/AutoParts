const { Pool } = require("@neondatabase/serverless");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
});

pool
  .connect()
  .then(() => console.log("Neon PostgreSQL connected via WebSockets"))
  .catch((err) => console.error("Connection error", err));

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

module.exports = pool;

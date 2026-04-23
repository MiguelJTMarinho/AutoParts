const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
});
console.log("PG_PASSWORD:", process.env.PG_PASSWORD);

const createTBLQuery = `-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password_hash TEXT NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
	role varchar(20) DEFAULT("customer")
    phone_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);`;

pool
  .query(createTBLQuery)
  .then((reponse) => {
    console.log(`Tables Created!`);
    console.log("Response:", reponse);
  })
  .catch((err) => {
    console.error(`Error creating database ${process.env.PG_DATABASE}:`, err);
  });

module.exports = pool;

const pool = require("../config/db");

// CREATE
const createAddress = async (data) => {
  const {
    user_id,
    title,
    address_line_1,
    address_line_2,
    country,
    city,
    postal_code,
  } = data;

  const result = await pool.query(
    `INSERT INTO addresses (
      user_id, title, address_line_1, address_line_2,
      country, city, postal_code
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [
      user_id,
      title,
      address_line_1,
      address_line_2,
      country,
      city,
      postal_code,
    ],
  );

  return result.rows[0];
};

// GET ALL BY USER
const getAddressesByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM addresses WHERE user_id = $1 ORDER BY id ASC`,
    [user_id],
  );

  return result.rows;
};

// GET BY ID
const getAddressById = async (id) => {
  const result = await pool.query(`SELECT * FROM addresses WHERE id = $1`, [
    id,
  ]);

  return result.rows[0];
};

// UPDATE
const updateAddress = async (id, data) => {
  const { title, address_line_1, address_line_2, country, city, postal_code } =
    data;

  const result = await pool.query(
    `UPDATE addresses
     SET title = COALESCE($1, title),
         address_line_1 = COALESCE($2, address_line_1),
         address_line_2 = COALESCE($3, address_line_2),
         country = COALESCE($4, country),
         city = COALESCE($5, city),
         postal_code = COALESCE($6, postal_code)
     WHERE id = $7
     RETURNING *`,
    [title, address_line_1, address_line_2, country, city, postal_code, id],
  );

  return result.rows[0];
};

// DELETE
const deleteAddress = async (id) => {
  const result = await pool.query(
    `DELETE FROM addresses WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createAddress,
  getAddressesByUser,
  getAddressById,
  updateAddress,
  deleteAddress,
};

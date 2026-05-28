const pool = require("../config/db");

// CREATE
const createProductFitment = async (product_id, generation_id) => {
  const result = await pool.query(
    `INSERT INTO product_fitments (
      product_id,
      generation_id
    )
    VALUES ($1, $2)
    RETURNING *`,
    [product_id, generation_id],
  );

  return result.rows[0];
};

// GET ALL
const getAllProductFitments = async () => {
  const result = await pool.query(`
    SELECT 
      pf.product_id,
      pf.generation_id,

      p.name AS product_name,

      vg.generation_name,
      vg.year_start,
      vg.year_end,

      cb.name AS brand,
      cm.name AS model

    FROM product_fitments pf
    JOIN products p ON p.id = pf.product_id
    JOIN vehicle_generations vg ON vg.id = pf.generation_id
    JOIN car_brands cb ON cb.id = vg.carbrand_id
    JOIN car_models cm ON cm.id = vg.carmodel_id
    ORDER BY pf.product_id ASC
  `);

  return result.rows;
};

// GET BY PRODUCT
const getFitmentsByProduct = async (product_id) => {
  const result = await pool.query(
    `
    SELECT 
      pf.product_id,
      pf.generation_id,

      vg.generation_name,
      vg.year_start,
      vg.year_end,

      cb.name AS brand,
      cm.name AS model

    FROM product_fitments pf

    JOIN vehicle_generations vg
      ON vg.id = pf.generation_id

    JOIN car_brands cb
      ON cb.id = vg.carbrand_id

    JOIN car_models cm
      ON cm.id = vg.carmodel_id

    WHERE pf.product_id = $1

    ORDER BY vg.year_start ASC
  `,
    [product_id],
  );

  return result.rows;
};

// DELETE
const deleteProductFitment = async (product_id, generation_id) => {
  const result = await pool.query(
    `
    DELETE FROM product_fitments
    WHERE product_id = $1
    AND generation_id = $2
    RETURNING *
  `,
    [product_id, generation_id],
  );

  return result.rows[0];
};

const deleteFitmentsByProduct = async (product_id) => {
  await pool.query(
    `
    DELETE FROM product_fitments
    WHERE product_id = $1
  `,
    [product_id],
  );
};

const bulkCreateFitments = async (product_id, generation_ids) => {
  if (!generation_ids || !generation_ids.length) return;

  const values = [];
  const placeholders = [];

  generation_ids.forEach((generation_id, index) => {
    const baseIndex = index * 2;

    placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2})`);

    values.push(product_id, generation_id);
  });

  await pool.query(
    `
    INSERT INTO product_fitments (
      product_id,
      generation_id
    )
    VALUES ${placeholders.join(", ")}
  `,
    values,
  );
};

module.exports = {
  createProductFitment,
  getAllProductFitments,
  getFitmentsByProduct,
  deleteProductFitment,
  deleteFitmentsByProduct,
  bulkCreateFitments,
};

const pool = require("../config/db");

// CREATE
const createProduct = async (data) => {
  const {
    external_id,
    name,
    description,
    summary,
    sku,
    price,
    condition,
    stock,
    category_id,
    brand_id,
    status,
    is_active,
    weight_kg,
    width_cm,
    height_cm,
    length_cm,
  } = data;

  const result = await pool.query(
    `INSERT INTO products (
      external_id, name, description, summary, sku,
      price, condition, stock,
      category_id, brand_id, status, is_active, created_at,
      weight_kg, width_cm, height_cm, length_cm
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, now(), $13, $14, $15, $16)
    RETURNING *`,
    [
      external_id,
      name,
      description,
      summary,
      sku,
      price,
      condition,
      stock,
      category_id,
      brand_id,
      status,
      is_active,
      weight_kg || 0,
      width_cm || 0,
      height_cm || 0,
      length_cm || 0,
    ],
  );

  return result.rows[0];
};

const getAllProducts = async (filters) => {
  console.log(filters);
  let query = `
    SELECT DISTINCT 
      p.*,

      -- Category + Brand names
      c.name AS category,
      pb.name AS part_brand,

      -- Images
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', pi.id,
              'image_url', pi.image_url,
              'sort_order', pi.sort_order
            )
            ORDER BY pi.sort_order ASC
          )
          FROM product_images pi
          WHERE pi.product_id = p.id
        ),
        '[]'::jsonb
      ) AS images,

      -- Fitments / Compatibility 
      COALESCE( 
        ( 
          SELECT jsonb_agg( 
            jsonb_build_object( 
              'generation_id', 
              vg.id, 'brand', 
              cb2.name, 'model', 
              cm2.name, 'generation_name', 
              vg.generation_name, 'year_start',
              vg.year_start, 'year_end', 
              vg.year_end 
            ) 
          ) 
          FROM product_fitments pf 
          JOIN vehicle_generations vg ON vg.id = pf.generation_id 
          JOIN car_brands cb2 ON cb2.id = vg.carbrand_id 
          JOIN car_models cm2 ON cm2.id = vg.carmodel_id 
          WHERE pf.product_id = p.id ), '[]'::jsonb 
        ) AS compatibility, 

      -- OEM References
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'reference_code', oem2.reference_code,
              'brand', oem2.brand,
              'type', oem2.type
            )
          )
          FROM oem_references oem2
          WHERE oem2.product_id = p.id
        ),
        '[]'::jsonb
      ) AS oem_references

    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN part_brands pb ON pb.id = p.brand_id
    LEFT JOIN oem_references oem ON oem.product_id = p.id
    LEFT JOIN product_fitments pf ON pf.product_id = p.id
    LEFT JOIN vehicle_generations vg ON vg.id = pf.generation_id
    LEFT JOIN car_brands cb ON cb.id = vg.carbrand_id
    LEFT JOIN car_models cm ON cm.id = vg.carmodel_id

    WHERE p.deleted_at IS NULL
  `;

  const values = [];
  let index = 1;

  // CATEGORY
  if (filters.category) {
    const categories = Array.isArray(filters.category)
      ? filters.category
      : [filters.category];

    const placeholders = categories.map((_, i) => `$${index + i}`).join(", ");
    query += ` AND c.name IN (${placeholders})`;
    values.push(...categories);
    index += categories.length;
  }

  // OEM
  if (filters.oem) {
    query += ` AND oem.reference_code ILIKE $${index++}`;
    values.push(`%${filters.oem}%`);
  }

  // CAR BRAND
  if (filters.carBrand) {
    query += ` AND cb.name ILIKE $${index++}`;
    values.push(`%${filters.carBrand}%`);
  }

  // CAR MODEL
  if (filters.carModel) {
    query += ` AND cm.name ILIKE $${index++}`;
    values.push(`%${filters.carModel}%`);
  }

  // CAR Generation
  if (filters.generationId) {
    query += `
    AND EXISTS (
      SELECT 1
      FROM product_fitments pf
      WHERE pf.product_id = p.id
      AND pf.generation_id = $${index++}
    )
  `;

    values.push(filters.generationId);
  }

  // PART BRAND
  if (filters.partBrand) {
    const brands = Array.isArray(filters.partBrand)
      ? filters.partBrand
      : [filters.partBrand];

    const placeholders = brands.map((_, i) => `$${index + i}`).join(", ");
    query += ` AND pb.name IN (${placeholders})`;
    values.push(...brands);
    index += brands.length;
  }

  // MIN PRICE
  if (filters.minPrice) {
    query += ` AND p.price >= $${index++}`;
    values.push(filters.minPrice);
  }

  // MAX PRICE
  if (filters.maxPrice) {
    query += ` AND p.price <= $${index++}`;
    values.push(filters.maxPrice);
  }

  // IN STOCK
  if (filters.inStock === "true") {
    query += ` AND p.stock > 0`;
  }

  // SEARCH
  if (filters.search) {
    query += `
      AND (
        p.name ILIKE $${index}
        OR p.sku ILIKE $${index}
        OR p.description ILIKE $${index}
      )
    `;
    values.push(`%${filters.search}%`);
    index++;
  }

  // SORT
  if (filters.sort_by === "price_asc") {
    query += ` ORDER BY p.price ASC`;
  } else if (filters.sort_by === "price_desc") {
    query += ` ORDER BY p.price DESC`;
  } else {
    query += ` ORDER BY p.created_at DESC`;
  }

  // LIMIT
  if (filters.limit) {
    query += ` LIMIT $${index++}`;
    values.push(filters.limit);
  }

  const result = await pool.query(query, values);

  return result.rows;
};

// GET BY ID (Com Nomes de Categoria/Marca, Imagens, Compatibilidades e Referências OEM)
const getProductById = async (id) => {
  const result = await pool.query(
    `SELECT 
       p.*,
       
       -- Nomes da Categoria e Marca da Peça
       c.name AS category,
       pb.name AS part_brand,
       
       -- 1. Array de Imagens
       COALESCE(
         (
           SELECT json_agg(
             json_build_object(
               'id', pi.id,
               'image_url', pi.image_url,
               'sort_order', pi.sort_order
             ) ORDER BY pi.sort_order ASC
           )
           FROM product_images pi
           WHERE pi.product_id = p.id
         ), 
         '[]'::json
       ) AS images,

       -- 2. Array de Compatibilidade
       COALESCE( 
          ( 
            SELECT json_agg( 
              json_build_object( 
                'generation_id', vg.id, 
                'brand', cb.name, 
                'model', cm.name, 
                'generation_name', vg.generation_name, 
                'year_start', vg.year_start, 
                'year_end', vg.year_end 
              ) 
            ) 
            FROM product_fitments pf 
            JOIN vehicle_generations vg ON vg.id = pf.generation_id 
            JOIN car_brands cb ON vg.carbrand_id = cb.id 
            JOIN car_models cm ON vg.carmodel_id = cm.id 
            WHERE pf.product_id = p.id 
          ), '[]'::json 
        ) AS compatibility,

       -- 3. Array de Referências OEM 
       COALESCE(
         (
           SELECT json_agg(
             json_build_object(
               'reference_code', oem.reference_code,
               'brand', oem.brand,
               'type', oem.type
             )
           )
           FROM oem_references oem
           WHERE oem.product_id = p.id
         ), 
         '[]'::json
       ) AS oem_references

     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     LEFT JOIN part_brands pb ON p.brand_id = pb.id
     WHERE p.id = $1 AND p.deleted_at IS NULL`,
    [id],
  );

  return result.rows[0];
};

const getProductByIdForAdmin = async (id) => {
  const result = await pool.query(`SELECT * FROM products WHERE id = $1`, [id]);

  return result.rows[0];
};

// UPDATE
const updateProduct = async (id, data) => {
  const {
    sku,
    name,
    description,
    summary,
    price,
    condition,
    stock,
    category_id,
    brand_id,
    status,
    is_active,
    weight_kg,
    width_cm,
    height_cm,
    length_cm,
  } = data;

  const result = await pool.query(
    `UPDATE products
     SET sku = COALESCE($1, sku),
         name = COALESCE($2, name),
         description = COALESCE($3, description),
         summary = COALESCE($4, summary),
         price = COALESCE($5, price),
         condition = COALESCE($6, condition),
         stock = COALESCE($7, stock),
         category_id = COALESCE($8, category_id),
         brand_id = COALESCE($9, brand_id),
         status = CASE
           WHEN $11 = true AND COALESCE($10, status) = 'inactive' THEN 'active'
           WHEN $11 = false THEN 'inactive'
           ELSE COALESCE($10, status)
         END,
         is_active = COALESCE($11, is_active),
         deleted_at = CASE
           WHEN $11 = true THEN NULL
           WHEN $11 = false THEN COALESCE(deleted_at, NOW())
           ELSE deleted_at
         END,
         weight_kg = COALESCE($13, weight_kg),
         width_cm = COALESCE($14, width_cm),
         height_cm = COALESCE($15, height_cm),
         length_cm = COALESCE($16, length_cm),
         updated_at = NOW()
     WHERE id = $12
     RETURNING *`,
    [
      sku,
      name,
      description,
      summary,
      price,
      condition,
      stock,
      category_id,
      brand_id,
      status,
      is_active,
      id,
      weight_kg,
      width_cm,
      height_cm,
      length_cm,
    ],
  );

  return result.rows[0];
};

// SOFT DELETE
const deleteProduct = async (id) => {
  const result = await pool.query(
    `UPDATE products
     SET is_active = false,
         status = 'inactive',
         deleted_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  return result.rows[0];
};

//Hard Delete
const hardDeleteProduct = async (id) => {
  const result = await pool.query(
    `DELETE FROM products
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  return result.rows[0];
};

const getProductStockAndPrice = async (product_id) => {
  const result = await pool.query(
    `SELECT stock, price, weight_kg FROM products WHERE id = $1`,
    [product_id],
  );
  return result.rows[0];
};

const updateProductStock = async (product_id, newStock) => {
  const result = await pool.query(
    `UPDATE products SET stock = $1 WHERE id = $2 RETURNING *`,
    [newStock, product_id],
  );
  return result.rows[0];
};
const getSimilarProducts = async (productId) => {
  // 1. buscar produto base
  const productResult = await pool.query(
    `SELECT category_id, brand_id 
     FROM products 
     WHERE id = $1 AND deleted_at IS NULL`,
    [productId],
  );

  const product = productResult.rows[0];

  if (!product) return [];

  // 2. tentar pela mesma categoria primeiro (COM IMAGENS)
  const result = await pool.query(
    `SELECT 
       p.*,
       COALESCE(
         (
           SELECT json_agg(
             json_build_object(
               'id', pi.id,
               'image_url', pi.image_url,
               'sort_order', pi.sort_order
             ) ORDER BY pi.sort_order ASC
           )
           FROM product_images pi
           WHERE pi.product_id = p.id
         ), 
         '[]'::json
       ) AS images
     FROM products p
     WHERE p.deleted_at IS NULL
     AND p.id != $1
     AND p.category_id = $2
     ORDER BY RANDOM()
     LIMIT 4`,
    [productId, product.category_id],
  );

  // 3. se não tiver 4, completa por brand (COM IMAGENS)
  if (result.rows.length < 4) {
    const remaining = 4 - result.rows.length;

    const fallback = await pool.query(
      `SELECT 
         p.*,
         COALESCE(
           (
             SELECT json_agg(
               json_build_object(
                 'id', pi.id,
                 'image_url', pi.image_url,
                 'sort_order', pi.sort_order
               ) ORDER BY pi.sort_order ASC
             )
             FROM product_images pi
             WHERE pi.product_id = p.id
           ), 
           '[]'::json
         ) AS images
       FROM products p
       WHERE p.deleted_at IS NULL
       AND p.id != $1
       AND p.brand_id = $2
       AND p.category_id != $3
       ORDER BY RANDOM()
       LIMIT $4`,
      [productId, product.brand_id, product.category_id, remaining],
    );

    return [...result.rows, ...fallback.rows].slice(0, 4);
  }

  return result.rows;
};

const getNewArrivals = async () => {
  const result = await pool.query(
    `SELECT 
       p.*,
       COALESCE(
         (
           SELECT json_agg(
             json_build_object(
               'id', pi.id,
               'image_url', pi.image_url,
               'sort_order', pi.sort_order
             ) ORDER BY pi.sort_order ASC
           )
           FROM product_images pi
           WHERE pi.product_id = p.id
         ), 
         '[]'::json
       ) AS images
     FROM products p
     WHERE p.deleted_at IS NULL
     ORDER BY p.created_at DESC
     LIMIT 8`,
  );

  return result.rows;
};

const getAllProductsForAdmin = async () => {
  const result = await pool.query(
    `SELECT * FROM products ORDER BY created_at DESC`,
  );

  return result.rows;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByIdForAdmin,
  updateProduct,
  deleteProduct,
  hardDeleteProduct,
  getProductStockAndPrice,
  updateProductStock,
  getSimilarProducts,
  getNewArrivals,
  getAllProductsForAdmin,
};

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
  } = data;

  const result = await pool.query(
    `INSERT INTO products (
      external_id, name, description, summary, sku,
      price, condition, stock,
      category_id, brand_id, status, is_active, created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, now())
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

      -- Compatibility
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'brand', cb2.name,
              'model', cm2.name,
              'year_start', pc2.year_start,
              'year_end', pc2.year_end
            )
          )
          FROM product_compatibility pc2
          JOIN car_brands cb2 ON cb2.id = pc2.carbrand_id
          JOIN car_models cm2 ON cm2.id = pc2.carmodel_id
          WHERE pc2.product_id = p.id
        ),
        '[]'::jsonb
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
    LEFT JOIN product_compatibility pc ON pc.product_id = p.id
    LEFT JOIN car_brands cb ON cb.id = pc.carbrand_id
    LEFT JOIN car_models cm ON cm.id = pc.carmodel_id

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

  // CAR YEAR
  if (filters.carYear) {
    query += `
      AND (
        (pc.year_start IS NULL OR pc.year_start <= $${index})
        AND
        (pc.year_end IS NULL OR pc.year_end >= $${index})
      )
    `;
    values.push(filters.carYear);
    index++;
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
               'brand', cb.name,
               'model', cm.name,
               'year_start', pc.year_start,
               'year_end', pc.year_end
             )
           )
           FROM product_compatibility pc
           JOIN car_brands cb ON pc.carbrand_id = cb.id
           JOIN car_models cm ON pc.carmodel_id = cm.id
           WHERE pc.product_id = p.id
         ), 
         '[]'::json
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

// UPDATE
const updateProduct = async (id, data) => {
  const {
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
  } = data;

  const result = await pool.query(
    `UPDATE products
     SET name = $1,
         description = $2,
         summary = $3,
         price = $4,
         condition = $5,
         stock = $6,
         category_id = $7,
         brand_id = $8,
         status = $9,
         is_active = $10,
         updated_at = NOW()
     WHERE id = $11
     RETURNING *`,
    [
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
    ],
  );

  return result.rows[0];
};

// SOFT DELETE
const deleteProduct = async (id) => {
  const result = await pool.query(
    `UPDATE products SET deleted_at = NOW() WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0];
};

const getProductStockAndPrice = async (product_id) => {
  const result = await pool.query(
    `SELECT stock, price FROM products WHERE id = $1`,
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
  updateProduct,
  deleteProduct,
  getProductStockAndPrice,
  updateProductStock,
  getSimilarProducts,
  getNewArrivals,
  getAllProductsForAdmin,
};

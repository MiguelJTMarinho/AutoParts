const cartRepository = require("../repository/cartRepository");
const productRepository = require("../repository/productRepository");
const pool = require("../config/db");

// ADD TO CART (merge + stock check)
const addToCart = async (user_id, product_id, quantity = 1) => {
  const cart = await cartRepository.getOrCreateCart(user_id);

  // get product
  const product = await productRepository.getProductById(product_id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const prod = product;

  // stock check
  if (prod.stock < quantity) {
    const error = new Error("Not enough stock");
    error.statusCode = 400;
    throw error;
  }

  // check if item exists
  const existing = await cartRepository.findItem(cart.id, product_id);

  if (existing && existing.quantity + quantity > prod.stock) {
    const error = new Error(
      `Cannot add ${quantity} items. Only ${prod.stock - existing.quantity} left in stock`,
    );
    error.statusCode = 400;
    throw error;
  }

  if (existing) {
    const updated = await cartRepository.increment(existing.id, quantity);
    return updated;
  }

  // create new item
  return await cartRepository.addItem(
    cart.id,
    product_id,
    quantity,
    prod.price,
  );
};

// GET CART WITH TOTALS
const getCart = async (user_id) => {
  const cart = await cartRepository.getOrCreateCart(user_id);
  const items = await cartRepository.getCartItems(cart.id);

  let total = 0;

  const enriched = items.map((item) => {
    const subtotal = item.quantity * item.price_at_time;
    total += subtotal;

    return {
      ...item,
      subtotal,
    };
  });

  return {
    cart_id: cart.id,
    items: enriched,
    total,
  };
};

// UPDATE QUANTITY (central method)
const updateQuantity = async (user_id, product_id, action, value = 1) => {
  const cart = await cartRepository.getOrCreateCart(user_id);

  const item = await cartRepository.findItem(cart.id, product_id);

  if (!item) {
    const error = new Error("Item not found in cart");
    error.statusCode = 404;
    throw error;
  }

  // GET STOCK
  const product = await pool.query(`SELECT stock FROM products WHERE id = $1`, [
    product_id,
  ]);

  const stock = product.rows[0].stock;

  let updated;

  switch (action) {
    case "increase":
      if (item.quantity + value > stock) {
        throw Object.assign(new Error("Not enough stock"), {
          statusCode: 400,
        });
      }

      updated = await cartRepository.increment(item.id, value);
      break;

    case "decrease":
      if (item.quantity - value <= 0) {
        return await cartRepository.removeItem(cart.id, product_id);
      }

      updated = await cartRepository.decrement(item.id, value);
      break;

    case "set":
      if (value <= 0) {
        return await cartRepository.removeItem(cart.id, product_id);
      }

      if (value > stock) {
        throw Object.assign(new Error("Not enough stock"), {
          statusCode: 400,
        });
      }

      updated = await cartRepository.setQuantity(item.id, value);
      break;

    default:
      const error = new Error("Invalid action");
      error.statusCode = 400;
      throw error;
  }

  return updated;
};

// REMOVE ITEM
const removeItem = async (user_id, product_id) => {
  const cart = await cartRepository.getOrCreateCart(user_id);

  const removed = await cartRepository.removeItem(cart.id, product_id);

  if (!removed) {
    const error = new Error("Item not found");
    error.statusCode = 404;
    throw error;
  }

  return removed;
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
};

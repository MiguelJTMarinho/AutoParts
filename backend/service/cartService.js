const cartRepository = require("../repository/cartRepository");
const productRepository = require("../repository/productRepository");
const pool = require("../config/db");

// ADD TO CART (merge + stock check)
const addToCart = async ({ user_id, guest_id, product_id, quantity }) => {
  const cart = await cartRepository.getOrCreateCart({ user_id, guest_id });

  const product = await productRepository.getProductById(product_id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (product.stock < quantity) {
    const error = new Error("Not enough stock");
    error.statusCode = 400;
    throw error;
  }

  const existing = await cartRepository.findItem(cart.id, product_id);

  if (existing) {
    if (existing.quantity + quantity > product.stock) {
      throw Object.assign(new Error("Stock exceeded"), {
        statusCode: 400,
      });
    }

    return await cartRepository.increment(existing.id, quantity);
  }

  return await cartRepository.addItem(
    cart.id,
    product_id,
    quantity,
    product.price,
  );
};

// GET CART WITH TOTALS
const getCart = async ({ user_id, guest_id }) => {
  const cart = await cartRepository.getOrCreateCart({ user_id, guest_id });

  const items = await cartRepository.getCartItems(cart.id);

  const itemsWithSubtotal = items.map((item) => ({
    ...item,
    subtotal: item.quantity * item.price_at_time,
  }));

  const total = itemsWithSubtotal.reduce((acc, item) => acc + item.subtotal, 0);

  return {
    cart_id: cart.id,
    items: itemsWithSubtotal,
    total,
  };
};

const updateItemQuantity = async ({
  user_id,
  guest_id,
  product_id,
  quantity,
}) => {
  if (quantity == null) {
    const error = new Error("Quantity is required");
    error.statusCode = 400;
    throw error;
  }

  if (quantity < 0) {
    const error = new Error("Quantity cannot be negative");
    error.statusCode = 400;
    throw error;
  }

  const cart = await cartRepository.getOrCreateCart({
    user_id,
    guest_id,
  });

  const product = await productRepository.getProductById(product_id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const item = await cartRepository.findItem(cart.id, product_id);

  // remove item if quantity = 0
  if (quantity === 0) {
    if (!item) return { message: "Item already not in cart" };

    await cartRepository.removeItem(cart.id, product_id);

    return { message: "Item removed" };
  }

  // stock validation
  if (quantity > product.stock) {
    const error = new Error("Not enough stock");
    error.statusCode = 400;
    throw error;
  }

  // create or update
  if (!item) {
    return await cartRepository.addItem({
      cart_id: cart.id,
      product_id,
      quantity,
      price_at_time: product.price,
    });
  }

  return await cartRepository.setQuantity(item.id, quantity);
};

// REMOVE ITEM
const removeItem = async ({ user_id, guest_id, product_id }) => {
  const cart = await cartRepository.getOrCreateCart({ user_id, guest_id });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const removed = await cartRepository.removeItem(cart.id, product_id);

  if (!removed) {
    const error = new Error("Item not found");
    error.statusCode = 404;
    throw error;
  }

  return removed;
};

const mergeCart = async ({ guest_id, user_id }) => {
  if (!user_id) {
    const error = new Error("User not authenticated");
    error.statusCode = 401;
    throw error;
  }

  if (!guest_id) {
    const userCart = await cartRepository.getOrCreateCart({
      user_id,
      guest_id: null,
    });

    return userCart;
  }

  const guestCart = await cartRepository.getOrCreateCart({
    user_id: null,
    guest_id,
  });

  if (!guestCart) {
    return cartRepository.getOrCreateCart({ user_id, guest_id: null });
  }

  const userCart = await cartRepository.getOrCreateCart({
    user_id,
    guest_id: null,
  });

  // If guest cart is empty
  const items = await cartRepository.getCartItems(guestCart.id);

  if (!items.length) {
    return userCart;
  }

  // 1. merge items
  for (const item of items) {
    const existing = await cartRepository.findItem(
      userCart.id,
      item.product_id,
    );

    if (existing) {
      await cartRepository.increment(existing.id, item.quantity);
    } else {
      await cartRepository.addItem(
        userCart.id,
        item.product_id,
        item.quantity,
        item.price_at_time,
      );
    }
  }

  // 2. delete guest cart items and Cart
  await cartRepository.deleteCartandItems(guestCart.id);

  return await cartRepository.getOrCreateCart({
    user_id,
    guest_id: null,
  });
};

module.exports = {
  addToCart,
  getCart,
  updateItemQuantity,
  removeItem,
  mergeCart,
};

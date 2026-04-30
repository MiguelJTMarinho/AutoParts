const orderRepository = require("../repository/orderRepository");
const cartRepository = require("../repository/cartRepository");
const productRepository = require("../repository/productRepository");
const pool = require("../config/db");

// CHECKOUT CART → ORDER
const createOrderFromCart = async (user_id) => {
  const cart = await cartRepository.getOrCreateCart(user_id);
  const items = await cartRepository.getCartItems(cart.id);

  if (!items.length) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  let total = 0;

  // STOCK CHECK FIRST
  for (const item of items) {
    const product = await productRepository.getProductStockAndPrice(
      item.product_id,
    );

    const p = product;

    if (!p || p.stock < item.quantity) {
      const error = new Error(
        `Insufficient stock for product ${item.product_id}`,
      );
      error.statusCode = 400;
      throw error;
    }

    total += item.quantity * item.price_at_time;
  }

  // CREATE ORDER
  const order = await orderRepository.createOrder(user_id, total, "paid");

  // CREATE ITEMS + DECREMENT STOCK
  for (const item of items) {
    const product = await productRepository.getProductStockAndPrice(
      item.product_id,
    );

    const p = product;

    await orderRepository.addOrderItem(
      order.id,
      item.product_id,
      item.quantity,
      item.price_at_time,
    );

    // update stock
    await productRepository.updateProductStock(
      item.product_id,
      p.stock - item.quantity,
    );
  }

  await cartRepository.clearCart(cart.id);

  return order;
};

// GET ORDERS
const getUserOrders = async (user_id) => {
  return await orderRepository.getOrdersByUser(user_id);
};

// GET ORDER DETAILS
const getOrderDetails = async (order_id) => {
  const items = await orderRepository.getOrderItems(order_id);

  let total = 0;

  const enriched = items.map((i) => {
    const subtotal = i.quantity * i.price_at_purchase;
    total += subtotal;

    return {
      ...i,
      subtotal,
    };
  });

  return {
    order_id,
    items: enriched,
    total,
  };
};

module.exports = {
  createOrderFromCart,
  getUserOrders,
  getOrderDetails,
};

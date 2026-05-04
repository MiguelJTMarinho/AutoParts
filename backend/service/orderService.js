const orderRepository = require("../repository/orderRepository");
const cartRepository = require("../repository/cartRepository");
const productRepository = require("../repository/productRepository");
const pool = require("../config/db");

// CHECKOUT CART → ORDER
const createOrderFromCart = async (userId) => {
  const cart = await cartRepository.getOrCreateCart({
    user_id: userId,
    guest_id: null,
  });
  const items = await cartRepository.getCartItems(cart.id);

  if (!items.length) {
    const error = new Error(`Cart is empty: ${cart.id}`);
    error.statusCode = 400;
    throw error;
  }

  let total = 0;

  // CHECK STOCK + CALCULATE TOTAL
  for (const item of items) {
    const product = await productRepository.getProductStockAndPrice(
      item.product_id,
    );

    if (!product || product.stock < item.quantity) {
      const error = new Error(
        `Insufficient stock for product ${item.product_id} in cart ${cart.id}`,
      );
      error.statusCode = 400;
      throw error;
    }

    total += item.quantity * item.price_at_time;
  }

  // CREATE ORDER
  const order = await orderRepository.createOrder(userId, total, "pending");

  return [order, items];
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

// Update order status
const updateOrderStatus = async (order_id, status) => {
  // validar status
  const validStatus = [
    "pending",
    "paid",
    "shipped",
    "delivered",
    "cancelled",
    "failed",
  ];

  if (!validStatus.includes(status)) {
    const error = new Error("Invalid status");
    error.statusCode = 400;
    throw error;
  }

  // verificar se order existe
  const order = await orderRepository.getOrderById(order_id);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  // opcional: regras de transição (boa prática)
  if (order.status === "cancelled") {
    throw Object.assign(new Error("Cannot update cancelled order"), {
      statusCode: 400,
    });
  }

  return await orderRepository.updateOrderStatus(order_id, status);
};

module.exports = {
  createOrderFromCart,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
};

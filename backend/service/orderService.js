const orderRepository = require("../repository/orderRepository");
const cartRepository = require("../repository/cartRepository");
const productRepository = require("../repository/productRepository");
const shippingRateRepository = require("../repository/shippingRateRepository");
const pool = require("../config/db");

// CHECKOUT CART → ORDER
const createOrderFromCart = async (userId, checkoutData) => {
  const { nif, email, name, shipping_method = "Standard" } = checkoutData;

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

  let subtotal = 0;
  let total_weight = 0;

  // CHECK STOCK + CALCULATE TOTAL & WEIGHT
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

    subtotal += item.quantity * item.price_at_time;
    total_weight += item.quantity * (Number(product.weight_kg) || 0);
  }

  // CALCULATE SHIPPING FEES
  let shipping_price = 0;
  if (total_weight >= 0) {
    const rate = await orderRepository.getShippingRateByWeight(total_weight);

    if (rate) {
      shipping_price = Number(rate.price);
    } else {
      // WHEIGHT > 50kg
      shippingRate = await shippingRateRepository.getMaxPrice();
      shipping_price = Number(shippingRate.maxprice);
    }
  }

  const grand_total = subtotal + shipping_price;
  let finalNif = nif;
  let finalEmail = email;
  let finalName = name;
  if (!finalNif) {
    const user = await userRepository.findUserById(userId);
    finalNif = user?.nif || null;
    finalEmail = user?.email || email;
    finalName = user?.first_name + " " + user?.last_name || name;
  }

  // CREATE ORDER
  const order = await orderRepository.createOrder({
    user_id: userId,
    total: grand_total,
    status: "pending",
    nif: finalNif,
    shipping_price: shipping_price,
    shipping_weight: total_weight,
    shipping_method: shipping_method,
    email: finalEmail,
    name: finalName,
  });

  // ADD ITEMS TO ORDER
  for (const item of items) {
    await orderRepository.addOrderItem(
      order.id,
      item.product_id,
      item.quantity,
      item.price_at_time,
    );
  }

  // CLEAR CART
  await cartRepository.clearCart(cart.id);

  return [order, items];
};

// GET ORDERS
const getUserOrders = async (user_id) => {
  return await orderRepository.getOrdersByUser(user_id);
};

// GET ORDER DETAILS
const getOrderDetails = async (order_id) => {
  const items = await orderRepository.getOrderItems(order_id);
  const order = await orderRepository.getOrderById(order_id);

  let total = order.total;

  const enriched = items.map((i) => {
    return {
      ...i,
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

// Get all orders (admin only)
const getAllOrders = async () => {
  return await orderRepository.getAllOrders();
};

module.exports = {
  createOrderFromCart,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  getAllOrders,
};

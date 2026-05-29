const orderRepository = require("../repository/orderRepository");
const cartRepository = require("../repository/cartRepository");
const productRepository = require("../repository/productRepository");
const shippingRateRepository = require("../repository/shippingRateRepository");
const userRepository = require("../repository/userRepository");
const pool = require("../config/db");

// CHECKOUT CART → ORDER
const createOrderFromCart = async (userId, checkoutData) => {
  const {
    nif,
    email,
    name,
    phone_number,
    shipping_method,
    address_line_1,
    address_line_2,
    city,
    country,
    postal_code = "Standard",
    paypal_order_id,
  } = checkoutData;

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
    const rate =
      await shippingRateRepository.getShippingRateByWeight(total_weight);

    if (rate) {
      shipping_price = Number(rate.price);
    } else {
      // WHEIGHT > 50kg
      const shippingRate = await shippingRateRepository.getMaxPrice();
      shipping_price = Number(shippingRate.max || 0);
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

  // 🚨 VALIDAÇÃO DE PAGAMENTO (SERVER-SIDE)
  // NOTA: Num ambiente real de produção, deves usar o SDK do PayPal aqui (no backend)
  // para validar se o `paypal_order_id` existe, se o status na API deles é "COMPLETED"
  // e se o valor cobrado corresponde exatamente à variável `grand_total` acima!
  // Por agora, evitamos que o cliente decida o status e baseamo-nos na receção do ID.
  const orderStatus = paypal_order_id ? "paid" : "pending";

  // CREATE ORDER
  const order = await orderRepository.createOrder({
    user_id: userId,
    total: grand_total,
    status: orderStatus,
    nif: finalNif,
    shipping_price: shipping_price,
    shipping_weight: total_weight,
    shipping_method: shipping_method,
    email: finalEmail,
    name: finalName,
    phone_number: phone_number,
    address_line_1: address_line_1,
    address_line_2: address_line_2,
    city: city,
    country: country,
    postal_code: postal_code,
  });

  // ADD ITEMS TO ORDER
  for (const item of items) {
    await orderRepository.addOrderItem(
      order.id,
      item.product_id,
      item.quantity,
      item.price_at_time,
      item.image_url || item.image,
    );

    // DESCER STOCK DE CADA PRODUTO NA BASE DE DADOS
    const product = await productRepository.getProductStockAndPrice(
      item.product_id,
    );
    await productRepository.updateProductStock(
      item.product_id,
      product.stock - item.quantity,
    );
  }

  // CLEAR CART
  await cartRepository.clearCart(cart.id);

  return [order, items];
};

// GET ORDERS
const getUserOrders = async (user_id) => {
  const orders = await orderRepository.getOrdersByUser(user_id);

  // Enriquecer cada encomenda com os seus respetivos itens
  const enrichedOrders = await Promise.all(
    orders.map(async (order) => {
      const items = await orderRepository.getOrderItems(order.id);
      return { ...order, items };
    }),
  );

  return enrichedOrders;
};

// GET ORDER DETAILS
const getOrderDetails = async (order_id) => {
  const items = await orderRepository.getOrderItems(order_id);
  const order = await orderRepository.getOrderById(order_id);

  return {
    ...order,
    items,
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
  const orders = await orderRepository.getAllOrders();

  const enrichedOrders = await Promise.all(
    orders.map(async (order) => {
      const items = await orderRepository.getOrderItems(order.id);
      return { ...order, items };
    }),
  );

  return enrichedOrders;
};

module.exports = {
  createOrderFromCart,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  getAllOrders,
};

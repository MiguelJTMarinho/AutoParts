const paymentRepository = require("../repository/paymentRepository");
const orderRepository = require("../repository/orderRepository");
const productRepository = require("../repository/productRepository");
const cartRepository = require("../repository/cartRepository");

// SIMULAÇÃO PAYPAL CALLBACK / CONFIRM
const confirmPayment = async (order_id, amount, provider, status) => {
  const order = await orderRepository.getOrderById(order_id);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const payment = await paymentRepository.createPayment(
    order_id,
    amount,
    provider,
    status,
  );
  if (status !== "success") {
    const error = new Error("Payment failed");
    error.statusCode = 400;
    throw error;
  }

  await orderRepository.updateOrderStatus(order_id, "paid");

  // Update Stock + Clear Cart
  const items = await orderRepository.getOrderItems(order_id);

  for (const item of items) {
    const product = await productRepository.getProductStockAndPrice(
      item.product_id,
    );

    await productRepository.updateProductStock(
      item.product_id,
      product.stock - item.quantity,
    );
  }

  return payment;
};

module.exports = {
  confirmPayment,
};

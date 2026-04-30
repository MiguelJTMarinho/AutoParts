const paymentRepository = require("../repository/paymentRepository");
const orderRepository = require("../repository/orderRepository");
const orderRepository = require("../repository/orderRepository");

// CREATE PAYMENT (checkout start)
const createPayment = async (order_id) => {
  const order = await orderRepository.getOrdersByUser; // opcional validação

  if (!order_id) {
    const error = new Error("order_id is required");
    error.statusCode = 400;
    throw error;
  }

  // ideal: validar order existe + total
  const payment = await paymentRepository.createPayment(order_id, order.total);

  return payment;
};

// SUCCESS PAYMENT (PayPal callback simulation)
const confirmPayment = async (payment_id) => {
  const payment = await paymentRepository.updateStatus(payment_id, "paid");

  // update order status
  await orderRepository.updateOrderStatus(payment.order_id, "paid");

  return payment;
};

// FAIL PAYMENT
const failPayment = async (payment_id) => {
  return await paymentRepository.updateStatus(payment_id, "failed");
};

module.exports = {
  createPayment,
  confirmPayment,
  failPayment,
};

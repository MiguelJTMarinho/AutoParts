import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const OrderConfirmation = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderId = new URLSearchParams(location.search).get("orderId");

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const config = { withCredentials: true };
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
          config,
        );
        setCheckout(data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const calculateEstimatedDelivery = (created_At) => {
    const orderDate = new Date(created_At);
    orderDate.setDate(orderDate.getDate() + 10); // Add 10 days to the order date
    return orderDate.toLocaleDateString(i18n.language);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white text-center">
        A carregar...
      </div>
    );
  }

  if (error || !checkout) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Error loading order
        </h2>
        <p>{error || "Order not found."}</p>
        <Link
          to="/"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const orderItems = checkout.items || checkout.order_items || [];
  const order = checkout.order || checkout;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-6">
        {t("orderConfirmation.title")}
      </h1>
      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="flex flex-col md:flex-row justify-between mb-20 gap-4">
            {/* Order ID and Date */}
            <div>
              <h2 className="text-xl font-semibold">
                {t("orderConfirmation.orderId")}: #{order.id}
              </h2>
              <p className="text-gray-500">
                {t("orderConfirmation.orderDate")}:{" "}
                {new Date(order.created_at).toLocaleDateString(i18n.language)}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700 text-sm">
                {t("orderConfirmation.estimatedDelivery")}:{" "}
                {calculateEstimatedDelivery(order.created_at)}
              </p>
            </div>
          </div>
          {/* Order Items */}
          <div className="mb-20">
            {orderItems.map((item) => {
              const product = item.product || {};
              const imgUrl =
                item.image_url ||
                product.images?.[0]?.image_url ||
                "https://placehold.co/200x240?text=No+Image";
              return (
                <div
                  key={item.product_id || item.id}
                  className="flex items-center mb-4 border-b pb-4"
                >
                  <img
                    src={imgUrl}
                    alt={product.name || `Product ${item.product_id}`}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h4 className="text-md font-semibold">
                      {item.name || `Product #${item.product_id}`}
                    </h4>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-md">
                      €
                      {Number(
                        item.price_at_purchase || item.price || 0,
                      ).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("orderConfirmation.quantity")}: {item.quantity}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-3 gap-8">
            {/* Payment Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">
                {t("orderConfirmation.paymentTitle")}
              </h4>
              <p className="text-gray-600">PayPal</p>
              <p className="text-gray-600">
                {t("orderConfirmation.total")}: {order.total} €
              </p>
            </div>
            {/* Delivery Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">
                {t("orderConfirmation.deliveryTitle")}
              </h4>
              <p className="text-gray-600">{order.name || "N/A"}</p>
              <p className="text-gray-600">
                {order.shipping_method || "Standard Delivery"}
              </p>
            </div>
            {/* Order Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">
                {t("orderConfirmation.addressTitle")}
              </h4>
              <p className="text-gray-600">
                {order.address_line_1} {order.address_line_2}
              </p>
              <p className="text-gray-600">
                {order.postal_code} {order.city}, {order.country}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8 text-center">
        <Link
          to="/my-orders"
          className="text-main-blue hover:underline font-medium"
        >
          {t("orderDetailsPage.backLink")}
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;

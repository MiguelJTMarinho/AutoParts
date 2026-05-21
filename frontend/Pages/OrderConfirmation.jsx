import React from "react";
import { useTranslation } from "react-i18next";

const checkout = {
  _id: "123123",
  createdAt: new Date(),
  checkoutItems: [
    {
      productId: 1,
      name: "RIDEX 854S0720 Amortecedor para FORD FOCUS, C-MAX",
      category: "Suspension",
      make: "Ford",
      model: "Focus",
      quantity: 1,
      price: 50,
      image: "https://picsum.photos/200?random=1",
    },
    {
      productId: 2,
      name: "Amortecedor para FORD Fiesta, C-MAX",
      category: "Suspension",
      make: "Ford",
      model: "Fiesta",
      quantity: 1,
      price: 45,
      image: "https://picsum.photos/200?random=2",
    },
  ],
  shippingAddress: {
    address: "123 Fashion Street",
    city: "Porto",
    country: "Portugal",
  },
};

const OrderConfirmation = () => {
  const { t, i18n } = useTranslation();

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // Add 10 days to the order date
    return orderDate.toLocaleDateString(i18n.language);
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-6">
        {t("orderConfirmation.title")}
      </h1>
      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            {/* Order ID and Date */}
            <div>
              <h2 className="text-xl font-semibold">
                {t("orderConfirmation.orderId")}: {checkout._id}
              </h2>
              <p className="text-gray-500">
                {t("orderConfirmation.orderDate")}:{" "}
                {new Date(checkout.createdAt).toLocaleDateString(i18n.language)}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700 text-sm">
                {t("orderConfirmation.estimatedDelivery")}:{" "}
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* Order Items */}
          <div className="mb-20">
            {checkout.checkoutItems.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.make} {item.model}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md">€{item.price}</p>
                  <p className="text-sm text-gray-500">
                    {t("orderConfirmation.quantity")}: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-2 gap-8">
            {/* Payment Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">
                {t("orderConfirmation.paymentTitle")}
              </h4>
              <p className="text-gray-600">Paypal</p>
            </div>
            {/* Delivery Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">
                {t("orderConfirmation.deliveryTitle")}
              </h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;

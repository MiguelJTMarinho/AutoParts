import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OrderDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const mockOrderDetails = {
      _id: id,
      createdAt: new Date(),
      isPaid: true,
      isDelivered: false,
      paymentMethod: "Paypal",
      shippingMethod: "Standard",
      ShippingAddress: { city: "Porto", country: "Portugal" },
      orderItems: [
        {
          productId: "1",
          name: "RIDEX 854S0720 Amortecedor para FORD FOCUS, C-MAX",
          category: "Suspension",
          make: "Ford",
          model: "Focus",
          quantity: "1",
          price: "50",
          image: "https://picsum.photos/200?random=1",
        },
        {
          productId: "2",
          name: "Amortecedor para FORD Fiesta, C-MAX",
          category: "Suspension",
          make: "Ford",
          model: "Fiesta",
          quantity: "1",
          price: "45",
          image: "https://picsum.photos/200?random=2",
        },
      ],
    };
    setOrderDetails(mockOrderDetails);
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        {t("orderDetailsPage.title")}
      </h2>
      {!orderDetails ? (
        <p>{t("orderDetailsPage.notFound")}</p>
      ) : (
        // Order Info
        <div className="p-4 sm:p-6 rounded-lg border">
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                {" "}
                {t("orderDetailsPage.orderId")}: #{orderDetails._id}
              </h3>
              <p className="text-gray-600">
                {new Date(orderDetails.createdAt).toLocaleDateString(
                  i18n.language,
                )}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <span
                className={`${orderDetails.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isPaid
                  ? t("orderStatus.approved")
                  : t("orderStatus.pending")}
              </span>
              <span
                className={`${orderDetails.isDelivered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isDelivered
                  ? t("orderStatus.delivered")
                  : t("orderStatus.pending")}
              </span>
            </div>
          </div>
          {/* Customerm, Payment, Shipping info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">
                {t("orderDetailsPage.paymentInfo.title")}
              </h4>
              <p>
                {t("orderDetailsPage.paymentInfo.method")}:{" "}
                {orderDetails.paymentMethod}
              </p>
              <p>
                {t("orderDetailsPage.paymentInfo.status")}:{" "}
                {orderDetails.isPaid
                  ? t("orderStatus.paid")
                  : t("orderStatus.unpaid")}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">
                {t("orderDetailsPage.shippingInfo.title")}
              </h4>
              <p>
                {t("orderDetailsPage.shippingInfo.method")}:{" "}
                {orderDetails.shippingMethod}
              </p>
              <p>
                {t("orderDetailsPage.shippingInfo.address")}:{" "}
                {`${orderDetails.ShippingAddress.city}, ${orderDetails.ShippingAddress.country}`}
              </p>
            </div>
          </div>
          {/* Product List */}
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4">
              {t("orderDetailsPage.productsList.title")}
            </h4>
            <table className="min-w-full text-gray-600 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4">
                    {t("orderDetailsPage.productsList.name")}
                  </th>
                  <th className="py-2 px-4">
                    {t("orderDetailsPage.productsList.unitPrice")}
                  </th>
                  <th className="py-2 px-4">
                    {t("orderDetailsPage.productsList.quantity")}
                  </th>
                  <th className="py-2 px-4">
                    {t("orderDetailsPage.productsList.total")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-2 px-4 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-500 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4">€{item.price}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">€{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Back to orders Link */}
          <Link to="/my-orders" className="text-blue-500 hover:underline">
            {t("orderDetailsPage.backLink")}
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;

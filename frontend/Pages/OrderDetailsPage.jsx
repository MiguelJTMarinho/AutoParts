import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const OrderDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const config = { withCredentials: true };
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/${id}`,
          config,
        );
        setOrderDetails(data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-4 sm:p-6">A carregar...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex w-full justify-end">
          <Link
            to="/my-orders"
            className="mr-4 px-6 py-2.5 rounded-lg bg-main-blue text-white font-semibold hover:opacity-90 cursor-pointer"
          >
            <h2>{t("myOrdersPage.backButton")}</h2>
          </Link>
        </div>
      </div>
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
                {t("orderDetailsPage.orderId")}: #{orderDetails.id}
              </h3>
              <p className="text-gray-600">
                {new Date(orderDetails.created_at).toLocaleDateString(
                  i18n.language,
                )}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <span
                className={`${
                  ["paid", "shipped", "delivered"].includes(orderDetails.status)
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {t(`orderStatus.${orderDetails.status}`, orderDetails.status)}
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
                {t(`orderStatus.${orderDetails.status}`, orderDetails.status)}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">
                {t("orderDetailsPage.shippingInfo.title")}
              </h4>
              <p>
                {t("orderDetailsPage.shippingInfo.method")}:{" "}
                {orderDetails.shipping_method || "N/A"}
              </p>
              <p>
                {t("orderDetailsPage.shippingInfo.address")}:{" "}
                {orderDetails.address_line_1 || "N/A"}
              </p>
              <p>
                {t("orderDetailsPage.shippingInfo.address2")}:{" "}
                {orderDetails.address_line_2 || "N/A"}
              </p>
              <p>
                {t("orderDetailsPage.shippingInfo.info")}:{" "}
                {orderDetails.postal_code || "N/A"} {orderDetails.city || "N/A"}{" "}
                {orderDetails.country || "N/A"}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">
                {t("orderDetailsPage.userInformation.title")}
              </h4>
              <p>
                {t("orderDetailsPage.userInformation.name")}:{" "}
                {orderDetails.name || "N/A"}
              </p>
              <p>
                {t("orderDetailsPage.userInformation.email")}:{" "}
                {orderDetails.email || "N/A"}
              </p>
              <p>
                {t("orderDetailsPage.userInformation.nif")}:{" "}
                {orderDetails.nif || "N/A"}
              </p>
              <p>
                {t("orderDetailsPage.userInformation.phoneNumber")}:{" "}
                {orderDetails.phone_number || "N/A"}
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
                  <th className="py-2 px-4 text-left">
                    {t("orderDetailsPage.productsList.name")}
                  </th>
                  <th className="py-2 px-4 text-left">
                    {t("orderDetailsPage.productsList.unitPrice")}
                  </th>
                  <th className="py-2 px-4 text-left">
                    {t("orderDetailsPage.productsList.quantity")}
                  </th>
                  <th className="py-2 px-4 text-left">
                    {t("orderDetailsPage.productsList.total")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(orderDetails.items || orderDetails.order_items || []).map(
                  (item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-4 flex items-center">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name || "Product"}
                            className="w-12 h-12 object-cover rounded-lg mr-4"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                        )}
                        <Link
                          to={`/product/${item.product_id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {item.name || `Product #${item.product_id}`}
                        </Link>
                      </td>
                      <td className="py-2 px-4">
                        €{Number(item.price_at_purchase || 0).toFixed(2)}
                      </td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4">
                        €
                        {(
                          Number(item.price_at_purchase || 0) * item.quantity
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          {/* Back to orders Link */}
          {/* <Link to="/my-orders" className="text-blue-500 hover:underline">
            {t("orderDetailsPage.backLink")}
          </Link> */}
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;

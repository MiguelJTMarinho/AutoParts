import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const MyOrdersPage = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { withCredentials: true };
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders`,
          config,
        );
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleRowClick = (orderId) => navigate(`/order/${orderId}`);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex w-full justify-end">
          <Link
            to="/profile"
            className="mr-4 px-6 py-2.5 rounded-lg bg-main-blue text-white font-semibold hover:opacity-90 cursor-pointer"
          >
            <h2>{t("myOrdersPage.backButton")}</h2>
          </Link>
        </div>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mb-6">
        {t("myOrdersPage.title")}
      </h2>
      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-2 px-4 sm:py-3">
                {t("myOrdersPage.table.image")}
              </th>
              <th className="py-2 px-4 sm:py-3">
                {t("myOrdersPage.table.orderId")}
              </th>
              <th className="py-2 px-4 sm:py-3">
                {t("myOrdersPage.table.created")}
              </th>
              <th className="py-2 px-4 sm:py-3">
                {t("myOrdersPage.table.shippingAddress")}
              </th>
              <th className="py-2 px-4 sm:py-3">
                {t("myOrdersPage.table.items")}
              </th>
              <th className="py-2 px-4 sm:py-3">
                {t("myOrdersPage.table.price")}
              </th>
              <th className="py-2 px-4 sm:py-3">
                {t("myOrdersPage.table.status")}
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const orderItems = order.items || order.order_items || [];
                const firstImage =
                  orderItems[0]?.image_url ||
                  orderItems[0]?.product?.images?.[0]?.image_url ||
                  "https://placehold.co/200x240?text=No+Image";

                return (
                  <tr
                    key={order.id}
                    onClick={() => handleRowClick(order.id)}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      {firstImage ? (
                        <img
                          src={firstImage}
                          alt="Product"
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"></div>
                      )}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                      #{order.id}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      {new Date(order.created_at).toLocaleDateString(
                        i18n.language,
                      )}{" "}
                      {new Date(order.created_at).toLocaleTimeString(
                        i18n.language,
                      )}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      {order.shipping_method ||
                        t("myOrdersPage.table.notAvailable")}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      {orderItems.length}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      €{Number(order.total).toFixed(2)}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      <span
                        className={`${
                          ["paid", "shipped", "delivered"].includes(
                            order.status,
                          )
                            ? "bg-green-100 text-green-700"
                            : ["cancelled", "failed"].includes(order.status)
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        } px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                      >
                        {t(`orderStatus.${order.status}`, order.status)}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  {loading ? "A carregar..." : t("myOrdersPage.table.noOrders")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;

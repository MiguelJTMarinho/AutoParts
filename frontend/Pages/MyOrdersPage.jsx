import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  shipped: "bg-green-100 text-green-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
};

const MyOrdersPage = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders`,
          { withCredentials: true },
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

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">
          {t("myOrdersPage.title")}
        </h2>
        <Link
          to="/profile"
          className="px-5 py-2 rounded-lg bg-main-blue text-white text-sm font-semibold hover:opacity-90"
        >
          {t("myOrdersPage.backButton")}
        </Link>
      </div>

      <div className="shadow-md sm:rounded-lg overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">{t("myOrdersPage.table.image")}</th>
              <th className="py-3 px-4">{t("myOrdersPage.table.orderId")}</th>
              <th className="py-3 px-4 hidden sm:table-cell">
                {t("myOrdersPage.table.created")}
              </th>
              <th className="py-3 px-4 hidden md:table-cell">
                {t("myOrdersPage.table.shippingAddress")}
              </th>
              <th className="py-3 px-4 hidden sm:table-cell">
                {t("myOrdersPage.table.items")}
              </th>
              <th className="py-3 px-4">{t("myOrdersPage.table.price")}</th>
              <th className="py-3 px-4">{t("myOrdersPage.table.status")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const orderItems = order.items || order.order_items || [];
                const firstImage =
                  orderItems[0]?.image_url ||
                  orderItems[0]?.product?.images?.[0]?.image_url ||
                  null;

                return (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      {firstImage ? (
                        <img
                          src={firstImage}
                          alt="Product"
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                      #{order.id}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap hidden sm:table-cell">
                      {new Date(order.created_at).toLocaleDateString(
                        i18n.language,
                      )}
                      <span className="text-gray-400 ml-1 text-xs">
                        {new Date(order.created_at).toLocaleTimeString(
                          i18n.language,
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {order.shipping_method ||
                        t("myOrdersPage.table.notAvailable")}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      {orderItems.length}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                      €{Number(order.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[order.status] || "bg-yellow-100 text-yellow-700"}`}
                      >
                        {t(`orderStatus.${order.status}`, order.status)}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  {loading
                    ? t("myOrdersPage.loading", "Loading…")
                    : t("myOrdersPage.table.noOrders")}
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

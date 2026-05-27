import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchAdminOrders, updateOrderStatus } from "../../redux/slices/admin/adminOrderSlice";

const OrderManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const { orders, loading, error } = useSelector((state) => state.adminOrders);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  const filteredOrders = orders?.filter((order) => {
    if (searchQuery.trim() === "") return true;
    const query = searchQuery.toLowerCase();
    
    // Convert to strings securely to prevent type errors
    const matchId = order.id?.toString().toLowerCase().includes(query);
    const matchUserId = order.user_id?.toString().toLowerCase().includes(query);
    const matchUsername = order.username?.toLowerCase().includes(query);
    
    return matchId || matchUserId || matchUsername;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">{t("orderManagement.title")}</h2>
        <div className="flex flex-1 justify-end items-center gap-4">
          <input
            type="text"
            placeholder={t("orderManagement.searchPlaceholder", "Search by ID or customer...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500 bg-white min-w-[200px]"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">
                {t("orderManagement.table.orderId")}
              </th>
              <th className="py-3 px-4">
                {t("orderManagement.table.customer")}
              </th>
              <th className="py-3 px-4">{t("orderManagement.table.total")}</th>
              <th className="py-3 px-4">{t("orderManagement.table.status")}</th>
              <th className="py-3 px-4">
                {t("orderManagement.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    {order.id}
                  </td>
                  <td className="p-4">{order.username || order.user?.name || order.user_id}</td>
                  <td className="p-4">€{Number(order.total || 0).toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      disabled={loading || order.status === "cancelled"}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:opacity-60"
                    >
                      <option value="pending">
                        {t("orderManagement.status.pending", "Pending")}
                      </option>
                      <option value="paid">
                        {t("orderManagement.status.paid", "Paid")}
                      </option>
                      <option value="shipped">
                        {t("orderManagement.status.shipped", "Shipped")}
                      </option>
                      <option value="delivered">
                        {t("orderManagement.status.delivered", "Delivered")}
                      </option>
                      <option value="cancelled">
                        {t("orderManagement.status.cancelled", "Cancelled")}
                      </option>
                      <option value="failed">
                        {t("orderManagement.status.failed", "Failed")}
                      </option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleStatusChange(order.id, "delivered")}
                      disabled={loading || order.status === "delivered" || order.status === "cancelled"}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-60"
                    >
                      {t("orderManagement.actions.markDelivered", "Mark Delivered")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  {loading ? t("orderManagement.loading", "Loading...") : t("orderManagement.noOrders")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;

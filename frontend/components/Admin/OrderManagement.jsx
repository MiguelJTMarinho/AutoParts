import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  fetchAdminOrders,
  updateOrderStatus,
} from "../../redux/slices/admin/adminOrderSlice";

const STATUS_FLOW = {
  pending: {
    next: "paid",
    label: "Mark as Paid",
    className: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  paid: {
    next: "shipped",
    label: "Mark as Shipped",
    className: "bg-orange-500 hover:bg-orange-600 text-white",
  },
  shipped: {
    next: "delivered",
    label: "Mark as Delivered",
    className: "bg-green-500 hover:bg-green-600 text-white",
  },
  delivered: { next: null, label: null, className: "" },
  cancelled: { next: null, label: null, className: "" },
  failed: { next: null, label: null, className: "" },
};

const OrderManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.adminOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = orders?.filter((order) => {
    if (searchQuery.trim() === "") return true;
    const query = searchQuery.toLowerCase();
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
            placeholder={t(
              "orderManagement.searchPlaceholder",
              "Search by ID or customer...",
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500 bg-white min-w-50"
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
              filteredOrders.map((order) => {
                const flow = STATUS_FLOW[order.status];
                return (
                  <React.Fragment key={order.id}>
                    <tr
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleExpand(order.id)}
                    >
                      <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                        {order.id}
                      </td>
                      <td className="p-4">
                        {order.username || order.user?.name || order.user_id}
                      </td>
                      <td className="p-4">
                        €{Number(order.total || 0).toFixed(2)}
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
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
                            {t("orderManagement.status.canceled", "Canceled")}
                          </option>
                          <option value="failed">
                            {t("orderManagement.status.failed", "Failed")}
                          </option>
                        </select>
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        {flow?.next ? (
                          <button
                            onClick={() =>
                              handleStatusChange(order.id, flow.next)
                            }
                            disabled={loading}
                            className={`px-4 py-2 rounded disabled:opacity-60 whitespace-nowrap transition-colors ${flow.className}`}
                          >
                            {flow.label}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan="5" className="p-4">
                          <div className="font-semibold mb-2 text-gray-800">
                            {t("orderManagement.itemsTitle")}:
                          </div>
                          <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full text-sm text-left text-gray-500">
                              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                                <tr>
                                  <th className="px-4 py-2">
                                    {t("orderManagement.items.image", "Image")}
                                  </th>
                                  <th className="px-4 py-2">
                                    {t(
                                      "orderManagement.items.productName",
                                      "Product",
                                    )}
                                  </th>
                                  <th className="px-4 py-2">
                                    {t(
                                      "orderManagement.items.quantity",
                                      "Quantity",
                                    )}
                                  </th>
                                  <th className="px-4 py-2">
                                    {t(
                                      "orderManagement.items.unitPrice",
                                      "Unit Price",
                                    )}
                                  </th>
                                  <th className="px-4 py-2">
                                    {t("orderManagement.items.total", "Total")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items && order.items.length > 0 ? (
                                  order.items.map((item) => (
                                    <tr
                                      key={item.id}
                                      className="border-b bg-white"
                                    >
                                      <td className="px-4 py-2">
                                        {item.image_url ? (
                                          <img
                                            src={item.image_url}
                                            alt="Product"
                                            className="w-10 h-10 object-cover rounded"
                                          />
                                        ) : (
                                          <div className="w-10 h-10 bg-gray-200 rounded"></div>
                                        )}
                                      </td>
                                      <td className="px-4 py-2 font-medium text-gray-900">
                                        {item.name ||
                                          `Product #${item.product_id}`}
                                      </td>
                                      <td className="px-4 py-2">
                                        {item.quantity}
                                      </td>
                                      <td className="px-4 py-2">
                                        €
                                        {Number(
                                          item.price_at_purchase || 0,
                                        ).toFixed(2)}
                                      </td>
                                      <td className="px-4 py-2 font-medium">
                                        €
                                        {(
                                          Number(item.price_at_purchase || 0) *
                                          item.quantity
                                        ).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="5"
                                      className="px-4 py-4 text-center text-gray-500"
                                    >
                                      {t(
                                        "orderManagement.items.noItems",
                                        "No items found",
                                      )}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          {(order.address_line_1 || order.email) && (
                            <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {order.email && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                    {t(
                                      "orderManagement.shipping.contact",
                                      "Contact",
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {order.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {order.email}
                                  </p>
                                  {order.phone_number && (
                                    <p className="text-sm text-gray-500">
                                      {order.phone_number}
                                    </p>
                                  )}
                                </div>
                              )}
                              {order.address_line_1 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                    {t(
                                      "orderManagement.shipping.address",
                                      "Shipping address",
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {order.address_line_1}
                                  </p>
                                  {order.address_line_2 && (
                                    <p className="text-sm text-gray-500">
                                      {order.address_line_2}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-500">
                                    {order.postal_code} {order.city},{" "}
                                    {order.country}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  {loading
                    ? t("orderManagement.loading", "Loading...")
                    : t("orderManagement.noOrders")}
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

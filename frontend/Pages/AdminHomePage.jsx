import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOrders } from "../redux/slices/admin/adminOrderSlice";
import { fetchAllProductsForAdmin } from "../redux/slices/admin/adminProductSlice";
import { fetchUsers } from "../redux/slices/admin/adminUsersSlice";

const AdminHomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
  } = useSelector((state) => state.adminOrders);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.adminProducts,
  );
  const { users, loading: usersLoading } = useSelector(
    (state) => state.adminUsers,
  );

  useEffect(() => {
    dispatch(fetchAdminOrders());
    dispatch(fetchAllProductsForAdmin());
    dispatch(fetchUsers());
  }, [dispatch]);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at || b.createdAt || 0) -
        new Date(a.created_at || a.createdAt || 0),
    )
    .slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t("adminHome.title", "Admin Dashboard")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 shadow-md rounded-lg bg-white border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-gray-700">
            {t("adminHome.revenue", "Revenue")}
          </h2>
          <p className="text-2xl font-bold text-gray-900">
            € {totalSales ? totalSales.toFixed(2) : "0.00"}
          </p>
        </div>

        <div className="p-4 shadow-md rounded-lg bg-white border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-gray-700">
            {t("adminHome.totalOrders", "Total Orders")}
          </h2>
          <p className="text-2xl font-bold text-gray-900">{totalOrders || 0}</p>
          <Link
            to="/admin/orders"
            className="text-blue-500 hover:underline text-sm mt-2 inline-block"
          >
            {t("adminHome.manageOrders", "Manage Orders")}
          </Link>
        </div>

        <div className="p-4 shadow-md rounded-lg bg-white border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-gray-700">
            {t("adminHome.totalProducts", "Total Products")}
          </h2>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          <Link
            to="/admin/products"
            className="text-blue-500 hover:underline text-sm mt-2 inline-block"
          >
            {t("adminHome.manageProducts", "Manage Products")}
          </Link>
        </div>

        <div className="p-4 shadow-md rounded-lg bg-white border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-gray-700">
            {t("adminHome.totalUsers", "Total Users")}
          </h2>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          <Link
            to="/admin/users"
            className="text-blue-500 hover:underline text-sm mt-2 inline-block"
          >
            {t("adminHome.manageUsers", "Manage Users")}
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {t("adminHome.recentOrders", "Recent Orders")}
        </h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b">
              <tr>
                <th className="py-3 px-4">
                  {t("adminHome.table.orderId", "Order ID")}
                </th>
                <th className="py-3 px-4">
                  {t("adminHome.table.orderDate", "Order Date")}
                </th>
                <th className="py-3 px-4">
                  {t("adminHome.table.user", "User")}
                </th>
                <th className="py-3 px-4">
                  {t("adminHome.table.totalPrice", "Total Price")}
                </th>
                <th className="py-3 px-4">
                  {t("adminHome.table.status", "Status")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordersLoading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <React.Fragment key={order.id || order._id}>
                  <tr
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleExpand(order.id)}
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">{order?.username || "Unknown User"}</td>
                    <td className="p-4 font-semibold text-gray-700">
                      €{" "}
                      {parseFloat(order.total || order.totalprice || 0).toFixed(
                        2,
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipped"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {t(`orderStatus.${order.status}`, order.status)}
                      </span>
                    </td>
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr className="bg-gray-50 border-b">
                      <td colSpan="5" className="p-4">
                        <div className="font-semibold mb-2 text-gray-800">{t("orderManagement.itemsTitle", "Order Items")}:</div>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                          <table className="min-w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                              <tr>
                                <th className="px-4 py-2">{t("orderManagement.items.image", "Image")}</th>
                                <th className="px-4 py-2">{t("orderManagement.items.productName", "Product")}</th>
                                <th className="px-4 py-2">{t("orderManagement.items.quantity", "Quantity")}</th>
                                <th className="px-4 py-2">{t("orderManagement.items.unitPrice", "Unit Price")}</th>
                                <th className="px-4 py-2">{t("orderManagement.items.total", "Total")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items && order.items.length > 0 ? (
                                order.items.map((item) => (
                                  <tr key={item.id} className="border-b bg-white">
                                    <td className="px-4 py-2">
                                      {item.image_url ? (
                                        <img src={item.image_url} alt="Product" className="w-10 h-10 object-cover rounded" />
                                      ) : (
                                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                                      )}
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-900">{item.name || `Product #${item.product_id}`}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">€{Number(item.price_at_purchase || 0).toFixed(2)}</td>
                                    <td className="px-4 py-2 font-medium">€{(Number(item.price_at_purchase || 0) * item.quantity).toFixed(2)}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">{t("orderManagement.items.noItems", "No items found")}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    {t("adminHome.table.noOrders", "No recent orders found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AdminHomePage = () => {
  const { t } = useTranslation();

  const orders = [
    {
      _id: 123123,
      user: {
        name: "John Doe",
      },
      totalprice: 110,
      status: "Processing",
    },
    {
      _id: 12321,
      user: {
        name: "John Doe 12",
      },
      totalprice: 1100,
      status: "Delivered",
    },
  ];
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("adminHome.title")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">{t("adminHome.revenue")}</h2>
          <p className="text-2xl">€ 10000</p>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">
            {t("adminHome.totalOrders")}
          </h2>
          <p className="text-2xl">200</p>
          <Link to="/admin/orders" className="text-blue-500 hover:underline">
            {t("adminHome.manageOrders")}
          </Link>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">
            {t("adminHome.totalProducts")}
          </h2>
          <p className="text-2xl">100</p>
          <Link to="/admin/products" className="text-blue-500 hover:underline">
            {t("adminHome.manageProducts")}
          </Link>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">
          {t("adminHome.recentOrders")}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">{t("adminHome.table.orderId")}</th>
                <th className="py-3 px-4">{t("adminHome.table.user")}</th>
                <th className="py-3 px-4">{t("adminHome.table.totalPrice")}</th>
                <th className="py-3 px-4">{t("adminHome.table.status")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user.name}</td>
                    <td className="p-4">€ {order.totalprice}</td>
                    <td className="p-4">{t(`orderStatus.${order.status}`)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    {t("adminHome.table.noOrders")}
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

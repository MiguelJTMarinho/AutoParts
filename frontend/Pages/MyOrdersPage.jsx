import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MyOrdersPage = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //Simulate Fetching orders
    setTimeout(() => {
      const mockOrders = [
        {
          _id: "12345",
          createdAt: new Date(),
          shippingAddress: { city: "Bragança", country: "Portugal" },
          orderItems: [
            {
              name: "Product 1",
              image: "https://picsum.photos/500/500?random=1",
            },
          ],
          totalPrice: 100,
          isPaid: true,
        },
        {
          _id: "6321",
          createdAt: new Date(),
          shippingAddress: { city: "Porto", country: "Portugal" },
          orderItems: [
            {
              name: "Product X",
              image: "https://picsum.photos/500/500?random=2",
            },
          ],
          totalPrice: 250,
          isPaid: false,
        },
      ];

      setOrders(mockOrders);
    }, 1000);
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
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b hover:border-gray50 cursor-pointer"
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {new Date(order.createdAt).toLocaleDateString(
                      i18n.language,
                    )}{" "}
                    {new Date(order.createdAt).toLocaleTimeString(
                      i18n.language,
                    )}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : t("myOrdersPage.table.notAvailable")}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.orderItems.length}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.totalPrice}€
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span
                      className={`${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                    >
                      {order.isPaid
                        ? t("myOrdersPage.paymentStatus.paid")
                        : t("myOrdersPage.paymentStatus.pending")}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  {t("myOrdersPage.table.noOrders")}
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

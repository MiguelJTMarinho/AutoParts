import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  deleteProduct,
  fetchAllProductsForAdmin,
  updateProduct,
} from "../../redux/slices/admin/adminProductSlice";

const ProductManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts,
  );

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAllProductsForAdmin());
  }, [dispatch]);

  const handleDeleteProduct = (id, action) => {
    if (action === "disable") {
      if (window.confirm(t("productManagement.alerts.confirmDisable"))) {
        dispatch(deleteProduct(id));
      }
    } else if (action === "delete") {
      if (window.confirm(t("productManagement.alerts.confirmDelete"))) {
        dispatch(deleteProduct(id));
      }
    }
  };

  const handleMarkAsSold = (id) => {
    dispatch(updateProduct({ id, productData: { status: "sold" } }));
  };

  const getStatusLabel = (status) => {
    if (!status) return "-";
    const normalizedStatus = status.toLowerCase();
    return t(`productManagement.status.${normalizedStatus}`, status);
  };

  const filteredProducts = products.filter(product => {
    if (filterStatus !== "all" && product.status?.toLowerCase() !== filterStatus) return false;
    if (searchQuery.trim() !== "" && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">{t("productManagement.title")}</h2>
        <div className="flex gap-3 items-center flex-wrap">
          <input
            type="text"
            placeholder={t("productManagement.filters.searchByName", "Search by name...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500 bg-white min-w-[200px]"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="all">{t("productManagement.filters.all", "All Statuses")}</option>
            <option value="active">{t("productManagement.status.active", "Active")}</option>
            <option value="reserved">{t("productManagement.status.reserved", "Reserved")}</option>
            <option value="sold">{t("productManagement.status.sold", "Sold")}</option>
            <option value="inactive">{t("productManagement.status.inactive", "Inactive")}</option>
          </select>
          <Link
            to="/admin/products/new"
            className="inline-flex w-fit items-center rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            {t("productManagement.form.addButton")}
          </Link>
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
              <th className="py-3 px-4">{t("productManagement.table.name")}</th>
              <th className="py-3 px-4">
                {t("productManagement.table.price")}
              </th>
              <th className="py-3 px-4">{t("productManagement.table.sku")}</th>
              <th className="py-3 px-4">
                {t("productManagement.table.status")}
              </th>
              <th className="py-3 px-4">
                {t("productManagement.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="p-4">{product.price}</td>
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">{getStatusLabel(product.status)}</td>
                  <td className="p-4">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="bg-yellow-500 px-3 py-2 rounded mr-2 hover:bg-yellow-600 text-white"
                    >
                      {t("productManagement.buttons.edit")}
                    </Link>
                    <button
                      onClick={() => handleMarkAsSold(product.id)}
                      disabled={
                        loading ||
                        product.status?.toLowerCase() === "sold" ||
                        product.status?.toLowerCase() === "inactive"
                      }
                      className="bg-blue-500 text-white py-1 px-2 hover:bg-blue-600 rounded cursor-pointer disabled:opacity-60 mr-2"
                    >
                      {t("productManagement.buttons.markSold")}
                    </button>

                    {product.status?.toLowerCase() !== "inactive" ? (
                      <button
                        onClick={() =>
                          handleDeleteProduct(product.id, "disable")
                        }
                        disabled={loading}
                        className="bg-orange-500 text-white py-1 px-2 hover:bg-orange-600 rounded cursor-pointer disabled:opacity-60"
                      >
                        {t("productManagement.buttons.disable")}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleDeleteProduct(product.id, "delete")
                        }
                        disabled={loading}
                        className="bg-red-500 text-white py-1 px-2 hover:bg-red-600 rounded cursor-pointer disabled:opacity-60"
                      >
                        {t("productManagement.buttons.delete")}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  {loading
                    ? t("productManagement.loading")
                    : t("productManagement.noProducts")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;

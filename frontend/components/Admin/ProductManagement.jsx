import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductManagement = () => {
  const { t } = useTranslation();

  const products = [
    {
      _id: 1,
      name: "Product 1",
      price: 100,
      sku: "12312312312",
    },
  ];

  const handleDeleteProduct = (id) => {
    if (window.confirm(t("productManagement.alerts.confirmDelete"))) {
      console.log("Deleting product with ID: ", id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {t("productManagement.title")}
      </h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className=" min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">{t("productManagement.table.name")}</th>
              <th className="py-3 px-4">
                {t("productManagement.table.price")}
              </th>
              <th className="py-3 px-4">{t("productManagement.table.sku")}</th>
              <th className="py-3 px-4">
                {t("productManagement.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="p-4">{product.price}</td>
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-yellow-500 px-3 py-2 rounded mr-2 hover:bg-yellow-600 text-white"
                    >
                      {t("productManagement.buttons.edit")}
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-500 text-white py-1 px-2 hover:bg-red-600 rounded cursor-pointer"
                    >
                      {t("productManagement.buttons.delete")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <td colSpan="4" className="p-4 text-center text-gray-500">
                {t("productManagement.noProducts")}
              </td>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;

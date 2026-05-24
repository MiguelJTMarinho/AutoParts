import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductGrid = ({ products, loading, error }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 animate-pulse text-lg">
          {t("productGrid.loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-red-500">
          {t("productGrid.error", { message: error.message || error })}
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 text-lg">{t("productGrid.noProducts")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {/* Alterado de key={index} para key={product.id} (Boa prática React) */}
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="group block h-full"
        >
          <div className="bg-white rounded-xl border border-gray-100 p-3 hover:border-transparent hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Image Container com efeito de Zoom */}
            <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-50 mb-4">
              <img
                // Optional Chaining para não dar crash se o produto não tiver imagens!
                src={
                  product.images?.[0]?.image_url ||
                  "https://placehold.co/600x400?text=No+Image"
                }
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Etiqueta de Esgotado (Opcional, mas muito útil) */}
              {product.stock === 0 && (
                <div className="absolute top-2 left-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                  {t("productGrid.outOfStock")}
                </div>
              )}
            </div>

            {/* Product Details (cresce para preencher espaço vazio) */}
            <div className="flex flex-col grow">
              <h3
                className="text-gray-800 font-medium mb-1 line-clamp-2"
                title={product.name}
              >
                {product.name}
              </h3>

              <div className="mt-auto pt-3">
                <p className="text-lg font-bold text-gray-900 tracking-tight">
                  {Number(product.price).toFixed(2)} €
                </p>
                <p className="text-xs text-gray-500">{t("productGrid.VAT")}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;

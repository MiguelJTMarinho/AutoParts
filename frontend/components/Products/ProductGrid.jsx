import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 20;

const getPageRange = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
    result.push(sorted[i]);
  }
  return result;
};

const ProductGrid = ({ products, loading, error }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(1);
  }, [location.search]);

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

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const pageRange = getPageRange(currentPage, totalPages);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {paginatedProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group block h-full"
          >
            <div className="bg-white rounded-xl border border-gray-200 bg-gray-100 p-3 hover:border-transparent hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-50 mb-4">
                <img
                  src={
                    product.images?.[0]?.image_url ||
                    "https://placehold.co/600x400?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                    {t("productGrid.outOfStock")}
                  </div>
                )}
              </div>
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
                  <p className="text-xs text-gray-500">
                    {t("productGrid.VAT")}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-8 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &lsaquo;
          </button>

          {pageRange.map((page, i) =>
            page === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="px-2 py-1 text-sm text-gray-400"
              >
                &hellip;
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border text-sm ${
                  page === currentPage
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &rsaquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

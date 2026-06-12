import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import { useTranslation } from "react-i18next";

const AllProductsPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  useEffect(() => {
    dispatch(fetchProductsByFilters(queryParams));
  }, [dispatch, searchParams]);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    // Fecha a sidebar se clicar fora dela (útil para prevenir bugs no desktop)
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row relative">
      {/* Mobile Filter button */}
      <div className="p-4 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="w-full border p-3 flex justify-center items-center bg-white rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <FaFilter className="mr-2 text-main-blue" />{" "}
          {t("allProductsPage.filters", "Filters")}
        </button>
      </div>

      {/* Mobile Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Filter bar */}
      <div
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 w-72 bg-white overflow-y-auto z-50 shadow-2xl
          transition-transform duration-300 shrink-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:block lg:w-64 lg:shadow-none lg:z-auto
        `}
      >
        {/* Mobile Sidebar Header & Close Button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 lg:hidden">
          <span className="font-bold text-lg text-gray-800">
            {t("allProductsPage.filters", "Filters")}
          </span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <HiXMark className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <FilterSidebar />
      </div>

      {/* Main Content */}
      <div className="grow p-4 lg:p-6">
        <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6 text-gray-800">
          {t("allProductsPage.title", "All Products")}
        </h2>

        {/* Sort */}
        <SortOptions />

        {/* Product Grid */}
        <div className="mt-6">
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;

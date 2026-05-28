import React from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaCubes,
  FaSignOutAlt,
  FaStore,
  FaTags,
  FaUser,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../Common/LanguageSwitcher";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

const AdminSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login");
    });
  };
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-medium">
          AutoParts
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">
        {t("adminSidebar.title")}
      </h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaUser />
          <span>{t("adminSidebar.users")}</span>
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaBoxOpen />
          <span>{t("adminSidebar.products")}</span>
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaTags />
          <span>{t("adminSidebar.categories")}</span>
        </NavLink>
        <NavLink
          to="/admin/part-brands"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaCubes />
          <span>{t("adminSidebar.partBrands")}</span>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaClipboardList />
          <span>{t("adminSidebar.orders")}</span>
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaStore />
          <span>{t("adminSidebar.shop")}</span>
        </NavLink>
      </nav>
      <div className="w-full flex mt-3 justify-center">
        <LanguageSwitcher />
      </div>
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt />
          <span>{t("adminSidebar.logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

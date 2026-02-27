import React from "react";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

const CategoryDrawer = ({ navDrawerOpen, toggleNavDrawer }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex justify-end p-4">
        <button onClick={toggleNavDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600 cursor-pointer" />
        </button>
      </div>
      <div className="p-4">
        <h2 className="txt-xl font-semibold mb-4">Menu</h2>
        <nav className="space-y-4">
          <Link
            to="#"
            onClick={toggleNavDrawer}
            className="block text-gray-600 hover:text-black t-fast group-hover:scale-102"
          >
            Category
          </Link>
          <Link
            to="#"
            onClick={toggleNavDrawer}
            className="block text-gray-600 hover:text-black"
          >
            Category 2
          </Link>
          <Link
            to="#"
            onClick={toggleNavDrawer}
            className="block text-gray-600 hover:text-black"
          >
            Category 3
          </Link>
          <Link
            to="#"
            onClick={toggleNavDrawer}
            className="block text-gray-600 hover:text-black"
          >
            Category 4
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default CategoryDrawer;

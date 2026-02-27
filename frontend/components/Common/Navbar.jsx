import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiBars3,
  HiBars3BottomRight,
  HiBars3BottomLeft,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import CategoryDrawer from "../Layout/CategoryDrawer";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [navDrawerOpen, SetNavDrawerOpen] = useState(false);

  const toggleNavDrawer = () => {
    SetNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="container mx-auto flex flex-wrap items-center justify-between py-4 px-6">
        {/* Left - Menu + Logo */}
        <div className="left-0 pr-4 ">
          <button onClick={toggleNavDrawer} className="cursor-pointer">
            <HiBars3BottomLeft className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <div>
          <Link to="/" className="text-2xl font-medium">
            AutoParts
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center space-x-4 ml-auto md:order-3">
          <Link to="/profile" className="hove:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black cursor-pointer"
          >
            <HiOutlineShoppingCart className="h-6 w-6 text-gray-700" />
            <span className="absolute -top-1 bg-main-blue text-white text-xs rounded-full px-2 py-0.5">
              4
            </span>
          </button>
        </div>

        {/* Center - Searchbar */}
        <div className="w-full md:flex md:justify-center md:flex-1">
          <SearchBar />
        </div>
      </nav>

      <CartDrawer
        drawerOpen={!drawerOpen}
        toggleCartDrawer={toggleCartDrawer}
      />

      {/* Mobile Navigation */}
      <CategoryDrawer
        navDrawerOpen={!navDrawerOpen}
        toggleNavDrawer={toggleNavDrawer}
      />
    </>
  );
};

export default Navbar;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingCart } from "react-icons/hi2";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import logo from "../../src/assets/LogoNoBg.png";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { cart } = useSelector((state) => state.cart);

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Extrair os items e somar as suas quantidades
  const cartItems = cart?.items || cart?.products || [];
  const cartItemCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  return (
    <>
      <nav className="container mx-auto flex flex-wrap items-center justify-between py-4 px-6">
        {/* Left - Logo */}

        <div>
          <Link to="/" className="text-3xl font-medium">
            <img src={logo} alt="AutoParts Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center space-x-4 ml-auto md:order-3">
          <Link
            to="/admin"
            className=" block bg-black px-2 rounded text-sm text-white"
          >
            Admin
          </Link>

          <LanguageSwitcher />

          <Link to="/profile" className="hove:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black cursor-pointer"
          >
            <HiOutlineShoppingCart className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-main-blue text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Center - Searchbar */}
        <div className="w-full md:flex md:justify-center md:flex-1 mt-4 md:mt-0">
          <SearchBar />
        </div>
      </nav>

      <CartDrawer
        drawerOpen={!drawerOpen}
        toggleCartDrawer={toggleCartDrawer}
      />
    </>
  );
};

export default Navbar;

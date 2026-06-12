import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiOutlineHeart,
} from "react-icons/hi2";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import logo from "../../src/assets/LogoNoBg.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { fetchWishlist } from "../../redux/slices/wishlistSlice";
import CategoryMenu from "./CategoryMenu";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, userInfo]);

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Extrair os items e somar as suas quantidades
  const cartItems = cart?.items || cart?.products || [];
  const cartItemCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  const wishlistItemCount = wishlistItems?.length || 0;

  return (
    <>
      <nav className="container mx-auto flex flex-wrap items-center justify-between py-4 px-4 sm:px-6">
        {/* Left - Logo */}
        <div className="order-1 shrink-0">
          <Link to="/" className="block">
            <img
              src={logo}
              alt="AutoParts Logo"
              className="h-8 md:h-10 w-auto"
            />
          </Link>
        </div>

        {/* Right - Icons (Fica ao lado do Logo no Mobile) */}
        <div className="order-2 md:order-3 flex items-center space-x-3 md:space-x-4 ml-auto">
          {userInfo && userInfo.role === "admin" && (
            <Link
              to="/admin"
              className="hidden sm:block bg-black px-2 py-1 rounded text-xs text-white"
            >
              Admin
            </Link>
          )}

          <LanguageSwitcher />

          <Link to="/wishlist" className="relative hover:text-black transition">
            <HiOutlineHeart className="h-6 w-6 text-gray-700" />
            {wishlistItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-main-blue text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {wishlistItemCount}
              </span>
            )}
          </Link>

          <Link to="/profile" className="hover:text-black transition">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black cursor-pointer transition"
          >
            <HiOutlineShoppingCart className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-main-blue text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Center - Searchbar & Category Menu (Desce para a 2ª linha no Mobile) */}
        <div className="order-3 md:order-2 w-full md:w-auto md:flex-1 flex items-center gap-2 mt-4 md:mt-0 md:px-8">
          <div className="shrink-0">
            <CategoryMenu />
          </div>
          <div className="flex-1 w-full">
            <SearchBar />
          </div>
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

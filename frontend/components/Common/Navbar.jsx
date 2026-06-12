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
      <nav className="container mx-auto flex flex-wrap items-center justify-between py-4 px-6">
        {/* Left - Logo */}

        <div>
          <Link to="/" className="text-3xl font-medium">
            <img src={logo} alt="AutoParts Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Right - Icons */}

        <div className="flex items-center space-x-4 ml-auto md:order-3">
          {userInfo && userInfo.role == "admin" && (
            <Link
              to="/admin"
              className=" block bg-black px-2 rounded text-sm text-white"
            >
              Admin
            </Link>
          )}
          <LanguageSwitcher />

          <Link to="/wishlist" className="relative hover:text-black">
            <HiOutlineHeart className="h-6 w-6 text-gray-700" />
            {wishlistItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-main-blue text-white text-xs rounded-full px-2 py-0.5">
                {wishlistItemCount}
              </span>
            )}
          </Link>

          <Link to="/profile" className="hover:text-black">
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
        <div className="w-full md:flex md:justify-center md:flex-1 mt-4 md:mt-0 md:mx-8">
          <div className="flex items-center gap-2 w-full max-w-2xl">
            <CategoryMenu />
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

import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../redux/store";

import { checkAuthStatus } from "../redux/slices/authSlice";
import { fetchCart } from "../redux/slices/cartSlice";

import { Toaster } from "sonner";

import UserLayout from "../components/Layout/UserLayout";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Profile from "../Pages/Profile";
import MyOrdersPage from "../Pages/MyOrdersPage";
import AllProductsPage from "../Pages/AllProductsPage";
import ProductDetails from "../components/Products/ProductDetails";
import Checkout from "../components/Cart/Checkout";
import OrderConfirmation from "../Pages/OrderConfirmation";
import OrderDetailsPage from "../Pages/OrderDetailsPage";
import WishlistPage from "../Pages/WishlistPage";
import ContactUs from "../Pages/ContactUs";
import AdminLayout from "../components/Admin/AdminLayout";
import AdminHomePage from "../Pages/AdminHomePage";
import UserManagement from "../components/Admin/UserManagement";
import ProductManagement from "../components/Admin/ProductManagement";
import AddProductPage from "../components/Admin/AddProductPage";
import EditProductPage from "../components/Admin/EditProductPage";
import OrderManagement from "../components/Admin/OrderManagement";
import CategoriesManagement from "../components/Admin/CategoriesManagement";
import PartBrandsManagement from "../components/Admin/PartBrandManagement";
import ShippingRatesManagement from "../components/Admin/ShippingRatesManagement";
import ScrollToTop from "../components/Common/ScrollToTop";
import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";
import AboutUs from "../Pages/AboutUs";
import PrivacyPolicy from "../Pages/PrivacyPolicy";
import TermsAndConditions from "../Pages/TermsConditions";

const AppContent = () => {
  const dispatch = useDispatch();
  const { guestId } = useSelector((state) => state.auth);

  useEffect(() => {
    // 1. Check if user has session via HttpOnly Cookie
    dispatch(checkAuthStatus())
      .unwrap()
      .then(() => {
        // 2a. If user is logged, get cart
        dispatch(fetchCart({ guestId: null }));
      })
      .catch(() => {
        // 2b. If fails, fetch guest cart
        dispatch(fetchCart({ guestId }));
      });
  }, [dispatch, guestId]);
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="products" element={<AllProductsPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="part-brands" element={<PartBrandsManagement />} />
          <Route path="shipping-rates" element={<ShippingRatesManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "../components/Layout/UserLayout";
import Home from "../Pages/Home";
import { Toaster, toast } from "sonner";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Profile from "../Pages/Profile";
import MyOrdersPage from "../Pages/MyOrdersPage";
import CollectionPage from "../Pages/CollectionPage";
import ProductDetails from "../components/Products/ProductDetails";
import Checkout from "../components/Cart/Checkout";
import OrderConfirmation from "../Pages/OrderConfirmation";
import OrderDetailsPage from "../Pages/OrderDetailsPage";
import AdminLayout from "../components/Admin/AdminLayout";
import AdminHomePage from "../Pages/AdminHomePage";
import UserManagement from "../components/Admin/UserManagement";
import ProductManagement from "../components/Admin/ProductManagement";
import EditProductPage from "../components/Admin/EditProductPage";
import OrderManagement from "../components/Admin/OrderManagement";
import CategoriesManagement from "../components/Admin/CategoriesManagement";
import PartBrandsManagement from "../components/Admin/PartBrandManagement";
import ScrollToTop from "../components/Common/ScrollToTop";

const App = () => {
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
          <Route path="collections/:collection" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="part-brands" element={<PartBrandsManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

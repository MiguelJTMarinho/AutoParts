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

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
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
        <Route>{/* Admin Layout*/}</Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

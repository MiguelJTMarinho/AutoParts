import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import ordersReducer from "./slices/ordersSlice";
import adminUsersReducer from "./slices/admin/adminUsersSlice";
import adminProductSlice from "./slices/admin/adminProductSlice";
import adminOrderSlice from "./slices/admin/adminOrderSlice";
import adminCategorySlice from "./slices/admin/adminCategorySlice";
import adminPartBrandSlice from "./slices/admin/adminPartBrandSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    adminUsers: adminUsersReducer,
    adminProducts: adminProductSlice,
    adminOrders: adminOrderSlice,
    adminCategories: adminCategorySlice,
    adminPartBrands: adminPartBrandSlice,
  },
});

export default store;

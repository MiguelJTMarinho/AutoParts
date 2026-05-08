import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to create an order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/checkout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);

      return rejectWithValue(
        error.response?.data || {
          error: "Failed to create order",
        },
      );
    }
  },
);

// Async thunk to fetch user orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);

      return rejectWithValue(
        error.response?.data || {
          error: "Failed to fetch orders",
        },
      );
    }
  },
);

// Async thunk to fetch order details
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);

      return rejectWithValue(
        error.response?.data || {
          error: "Failed to fetch order details",
        },
      );
    }
  },
);

// Async thunk to update order status (ADMIN)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);

      return rejectWithValue(
        error.response?.data || {
          error: "Failed to update order status",
        },
      );
    }
  },
);

const ordersSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    selectedOrder: null,
    loading: false,
    success: false,
    error: null,
  },

  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },

    clearOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to create order";
      })

      // FETCH ORDERS
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch orders";
      })

      // FETCH ORDER DETAILS
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })

      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch order details";
      })

      // UPDATE ORDER STATUS
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.data;
        const index = state.orders.findIndex((o) => o.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        if (state.selectedOrder && state.selectedOrder.id === updatedOrder.id) {
          state.selectedOrder = updatedOrder;
        }
      })

      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to update order status";
      });
  },
});

export const { clearSelectedOrder, clearOrderState } = ordersSlice.actions;

export default ordersSlice.reducer;

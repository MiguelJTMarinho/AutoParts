import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: guestId ? { "x-guest-id": guestId } : {},
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return rejectWithValue(
        error.response?.data || { message: "Error fetching cart" },
      );
    }
  },
);

// Add item to cart for a user or guest
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ guestId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/items`,
        {
          product_id: productId,
          quantity,
        },
        {
          headers: guestId ? { "x-guest-id": guestId } : {},
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return rejectWithValue(
        error.response?.data || { message: "Error adding to cart" },
      );
    }
  },
);

// Update item quantity in cart for a user or guest
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ guestId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/items`,
        {
          product_id: productId,
          quantity,
        },
        {
          headers: guestId ? { "x-guest-id": guestId } : {},
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      return rejectWithValue(
        error.response?.data || { message: "Error updating cart quantity" },
      );
    }
  },
);

// Remove an item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${import.meta.env.VITE_API_URL}/cart/items`,
        headers: guestId ? { "x-guest-id": guestId } : {},
        data: { product_id: productId },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return rejectWithValue(
        error.response?.data || { message: "Error removing from cart" },
      );
    }
  },
);

// Merge guest cart into user cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/merge`,
        { guest_id: guestId },
      );
      return response.data;
    } catch (error) {
      console.error("Error merging cart:", error);
      return rejectWithValue(
        error.response?.data || { message: "Error merging cart" },
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: { products: [] },
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload; // Atualiza apenas o estado em memória do Redux
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch cart";
      })

      // ADD TO CART
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })

      // UPDATE CART QUANTITY
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update cart quantity";
      })

      // REMOVE FROM CART
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove from cart";
      })

      // MERGE CART
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

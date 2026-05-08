import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to get cart from localStorage
const getCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// Helper function to save cart to localStorage
const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Fetch cart for a user or geust
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
      return rejectWithValue(error.response.data);
    }
  },
);

// Add item to cart for a user or guest
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ guestId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
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
      return rejectWithValue(error.response.data);
    }
  },
);

// Update item quantity in cart for a user or guest
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
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
      return rejectWithValue(error.response.data);
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
      return rejectWithValue(error.response.data);
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
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error merging cart:", error);
      return rejectWithValue(error.response.data);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: getCartFromLocalStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToLocalStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch cart";
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToLocalStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToLocalStorage(action.payload);
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update cart quantity";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToLocalStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove from cart";
      })
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToLocalStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;

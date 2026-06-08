import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all shipping rates
export const fetchShippingRates = createAsyncThunk(
  "adminShippingRates/fetchShippingRates",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/shipping_rates`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch shipping rates"
      );
    }
  }
);

// Create shipping rate
export const createShippingRate = createAsyncThunk(
  "adminShippingRates/createShippingRate",
  async (rateData, { rejectWithValue, getState }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/shipping_rates`,
        rateData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create shipping rate"
      );
    }
  }
);

// Update shipping rate
export const updateShippingRate = createAsyncThunk(
  "adminShippingRates/updateShippingRate",
  async ({ id, data: rateData }, { rejectWithValue, getState }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/shipping_rates/${id}`,
        rateData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update shipping rate"
      );
    }
  }
);

// Delete shipping rate
export const deleteShippingRate = createAsyncThunk(
  "adminShippingRates/deleteShippingRate",
  async (id, { rejectWithValue, getState }) => {
    try {
      const config = {
        withCredentials: true,
      };
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/shipping_rates/${id}`,
        config
      );
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete shipping rate"
      );
    }
  }
);

const adminShippingRateSlice = createSlice({
  name: "adminShippingRates",
  initialState: {
    shippingRates: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchShippingRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingRates.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingRates = action.payload;
      })
      .addCase(fetchShippingRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createShippingRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShippingRate.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingRates.push(action.payload);
      })
      .addCase(createShippingRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateShippingRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShippingRate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shippingRates.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.shippingRates[index] = action.payload;
        }
      })
      .addCase(updateShippingRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteShippingRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShippingRate.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingRates = state.shippingRates.filter(
          (r) => r.id !== action.payload
        );
      })
      .addCase(deleteShippingRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminShippingRateSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to get auth headers
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});
const API_URL = `${import.meta.env.VITE_API_URL}`;

// Async thunk to fetch all categories (admin)
export const fetchAdminCategories = createAsyncThunk(
  "adminCategories/fetchAdminCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch categories" },
      );
    }
  },
);

// Async thunk to create a new category (admin)
export const createCategory = createAsyncThunk(
  "adminCategories/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/categories`, categoryData, {
        headers: authHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

// Async thunk to update a category (admin)
export const updateCategory = createAsyncThunk(
  "adminCategories/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/categories/${id}`, data, {
        headers: authHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

// Async thunk to delete a category (admin)
export const deleteCategory = createAsyncThunk(
  "adminCategories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/categories/${id}`, {
        headers: authHeaders(),
      });
      return id; // Return the deleted category ID
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

const adminCategorySlice = createSlice({
  name: "adminCategories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAdminCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      // UPDATE
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload,
        );
      });
  },
});

export default adminCategorySlice.reducer;

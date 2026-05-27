import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// GET all part brands
export const fetchPartBrands = createAsyncThunk(
  "adminPartBrands/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/part_brands`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

// CREATE part brand
export const createPartBrand = createAsyncThunk(
  "adminPartBrands/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/part_brands`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

// UPDATE part brand
export const updatePartBrand = createAsyncThunk(
  "adminPartBrands/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/part_brands/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

// DELETE part brand
export const deletePartBrand = createAsyncThunk(
  "adminPartBrands/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/part_brands/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

const adminPartBrandSlice = createSlice({
  name: "adminPartBrands",
  initialState: {
    partBrands: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPartBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPartBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.partBrands = action.payload;
      })
      .addCase(fetchPartBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createPartBrand.fulfilled, (state, action) => {
        state.partBrands.push(action.payload);
      })

      // UPDATE
      .addCase(updatePartBrand.fulfilled, (state, action) => {
        const index = state.partBrands.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.partBrands[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deletePartBrand.fulfilled, (state, action) => {
        state.partBrands = state.partBrands.filter(
          (b) => b.id !== action.payload,
        );
      });
  },
});

export default adminPartBrandSlice.reducer;

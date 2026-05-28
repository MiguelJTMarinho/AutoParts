import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const errorMessage = (payload, fallback) =>
  payload?.message || payload?.error || fallback;

// Async thunk to fetch all products (admin)
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch products" },
      );
    }
  },
);

// Async thunk to create a new product (admin)
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/products`, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create product" },
      );
    }
  },
);

// Async thunk to create a product and upload images to Cloudinary
export const createProductWithImages = createAsyncThunk(
  "adminProducts/createProductWithImages",
  async (
    { productData, imageFiles = [], fitments = [], oemReferences = [] },
    { rejectWithValue },
  ) => {
    try {
      // O backend agora recebe os fitments diretamente no array "fitments" do productData
      // Precisamos apenas passar os IDs das generations.
      const payload = {
        ...productData,
        fitments: fitments.map((f) => f.generation_id).filter((id) => id)
      };

      const productResponse = await axios.post(
        `${API_URL}/products`,
        payload,
      );
      const product = productResponse.data;

      const uploadedImages = [];
      const createdOemReferences = [];

      for (const [index, file] of imageFiles.entries()) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("product_id", product.id);
        formData.append("sort_order", index);

        const imageResponse = await axios.post(
          `${API_URL}/product_images/upload`,
          formData,
        );

        uploadedImages.push(imageResponse.data);
      }

      for (const item of oemReferences) {
        if (!item.reference_code?.trim()) continue;

        const oemResponse = await axios.post(`${API_URL}/oem_references`, {
          ...item,
          product_id: product.id,
        });

        createdOemReferences.push(oemResponse.data);
      }

      return {
        ...product,
        images: uploadedImages,
        oem_references: createdOemReferences,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create product" },
      );
    }
  },
);

// Async thunk to update a existing product (admin)
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/products/${id}`,
        productData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update product" },
      );
    }
  },
);

// Async thunk to delete a product (admin)
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`);
      return (
        response.data.data || {
          id,
          is_active: false,
          status: "inactive",
        }
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete product" },
      );
    }
  },
);

// Async thunk to fetch all product (admin)
export const fetchAllProductsForAdmin = createAsyncThunk(
  "adminProducts/fetchAllProductsForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/admin`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch products" },
      );
    }
  },
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Fetch Products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = errorMessage(action.payload, "Failed to fetch products");
      })
      //Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = errorMessage(action.payload, "Failed to create product");
      })
      //Create Product with Images
      .addCase(createProductWithImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductWithImages.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProductWithImages.rejected, (state, action) => {
        state.loading = false;
        state.error = errorMessage(action.payload, "Failed to create product");
      })
      //Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = errorMessage(action.payload, "Failed to update product");
      })
      //Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = errorMessage(action.payload, "Failed to delete product");
      })
      //Fetch All Products for Admin
      .addCase(fetchAllProductsForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProductsForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProductsForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = errorMessage(action.payload, "Failed to fetch products");
      });
  },
});

export default adminProductSlice.reducer;

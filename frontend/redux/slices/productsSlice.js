import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const cleanName = (val) => {
  if (!val) return "";
  return val.includes("_") ? val.split("_")[1] : val;
};

const cleanId = (val) => {
  if (!val) return "";
  return val.includes("_") ? val.split("_")[0] : val;
};

// Async thunk to fetch products by optional filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    oem,
    carBrand,
    carModel,
    carYear,
    category,
    partBrand,
    generation,
    minPrice,
    maxPrice,
    inStock,
    search,
    limit,
    sortBy,
  }) => {
    const query = new URLSearchParams();

    if (oem) query.append("oem", oem);
    if (carBrand) query.append("carBrand", cleanName(carBrand));
    if (carModel) query.append("carModel", cleanName(carModel));
    if (carYear) query.append("carYear", carYear);
    if (generation) query.append("generationId", cleanId(generation));
    if (category) {
      if (Array.isArray(category)) {
        category.forEach((cat) => query.append("category", cleanName(cat)));
      } else {
        query.append("category", cleanName(category));
      }
    }
    if (partBrand) {
      if (Array.isArray(partBrand)) {
        partBrand.forEach((brand) =>
          query.append("partBrand", cleanName(brand)),
        );
      } else {
        query.append("partBrand", cleanName(partBrand));
      }
    }
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (inStock) query.append("inStock", inStock);
    if (search) query.append("search", search);
    if (limit) query.append("limit", limit);
    if (sortBy) query.append("sort_by", sortBy);

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/products?${query.toString()}`,
    );
    return response.data;
  },
);

// Async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/products/${id}`,
    );
    return response.data;
  },
);

// Async thunk to update products
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    return response.data;
  },
);

// Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilar",
  async ({ productId }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/products/similar/${productId}`,
    );
    return response.data;
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    error: null,
    filters: {
      oem: "",
      carBrand: "",
      carModel: "",
      carYear: "",
      category: "",
      partBrand: "",
      minPrice: "",
      maxPrice: "",
      inStock: false,
      sortBy: "",
      search: "",
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = {
        oem: "",
        carBrand: "",
        carModel: "",
        carYear: "",
        category: "",
        partBrand: "",
        minPrice: "",
        maxPrice: "",
        inStock: false,
        sortBy: "",
        search: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // handle fetching products with filters
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      // handle fetching products details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    // Handle updating a product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedProduct = action.payload;
        const index = state.products.findIndex(
          (p) => p.id === updateProduct.id,
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Handle fetching similar products
    builder
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;

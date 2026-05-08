import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Retrieve user info and token from localStorage
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialGuestId =
  localStorage.getItem("x-guest-id") || `guest_${Date.now()}`;
localStorage.setItem("x-guest-id", initialGuestId);

// Initial state
const initialState = {
  userInfo: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        userData,
      );

      localStorage.setItem("userInfo", JSON.stringify(response.data));
      localStorage.setItem("userToken", response.data.token);

      return response.data.user; // Return the user object from the response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Async thunk for user Registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        userData,
      );

      localStorage.setItem("userInfo", JSON.stringify(response.data));
      localStorage.setItem("userToken", response.data.token);

      return response.data.user; // Return the user object from the response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${uuidv4()}`; // Generate a new guest ID on logout
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("x-guest-id", state.guestId); // Update localStorage with the new guest ID
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${uuidv4()}`; // Generate a new guest ID
      localStorage.setItem("x-guest-id", state.guestId); // Update localStorage with the new guest ID
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;

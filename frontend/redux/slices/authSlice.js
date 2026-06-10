import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// Retrieve user info from storage
const loadUserFromStorage = () => {
  try {
    const serializedUser = localStorage.getItem("userInfo");
    return serializedUser ? JSON.parse(serializedUser) : null;
  } catch {
    return null;
  }
};
const userFromStorage = loadUserFromStorage();
const initialGuestId =
  localStorage.getItem("x-guest-id") || `guest_${uuidv4()}`;
localStorage.setItem("x-guest-id", initialGuestId);

// Initial state
const initialState = {
  userInfo: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  authChecked: false,
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

      localStorage.setItem("userInfo", JSON.stringify(response.data.user));

      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" },
      );
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

      return response.data.user; // Return the user object from the response
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" },
      );
    }
  },
);

// Check if session is still active (via cookie)
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/session`,
      );

      if (!response.data.user) {
        localStorage.removeItem("userInfo");
        return rejectWithValue({ message: "Não autenticado" });
      }

      // Atualiza o localStorage com os dados frescos do backend
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      // Se falhar (cookie expirado ou apagado), limpamos os vestígios locais
      localStorage.removeItem("userInfo");
      return rejectWithValue(
        error.response?.data || { message: "Não autenticado" },
      );
    }
  },
);

// Secure logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`);

      dispatch(logout());
    } catch (error) {
      dispatch(logout());
      return rejectWithValue(
        error.response?.data || { message: "Erro no logout" },
      );
    }
  },
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.error = null;
      state.authChecked = true;
      state.guestId = `guest_${uuidv4()}`;
      localStorage.removeItem("userInfo");
      localStorage.setItem("x-guest-id", state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${uuidv4()}`; // Generate a new guest ID
      localStorage.setItem("x-guest-id", state.guestId); // Update localStorage with the new guest ID
    },
  },
  extraReducers: (builder) => {
    builder
      // --- LOGIN ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.authChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      // --- REGISTER ---
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.authChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })
      // --- CHECK AUTH STATUS ---
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.authChecked = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.userInfo = null;
        state.authChecked = true;
      });
  },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;

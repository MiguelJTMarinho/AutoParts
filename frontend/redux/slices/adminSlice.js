import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

//------------
// USERS
//------------

// fetch all users (admin)
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          headers: authHeaders(),
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch users" },
      );
    }
  },
);

// Add the create user action
export const createUser = createAsyncThunk(
  "admin/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        userData,
        {
          headers: authHeaders(),
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create user" },
      );
    }
  },
);

// Update user info
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async (
    { id, username, first_name, last_name, role, phone_number },
    { rejectWithValue },
  ) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/users/${id}`,
      { username, first_name, last_name, role, phone_number },
      {
        headers: authHeaders(),
      },
    );
    try {
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update user" },
      );
    }
  },
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        {
          headers: authHeaders(),
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete user" },
      );
    }
  },
);

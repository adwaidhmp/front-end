import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api2.jsx"; // axios instance with auth

/* ============================
   THUNKS
============================ */

// Generate diet plan
export const generateDietPlan = createAsyncThunk(
  "dietActions/generateDietPlan",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/generate/");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to generate diet plan"
      );
    }
  }
);

// Follow meal from plan
export const followMealFromPlan = createAsyncThunk(
  "dietActions/followMealFromPlan",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/follow-meal/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to follow meal"
      );
    }
  }
);

// Log custom meal with AI
export const logCustomMeal = createAsyncThunk(
  "dietActions/logCustomMeal",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/log-custom-meal/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to log custom meal"
      );
    }
  }
);

// Skip meal
export const skipMeal = createAsyncThunk(
  "dietActions/skipMeal",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/skip-meal/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to skip meal"
      );
    }
  }
);

// Update weight (IMPORTANT: triggers weekly regeneration backend side)
export const updateWeight = createAsyncThunk(
  "dietActions/updateWeight",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/update-weight/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to update weight"
      );
    }
  }
);

/* ============================
   SLICE
============================ */

const dietActionsSlice = createSlice({
  name: "dietActions",
  initialState: {
    loading: false,
    error: null,
    success: false,
    lastResponse: null,
  },
  reducers: {
    clearDietActionState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.lastResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith("dietActions/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("dietActions/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          state.success = true;
          state.lastResponse = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("dietActions/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearDietActionState } = dietActionsSlice.actions;
export default dietActionsSlice.reducer;

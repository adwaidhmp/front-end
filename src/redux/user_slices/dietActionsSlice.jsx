import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api2.jsx";

/* ============================
   THUNKS
============================ */

/**
 * GET current diet plan
 * Safe on refresh, does NOT regenerate
 */
export const fetchCurrentDietPlan = createAsyncThunk(
  "dietActions/fetchCurrentDietPlan",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("diet-plan/");
      return res.data;
    } catch (err) {
      // IMPORTANT:
      // "no active diet plan" is NOT a real error
      if (
        err.response?.status === 404 ||
        err.response?.data?.detail === "No active diet plan"
      ) {
        return { has_plan: false };
      }

      return rejectWithValue(
        err.response?.data?.detail || "Failed to fetch diet plan"
      );
    }
  }
);

/**
 * POST generate new diet plan
 * Explicit user action only
 */
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

/**
 * Follow meal from plan
 */
export const followMealFromPlan = createAsyncThunk(
  "dietActions/followMealFromPlan",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/follow-meal/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to follow meal");
    }
  }
);

/**
 * Log custom meal with AI
 */
export const logCustomMeal = createAsyncThunk(
  "dietActions/logCustomMeal",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/log-custom-meal/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to log custom meal");
    }
  }
);

/**
 * Skip meal
 */
export const skipMeal = createAsyncThunk(
  "dietActions/skipMeal",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/skip-meal/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to skip meal");
    }
  }
);

/**
 * Update weight
 * Backend may auto-regenerate weekly plan
 */
export const updateWeight = createAsyncThunk(
  "dietActions/updateWeight",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/update-weight/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to update weight");
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

    currentPlan: null,   // null = no plan yet
    lastResponse: null,
  },
  reducers: {
    clearDietActionState(state) {
      state.loading = false;
      state.error = null;
      state.lastResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* -------- FETCH CURRENT PLAN -------- */
      .addCase(fetchCurrentDietPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentDietPlan.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.has_plan === false) {
          state.currentPlan = null;
        } else {
          state.currentPlan = action.payload;
        }
      })
      .addCase(fetchCurrentDietPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- GENERATE PLAN -------- */
      .addCase(generateDietPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateDietPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
      })
      .addCase(generateDietPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- OTHER ACTIONS -------- */
      .addMatcher(
        (action) =>
          action.type.startsWith("dietActions/") &&
          action.type.endsWith("/fulfilled") &&
          ![
            fetchCurrentDietPlan.fulfilled.type,
            generateDietPlan.fulfilled.type,
          ].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.lastResponse = action.payload;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("dietActions/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("dietActions/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearDietActionState } = dietActionsSlice.actions;
export default dietActionsSlice.reducer;

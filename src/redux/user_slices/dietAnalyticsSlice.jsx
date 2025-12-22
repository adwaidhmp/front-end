import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api2.jsx";

/* ============================
   THUNKS
============================ */

export const fetchDailyCalories = createAsyncThunk(
  "dietAnalytics/fetchDailyCalories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("diet/daily-calories/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch daily calories");
    }
  }
);

export const fetchWeeklyProgress = createAsyncThunk(
  "dietAnalytics/fetchWeeklyProgress",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("diet/weekly-progress/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch weekly progress");
    }
  }
);

export const fetchMonthlyCalories = createAsyncThunk(
  "dietAnalytics/fetchMonthlyCalories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("diet/monthly-calories/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch monthly calories");
    }
  }
);

export const fetchMonthlyWeight = createAsyncThunk(
  "dietAnalytics/fetchMonthlyWeight",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("diet/monthly-weight/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch monthly weight");
    }
  }
);

export const fetchMonthlyCauseAnalysis = createAsyncThunk(
  "dietAnalytics/fetchMonthlyCauseAnalysis",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("diet/monthly-cause-analysis/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch cause analysis");
    }
  }
);

/* ============================
   SLICE
============================ */

const dietAnalyticsSlice = createSlice({
  name: "dietAnalytics",
  initialState : {
  dailyCalories: {},
  weeklyProgress: { days: {} },
  monthlyCalories: { daily_calories: {} },
  monthlyWeight: { weights: [] },
  causeAnalysis: { top_custom_days: [] },
  loading: false,
  error: null,
},
  reducers: {
    clearDietAnalytics(state) {
      state.dailyCalories = null;
      state.weeklyProgress = null;
      state.monthlyCalories = null;
      state.monthlyWeight = null;
      state.causeAnalysis = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("dietAnalytics/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("dietAnalytics/") &&
          action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;

          if (action.type.includes("daily")) state.dailyCalories = action.payload;
          if (action.type.includes("weekly")) state.weeklyProgress = action.payload;
          if (action.type.includes("monthly-calories")) state.monthlyCalories = action.payload;
          if (action.type.includes("monthly-weight")) state.monthlyWeight = action.payload;
          if (action.type.includes("cause")) state.causeAnalysis = action.payload;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("dietAnalytics/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearDietAnalytics } = dietAnalyticsSlice.actions;
export default dietAnalyticsSlice.reducer;

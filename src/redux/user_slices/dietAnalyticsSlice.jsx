import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api2.jsx";

/* ============================
   THUNKS
============================ */

/**
 * Daily analytics
 * GET /diet/analytics/daily/?date=YYYY-MM-DD
 */
export const fetchDailyAnalytics = createAsyncThunk(
  "dietAnalytics/fetchDailyAnalytics",
  async (date, { rejectWithValue }) => {
    try {
      const res = await api.get("diet/analytics/daily/", {
        params: date ? { date } : {},
      });
      return res.data;
    } catch {
      return rejectWithValue("Failed to fetch daily analytics");
    }
  },
);

/**
 * Weekly analytics
 * GET /diet/analytics/weekly/
 */
export const fetchWeeklyAnalytics = createAsyncThunk(
  "dietAnalytics/fetchWeeklyAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("diet/analytics/weekly/");
      return res.data;
    } catch {
      return rejectWithValue("Failed to fetch weekly analytics");
    }
  },
);

/**
 * Monthly analytics
 * GET /diet/analytics/monthly/?year=YYYY&month=MM
 */
export const fetchMonthlyAnalytics = createAsyncThunk(
  "dietAnalytics/fetchMonthlyAnalytics",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const res = await api.get("diet/analytics/monthly/", {
        params: { year, month },
      });
      return res.data;
    } catch {
      return rejectWithValue("Failed to fetch monthly analytics");
    }
  },
);

/* ============================
   SLICE
============================ */

const initialState = {
  daily: null,
  weekly: null,
  monthly: null,

  loading: false,
  error: null,
};

const dietAnalyticsSlice = createSlice({
  name: "dietAnalytics",
  initialState,
  reducers: {
    clearDietAnalytics(state) {
      state.daily = null;
      state.weekly = null;
      state.monthly = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* -------- DAILY -------- */
      .addCase(fetchDailyAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.daily = action.payload;
      })
      .addCase(fetchDailyAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- WEEKLY -------- */
      .addCase(fetchWeeklyAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.weekly = action.payload;
      })
      .addCase(fetchWeeklyAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- MONTHLY -------- */
      .addCase(fetchMonthlyAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.monthly = action.payload;
      })
      .addCase(fetchMonthlyAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDietAnalytics } = dietAnalyticsSlice.actions;
export default dietAnalyticsSlice.reducer;

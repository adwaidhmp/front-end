import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api2.jsx";

/* ============================
   THUNKS
============================ */

export const fetchCurrentDietPlan = createAsyncThunk(
  "dietActions/fetchCurrentDietPlan",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("diet-plan/");
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return { has_plan: false };
      }
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

export const generateDietPlan = createAsyncThunk(
  "dietActions/generateDietPlan",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/generate/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

export const followMealFromPlan = createAsyncThunk(
  "dietActions/followMealFromPlan",
  async ({ meal_type }, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/follow-meal/", { meal_type });
      return { ...res.data, meal_type, source: "planned" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

export const logCustomMeal = createAsyncThunk(
  "dietActions/logCustomMeal",
  async ({ meal_type, food_text }, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/log-custom-meal/", {
        meal_type,
        food_text,
      });
      return { ...res.data, meal_type, source: "custom" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

export const skipMeal = createAsyncThunk(
  "dietActions/skipMeal",
  async ({ meal_type }, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/skip-meal/", { meal_type });
      return { ...res.data, meal_type, source: "skipped" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

export const logExtraMeal = createAsyncThunk(
  "dietActions/logExtraMeal",
  async ({ food_text }, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/extra-meal/", { food_text });
      return res.data;
    } catch {
      return rejectWithValue("Failed to log extra meal");
    }
  }
);

export const updateWeight = createAsyncThunk(
  "dietActions/updateWeight",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("diet/update-weight/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

/* ============================
   SLICE
============================ */

const initialState = {
  loading: false,
  error: null,
  currentPlan: null,
  mealStatus: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  lastResponse: null,
};

const dietActionsSlice = createSlice({
  name: "dietActions",
  initialState,
  reducers: {
    clearDietActionState(state) {
      state.loading = false;
      state.error = null;
      state.lastResponse = null;
    },
    resetMealStatus(state) {
      state.mealStatus = {
        breakfast: null,
        lunch: null,
        dinner: null,
      };
    },
  },
  extraReducers: (builder) => {
    /* ---- ALL addCase FIRST ---- */

    builder
      .addCase(fetchCurrentDietPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentDietPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan =
          action.payload?.has_plan === false ? null : action.payload;
      })
      .addCase(fetchCurrentDietPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(generateDietPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateDietPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
        state.mealStatus = {
          breakfast: null,
          lunch: null,
          dinner: null,
        };
      })
      .addCase(generateDietPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateWeight.fulfilled, (state, action) => {
        state.loading = false;
        state.lastResponse = action.payload;
        if (action.payload?.new_plan) {
          state.currentPlan = action.payload.new_plan;
          state.mealStatus = {
            breakfast: null,
            lunch: null,
            dinner: null,
          };
        }
      })

      .addCase(logExtraMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.lastResponse = action.payload;
      })

      /* ---- addMatcher LAST ---- */

      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          [
            followMealFromPlan.fulfilled.type,
            logCustomMeal.fulfilled.type,
            skipMeal.fulfilled.type,
          ].includes(action.type),
        (state, action) => {
          state.loading = false;
          const { meal_type, source } = action.payload;
          state.mealStatus[meal_type] = source;
          state.lastResponse = action.payload;
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

export const { clearDietActionState, resetMealStatus } =
  dietActionsSlice.actions;

export default dietActionsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../tasks/trackingTasks";

const CALORIES_PER_METER = {
  Walking: 0.05,
  Running: 0.1,
  Cycling: 0.04,
};

const initialState = {
  distance: 0,
  duration: 0,
  calories: 0,
  locations: [],
};

export const updateStatsAsync = createAsyncThunk(
  "tracking/updateStatsAsync",
  async (payload, { getState }) => {
    const { distance = 0, location } = payload;

    // Read type from AsyncStorage
    const activityType = await AsyncStorage.getItem(STORAGE_KEYS.TYPE);
    const rate = CALORIES_PER_METER[activityType] || 0.05;

    // Access current state
    const prev = getState().tracking;

    // Compute new values
    const newDistance = distance || prev.distance;
    const newCalories = Math.round(newDistance * rate);

    return {
      distance: newDistance,
      calories: newCalories,
      location,
    };
  }
);

const slice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
    resetStats: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateStatsAsync.fulfilled, (state, { payload }) => {
      const { distance, calories, location } = payload;
      state.distance = distance;
      state.calories = calories;
      if (location) state.locations.push(location);
    });
  },
});

export const { resetStats } = slice.actions;
export default slice.reducer;

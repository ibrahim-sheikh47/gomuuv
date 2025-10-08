import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  distance: 0,
  duration: 0,
  calories: 0,
  locations: [],
};

const slice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
    updateStats: (state, { payload }) => {
      const { distance = 0, location } = payload;

      if (distance) state.distance = distance;
      if (location) state.locations.push(location);

      state.calories = Math.round(state.distance * 60);
    },
    resetStats: () => initialState,
  },
});

export const { updateStats, resetStats } = slice.actions;
export default slice.reducer;

import { createSlice } from "@reduxjs/toolkit";

// Initial state
let initialState = {
  trendingData: [],
  todaySessions: [],
};

export const WorkoutSlice = createSlice({
  name: "Workout",
  initialState,
  reducers: {
    setTrendingWorkouts: (state, action) => {
      state.trendingData = action.payload;
    },
    setTodaySessions: (state, action) => {
      state.todaySessions = action.payload;
    },
  },
});

// Export actions
export const { setTrendingWorkouts, setTodaySessions } = WorkoutSlice.actions;

// Export reducer
export default WorkoutSlice.reducer;

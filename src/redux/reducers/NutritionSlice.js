import { createSlice } from "@reduxjs/toolkit";

// Initial state
let initialState = {
  data: [],
  dailyPlans: [],
};

export const NutritionSlice = createSlice({
  name: "Nutrition",
  initialState,
  reducers: {
    setNutritionMeals: (state, action) => {
      state.data = action.payload;
    },
    setDailyPlans: (state, action) => {
      state.dailyPlans = action.payload;
    },
  },
});

// Export actions
export const { setDailyPlans, setNutritionMeals } = NutritionSlice.actions;

// Export reducer
export default NutritionSlice.reducer;

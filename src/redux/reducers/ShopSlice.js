import { createSlice } from "@reduxjs/toolkit";

// Initial state
let initialState = {
  categories: [],
  products: [],
};

export const ShopSlice = createSlice({
  name: "Shop",
  initialState,
  reducers: {
    setCategoriesData: (state, action) => {
      state.categories = action.payload;
    },
    setProductsData: (state, action) => {
      state.products = action.payload;
    },
  },
});

// Export actions
export const { setCategoriesData, setProductsData } = ShopSlice.actions;

// Export reducer
export default ShopSlice.reducer;

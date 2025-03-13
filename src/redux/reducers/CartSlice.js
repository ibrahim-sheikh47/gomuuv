import { createSlice } from "@reduxjs/toolkit";

// Initial state
let initialState = {
  data: []
};

export const CartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    setCartData: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Export actions
export const { setCartData } = CartSlice.actions;

// Export reducer
export default CartSlice.reducer;

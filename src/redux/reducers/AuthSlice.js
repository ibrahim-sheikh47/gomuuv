import { createSlice } from "@reduxjs/toolkit";

// Initial state
let initialState = {
  data: {},
  targetWeight: null,
  token: null,
  isLoggedIn: false,
};

export const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserData: (state, action) => {
      state.data = action.payload;
    },
    setTargetWeight: (state, action) => {
      state.targetWeight = action.payload;
    },
    clearUserData: (state) => {
      state.data = {};
      state.token = null;
      state.isLoggedIn = false;
    },
    userLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    // Combined action to handle all updates in one
    setAuthData: (state, action) => {
      state.token = action.payload.token;
      state.data = action.payload.data;
      state.isLoggedIn = true;
    },
  },
});

// Export actions
export const {
  setToken,
  setUserData,
  setTargetWeight,
  clearUserData,
  userLoggedIn,
  setAuthData,
} = AuthSlice.actions;

// Export reducer
export default AuthSlice.reducer;

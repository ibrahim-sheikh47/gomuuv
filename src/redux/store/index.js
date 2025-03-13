import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import Auth from "../reducers/AuthSlice";
import Cart from "../reducers/CartSlice";
import Shop from "../reducers/ShopSlice";
import Nutrition from "../reducers/NutritionSlice";
import Workout from "../reducers/WorkoutSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};
const reducerToPersist = combineReducers({
  Auth,
  Cart,
  Shop,
  Nutrition,
  Workout,
});
const persistedReducer = persistReducer(persistConfig, reducerToPersist);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);
export { persistor, store };

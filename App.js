import "./src/tasks/trackingTasks";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Provider, useDispatch } from "react-redux";

// APP NAVIGATOR
import { NavigationContainer } from "@react-navigation/native";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigator from "./src/navigation/AppNavigator/AppNavigator";
import { persistor, store } from "./src/redux/store";
import { LogBox } from "react-native";
import { LoaderProvider } from "./src/contexts/LoaderContext";
import AppLoader from "./src/components/AppLoader";
import { toastConfig } from "./src/components/toastMessage";
import * as Location from "expo-location";
import { BACKGROUND_TASK, STORAGE_KEYS } from "./src/tasks/trackingTasks";
import { resetStats } from "./src/redux/reducers/trackingSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("./src/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("./src/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Light": require("./src/assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("./src/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("./src/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("./src/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Italic": require("./src/assets/fonts/Poppins-Italic.ttf"), // If available
  });

  const clearBackgroundData = async () => {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK
    );
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.LAST_COORDS,
      STORAGE_KEYS.TOTAL_DISTANCE,
      STORAGE_KEYS.START_TIME,
      STORAGE_KEYS.PATH,
    ]);
    if (isRunning) {
      Location.stopLocationUpdatesAsync(BACKGROUND_TASK);
    }

    store.dispatch(resetStats());
  };

  const init = async () => {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK
    );
    if (!isRunning) {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.LAST_COORDS,
        STORAGE_KEYS.TOTAL_DISTANCE,
        STORAGE_KEYS.START_TIME,
        STORAGE_KEYS.PATH,
      ]);
      store.dispatch(resetStats());
    }
  };

  useEffect(() => {
    init();

    return () => {
      (async () => {
        await clearBackgroundData();
      })();
    };
  }, []);

  useEffect(() => {
    LogBox.ignoreAllLogs();
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LoaderProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <NavigationContainer>
              <AppNavigator />
              <Toast topOffset={60} config={toastConfig} />
              <AppLoader />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}

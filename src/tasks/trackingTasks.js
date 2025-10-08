// trackingTasks.js
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store";
import { updateStats } from "../redux/reducers/trackingSlice";
import haversine from "haversine";

export const BACKGROUND_TASK = "BACKGROUND_TRACKING_TASK";
export const STORAGE_KEYS = {
  PATH: "TRACK_PATH",
  START_TIME: "TRACK_START_TIME",
  LAST_COORDS: "TRACK_LAST_COORDS",
  TOTAL_DISTANCE: "TRACK_TOTAL_DISTANCE",
};

const convertThreshold = (unit, thresholdInMeters = 3.5) => {
  switch (unit) {
    case "km":
      return thresholdInMeters / 1000;
    case "mile":
      return thresholdInMeters / 1609.34;
    default:
      return thresholdInMeters;
  }
};

TaskManager.defineTask(BACKGROUND_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Background tracking error:", error);
    return;
  }

  try {
    const { locations } = data || {};
    if (!locations || locations.length === 0) return;

    const { latitude, longitude } = locations[0].coords;

    // Load previous state
    const lastCoords = JSON.parse(
      await AsyncStorage.getItem(STORAGE_KEYS.LAST_COORDS)
    );
    const savedStartTime =
      parseInt(await AsyncStorage.getItem(STORAGE_KEYS.START_TIME), 10) ||
      Date.now();
    const isInitial = !lastCoords;
    let totalDistance =
      parseFloat(await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_DISTANCE)) || 0;

    let distance = 0;
    let threshold;
    if (lastCoords || isInitial) {
      if (!isInitial) {
        distance = haversine(
          lastCoords,
          { latitude, longitude },
          {
            unit: data?.unit || "meter",
          }
        );
        threshold = convertThreshold(data?.unit || "meter");
      }
      if (distance >= threshold || isInitial) {
        totalDistance += distance;

        // Update last coordinates
        const newCoords = { latitude, longitude };
        await AsyncStorage.setItem(
          STORAGE_KEYS.LAST_COORDS,
          JSON.stringify(newCoords)
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.TOTAL_DISTANCE,
          totalDistance.toString()
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.START_TIME,
          savedStartTime.toString()
        );

        // Save location path
        const loc = { latitude, longitude, timestamp: Date.now() };
        const stored =
          JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.PATH)) || [];
        stored.push(loc);
        await AsyncStorage.setItem(STORAGE_KEYS.PATH, JSON.stringify(stored));

        // Update Redux store with distance
        store.dispatch(updateStats({ distance: totalDistance, location: loc }));

        console.log(
          `Background location saved: ${latitude},${longitude} | Distance: ${totalDistance.toFixed(
            3
          )} m`
        );
      }
    }
  } catch (err) {
    console.error("Background task processing error:", err);
  }
});

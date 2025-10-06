import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Alert, AppState, Linking, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store";
import { updateStats, resetStats } from "../redux/reducers/trackingSlice";

const BACKGROUND_TASK = "BACKGROUND_TRACKING_TASK";
const STORAGE_KEYS = {
  PATH: "TRACK_PATH",
  START_TIME: "TRACK_START_TIME",
  LAST_COORDS: "TRACK_LAST_COORDS",
  TRACKING_ACTIVE: "TRACKING_ACTIVE",
};

let startTime = null;
let timer = null;
let lastCoords = null;
let trackingActive = false;

// --- Distance calculation
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// --- Persistent state management
const saveTrackingState = async (state) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.TRACKING_ACTIVE,
      JSON.stringify(state)
    );
  } catch (err) {
    console.warn("Save tracking state error:", err);
  }
};

const loadTrackingState = async () => {
  try {
    const state = await AsyncStorage.getItem(STORAGE_KEYS.TRACKING_ACTIVE);
    return state ? JSON.parse(state) : false;
  } catch {
    return false;
  }
};

const saveStartTime = async (time) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.START_TIME, time.toString());
  } catch (err) {
    console.warn("Save start time error:", err);
  }
};

const loadStartTime = async () => {
  try {
    const time = await AsyncStorage.getItem(STORAGE_KEYS.START_TIME);
    return time ? parseInt(time, 10) : null;
  } catch {
    return null;
  }
};

const saveLastCoords = async (coords) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_COORDS,
      JSON.stringify(coords)
    );
  } catch (err) {
    console.warn("Save coords error:", err);
  }
};

const loadLastCoords = async () => {
  try {
    const coords = await AsyncStorage.getItem(STORAGE_KEYS.LAST_COORDS);
    return coords ? JSON.parse(coords) : null;
  } catch {
    return null;
  }
};

// --- Save / Load path for map replay
const saveLocationToStorage = async (loc) => {
  try {
    const stored =
      JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.PATH)) || [];
    stored.push(loc);
    await AsyncStorage.setItem(STORAGE_KEYS.PATH, JSON.stringify(stored));
  } catch (err) {
    console.warn("Save path error:", err);
  }
};

export const getSavedPath = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.PATH);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearSavedPath = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PATH);
  } catch (err) {
    console.warn("Clear path error:", err);
  }
};

const clearAllTrackingData = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.PATH),
      AsyncStorage.removeItem(STORAGE_KEYS.START_TIME),
      AsyncStorage.removeItem(STORAGE_KEYS.LAST_COORDS),
      AsyncStorage.removeItem(STORAGE_KEYS.TRACKING_ACTIVE),
    ]);
  } catch (err) {
    console.warn("Clear tracking data error:", err);
  }
};

// --- Background Task
TaskManager.defineTask(BACKGROUND_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Background tracking error:", error);
    return;
  }

  try {
    const { locations } = data || {};
    if (!locations || locations.length === 0) return;

    const { latitude, longitude } = locations[0].coords;

    // Load last coords if not in memory
    if (!lastCoords) {
      lastCoords = await loadLastCoords();
    }

    let distance = 0;
    if (lastCoords) {
      distance = getDistanceFromLatLonInKm(
        lastCoords.latitude,
        lastCoords.longitude,
        latitude,
        longitude
      );
    }

    lastCoords = { latitude, longitude };
    await saveLastCoords(lastCoords);

    // Calculate duration from saved start time
    const savedStartTime = await loadStartTime();
    const duration = savedStartTime
      ? Math.floor((Date.now() - savedStartTime) / 1000)
      : 0;

    const loc = { latitude, longitude, timestamp: Date.now() };

    store.dispatch(updateStats({ distance, duration, location: loc }));
    await saveLocationToStorage(loc);
  } catch (err) {
    console.error("Background task processing error:", err);
  }
});

export default class TrackingHelper {
  constructor(onUpdate) {
    this.onUpdate = onUpdate;
    this.appState = AppState.currentState;
    this.appListener = null;
    this.locationWatcher = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    // Restore state if app was killed during tracking
    const wasTracking = await loadTrackingState();
    if (wasTracking) {
      const savedStartTime = await loadStartTime();
      const savedCoords = await loadLastCoords();

      if (savedStartTime) {
        startTime = savedStartTime;
        lastCoords = savedCoords;
        trackingActive = true;

        // Resume tracking
        console.log("Resuming tracking from previous session");
        await this.resumeTracking();
      }
    }

    this.isInitialized = true;
  }

  async resumeTracking() {
    this.appListener = AppState.addEventListener("change", this.handleAppState);

    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      this.showGPSAlert();
      await this.stop();
      return;
    }

    // Restart foreground timer
    this.startTimer();

    await this.startWatchingLocation();

    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK
    );
    if (!isRunning) {
      await this.startBackgroundTracking();
    }

    await this.checkAndUpdate();
  }

  startTimer() {
    if (timer) clearInterval(timer);

    timer = setInterval(() => {
      if (!startTime) return;

      const duration = Math.floor((Date.now() - startTime) / 1000);
      const currentState = store.getState().tracking;

      store.dispatch(updateStats({ duration }));

      this.onUpdate?.({
        active: true,
        duration,
        distance: currentState?.distance || 0,
      });
    }, 1000);
  }

  async start() {
    if (trackingActive) {
      console.log("Tracking already active");
      return;
    }

    trackingActive = true;
    await saveTrackingState(true);

    this.appListener = AppState.addEventListener("change", this.handleAppState);

    const granted = await this.requestPermissions();
    if (!granted) {
      trackingActive = false;
      await saveTrackingState(false);
      return;
    }

    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      this.showGPSAlert();
      trackingActive = false;
      await saveTrackingState(false);
      return;
    }

    // Reset everything
    store.dispatch(resetStats());
    await clearAllTrackingData();

    startTime = Date.now();
    lastCoords = null;

    await saveStartTime(startTime);
    await saveTrackingState(true);

    // ✅ Immediate callback
    this.onUpdate?.({ active: true, distance: 0, duration: 0 });

    // ✅ Start foreground timer
    this.startTimer();

    // ✅ Start location tracking
    try {
      await this.startWatchingLocation();
      await this.startBackgroundTracking();
      await this.checkAndUpdate();
    } catch (err) {
      console.error("Failed to start tracking:", err);
      await this.stop();
      Alert.alert("Error", "Failed to start tracking. Please try again.");
    }
  }

  async stop() {
    trackingActive = false;
    await saveTrackingState(false);

    if (this.appListener) {
      this.appListener.remove();
      this.appListener = null;
    }

    if (this.locationWatcher) {
      this.locationWatcher.remove();
      this.locationWatcher = null;
    }

    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    try {
      const running = await Location.hasStartedLocationUpdatesAsync(
        BACKGROUND_TASK
      );
      if (running) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_TASK);
      }
    } catch (err) {
      console.warn("Stop background error:", err);
    }

    // Clear tracking data
    startTime = null;
    lastCoords = null;

    this.onUpdate?.({ active: false });
  }

  async requestPermissions() {
    try {
      const { status: fg } = await Location.requestForegroundPermissionsAsync();

      if (fg !== "granted") {
        Alert.alert(
          "Location Permission Needed",
          "Foreground location permission is required for tracking.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }

      const { status: bg } = await Location.requestBackgroundPermissionsAsync();

      if (bg !== "granted") {
        Alert.alert(
          "Background Permission Needed",
          "Please grant 'Always Allow' permission for background tracking.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }

      console.log("Permissions granted:", fg, bg);
      return true;
    } catch (err) {
      console.error("Permission request error:", err);
      return false;
    }
  }

  async checkAndUpdate() {
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled && trackingActive) {
        this.showGPSAlert();
        return;
      }

      const location = await this.getUserLocation();
      const currentState = store.getState().tracking;

      this.onUpdate?.({
        permission: "granted",
        servicesEnabled,
        location,
        active: trackingActive,
        distance: currentState?.distance || 0,
        duration: currentState?.duration || 0,
      });
    } catch (err) {
      console.warn("Check and update error:", err);
    }
  }

  async getUserLocation() {
    try {
      const cached = await Location.getLastKnownPositionAsync();

      try {
        const fresh = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Location timeout")), 5000)
          ),
        ]);
        return fresh;
      } catch {
        return cached;
      }
    } catch (err) {
      console.warn("Get user location error:", err);
      return null;
    }
  }

  async startWatchingLocation() {
    if (this.locationWatcher) {
      this.locationWatcher.remove();
    }

    try {
      this.locationWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 1000,
        },
        async (loc) => {
          try {
            const { latitude, longitude } = loc.coords;

            let distance = 0;
            if (lastCoords) {
              distance = getDistanceFromLatLonInKm(
                lastCoords.latitude,
                lastCoords.longitude,
                latitude,
                longitude
              );
            }

            lastCoords = { latitude, longitude };
            await saveLastCoords(lastCoords);

            const point = { latitude, longitude, timestamp: Date.now() };
            const duration = startTime
              ? Math.floor((Date.now() - startTime) / 1000)
              : 0;

            store.dispatch(
              updateStats({ distance, duration, location: point })
            );
            await saveLocationToStorage(point);

            const currentState = store.getState().tracking;

            this.onUpdate?.({
              active: true,
              distance: currentState?.distance || 0,
              duration: currentState?.duration || duration,
              location: point,
            });
          } catch (err) {
            console.error("Location update error:", err);
          }
        }
      );
    } catch (err) {
      console.error("Failed to start watching location:", err);
      throw err;
    }
  }

  async startBackgroundTracking() {
    try {
      const isRunning = await Location.hasStartedLocationUpdatesAsync(
        BACKGROUND_TASK
      );
      if (isRunning) {
        console.log("Background tracking already running");
        return;
      }

      await Location.startLocationUpdatesAsync(BACKGROUND_TASK, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 5,
        timeInterval: 1000,
        showsBackgroundLocationIndicator: true,
        pausesUpdatesAutomatically: false,
        activityType: Location.ActivityType.Fitness,

        foregroundService: {
          notificationTitle: "Tracking Active",
          notificationBody: "Your activity route is being tracked.",
          notificationColor: "#1EB1FC",
        },
      });

      console.log("Background tracking started");
    } catch (err) {
      console.error("Failed to start background tracking:", err);
      throw err;
    }
  }

  showGPSAlert() {
    const message =
      Platform.OS === "ios"
        ? "Please enable Location Services in Settings."
        : "Please enable GPS for accurate tracking.";

    Alert.alert("Location Services Disabled", message, [
      { text: "Open Settings", onPress: () => Linking.openSettings() },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  handleAppState = async (nextAppState) => {
    try {
      if (
        this.appState.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        await this.checkAndUpdate();

        // Verify tracking is still running
        if (trackingActive) {
          const isRunning = await Location.hasStartedLocationUpdatesAsync(
            BACKGROUND_TASK
          );
          if (!isRunning) {
            console.log("Restarting background tracking");
            await this.startBackgroundTracking();
          }
        }
      }
      this.appState = nextAppState;
    } catch (err) {
      console.error("App state change error:", err);
    }
  };

  // ✅ External helper to check tracking status
  static async isTracking() {
    try {
      const running = await Location.hasStartedLocationUpdatesAsync(
        BACKGROUND_TASK
      );
      const savedState = await loadTrackingState();
      return trackingActive || running || savedState;
    } catch {
      return trackingActive;
    }
  }

  // ✅ Get current tracking stats
  static getStats() {
    const state = store.getState().tracking;
    const duration = startTime
      ? Math.floor((Date.now() - startTime) / 1000)
      : 0;
    return {
      distance: state?.distance || 0,
      duration: state?.duration || duration,
      active: trackingActive,
    };
  }

  // ✅ Cleanup method
  async cleanup() {
    await this.stop();
    await clearAllTrackingData();
    this.isInitialized = false;
  }
}

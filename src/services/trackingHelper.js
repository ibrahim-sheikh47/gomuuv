import * as Location from "expo-location";
import { Alert, AppState, Linking, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store";
import { resetStats, updateStatsAsync } from "../redux/reducers/trackingSlice";
import { BACKGROUND_TASK } from "../tasks/trackingTasks"; // Import task

const STORAGE_KEYS = {
  PATH: "TRACK_PATH",
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

// --- Persistent state
const saveTrackingState = async (state) =>
  AsyncStorage.setItem(STORAGE_KEYS.TRACKING_ACTIVE, JSON.stringify(state));
const loadTrackingState = async () => {
  const state = await AsyncStorage.getItem(STORAGE_KEYS.TRACKING_ACTIVE);
  return state ? JSON.parse(state) : false;
};
const saveStartTime = async (time) =>
  AsyncStorage.setItem(STORAGE_KEYS.START_TIME, time.toString());
const loadStartTime = async () => {
  const time = await AsyncStorage.getItem(STORAGE_KEYS.START_TIME);
  return time ? parseInt(time, 10) : null;
};
const saveLastCoords = async (coords) =>
  AsyncStorage.setItem(STORAGE_KEYS.LAST_COORDS, JSON.stringify(coords));
const loadLastCoords = async () => {
  const coords = await AsyncStorage.getItem(STORAGE_KEYS.LAST_COORDS);
  return coords ? JSON.parse(coords) : null;
};
const saveLocationToStorage = async (loc) => {
  const stored =
    JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.PATH)) || [];
  stored.push(loc);
  await AsyncStorage.setItem(STORAGE_KEYS.PATH, JSON.stringify(stored));
};
const clearAllTrackingData = async () => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.PATH,
    STORAGE_KEYS.START_TIME,
    STORAGE_KEYS.LAST_COORDS,
    STORAGE_KEYS.TRACKING_ACTIVE,
  ]);
};

// --- Tracking Helper
export default class TrackingHelper {
  constructor(onUpdate) {
    this.onUpdate = onUpdate;
    this.appState = AppState.currentState;
    this.appListener = null;
    this.locationWatcher = null;
    this.isInitialized = false;
    console.log("TrackingHelper created");
  }

  async initialize() {
    if (this.isInitialized) return;

    const wasTracking = await loadTrackingState();
    if (wasTracking) {
      startTime = await loadStartTime();
      lastCoords = await loadLastCoords();
      trackingActive = true;
      await this.resumeTracking();
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

    this.startTimer();
    await this.startWatchingLocation();
    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK
    );
    if (!isRunning) await this.startBackgroundTracking();
    await this.checkAndUpdate();
  }

  startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      if (!startTime) return;
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const currentState = store.getState().tracking;
      store.dispatch(updateStatsAsync({ duration }));
      this.onUpdate?.({
        active: true,
        duration,
        distance: currentState?.distance || 0,
      });
    }, 1000);
  }

  async start() {
    if (trackingActive) return;

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

    store.dispatch(resetStats());
    await clearAllTrackingData();
    startTime = Date.now();
    lastCoords = null;
    await saveStartTime(startTime);

    this.onUpdate?.({ active: true, distance: 0, duration: 0 });
    this.startTimer();
    await this.startWatchingLocation();
    await this.startBackgroundTracking();
    await this.checkAndUpdate();
  }

  async stop() {
    trackingActive = false;
    await saveTrackingState(false);

    if (this.appListener) this.appListener.remove();
    if (this.locationWatcher) this.locationWatcher.remove();
    if (timer) clearInterval(timer);

    const running = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK
    );
    if (running) await Location.stopLocationUpdatesAsync(BACKGROUND_TASK);

    startTime = null;
    lastCoords = null;
    this.onUpdate?.({ active: false });
  }

  async requestPermissions() {
    const { status: fg } = await Location.requestForegroundPermissionsAsync();
    if (fg !== "granted") {
      Alert.alert(
        "Permission required",
        "Foreground location permission is needed."
      );
      return false;
    }

    const { status: bg } = await Location.requestBackgroundPermissionsAsync();
    if (bg !== "granted") {
      Alert.alert(
        "Permission required",
        "Background location permission is needed."
      );
      return false;
    }

    return true;
  }

  async startWatchingLocation() {
    if (this.locationWatcher) this.locationWatcher.remove();
    this.locationWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
        timeInterval: 1000,
      },
      async (loc) => {
        const { latitude, longitude } = loc.coords;
        const distance = lastCoords
          ? getDistanceFromLatLonInKm(
              lastCoords.latitude,
              lastCoords.longitude,
              latitude,
              longitude
            )
          : 0;
        lastCoords = { latitude, longitude };
        await saveLastCoords(lastCoords);
        const point = { latitude, longitude, timestamp: Date.now() };
        const duration = startTime
          ? Math.floor((Date.now() - startTime) / 1000)
          : 0;
        store.dispatch(updateStatsAsync({ distance, duration, location: point }));
        await saveLocationToStorage(point);
        this.onUpdate?.({
          active: true,
          distance,
          duration,
          location: point,
        });
      }
    );
  }

  async startBackgroundTracking() {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK
    );
    if (isRunning) return;

    await Location.startLocationUpdatesAsync(BACKGROUND_TASK, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 5,
      timeInterval: 1000,
      showsBackgroundLocationIndicator: true,
      pausesUpdatesAutomatically: false,
      activityType: Location.ActivityType.Fitness,
      foregroundService: {
        notificationTitle: "Tracking Active",
        notificationBody: "Your route is being tracked.",
        notificationColor: "#1EB1FC",
      },
    });
  }

  showGPSAlert() {
    const message =
      Platform.OS === "ios"
        ? "Please enable Location Services in Settings."
        : "Please enable GPS for accurate tracking.";
    Alert.alert("Location Disabled", message, [
      { text: "Open Settings", onPress: () => Linking.openSettings() },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  handleAppState = async (nextAppState) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      await this.checkAndUpdate();
      if (trackingActive) {
        const isRunning = await Location.hasStartedLocationUpdatesAsync(
          BACKGROUND_TASK
        );
        if (!isRunning) await this.startBackgroundTracking();
      }
    }
    this.appState = nextAppState;
  };

  async checkAndUpdate() {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    const location = await this.getUserLocation();
    const currentState = store.getState().tracking;
    this.onUpdate?.({
      servicesEnabled,
      location,
      active: trackingActive,
      distance: currentState?.distance || 0,
      duration: currentState?.duration || 0,
    });
  }

  async getUserLocation() {
    try {
      return await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
    } catch {
      return null;
    }
  }
}

import * as Location from "expo-location";
import { Alert, AppState, Linking, Platform } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";
import { BACKGROUND_TASK, STORAGE_KEYS } from "../tasks/trackingTasks";
import { toastMessage } from "../components/toastMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class LocationHelper {
  constructor(onUpdate) {
    this.onUpdate = onUpdate; // callback for updates (location/permission/GPS)
    this.appState = AppState.currentState;
    this.appListener = null;
    this.locationWatcher = null;
  }

  // Start monitoring permissions, GPS, and location
  async start() {
    // Watch app state (foreground/background)
    this.appListener = AppState.addEventListener("change", this.handleAppState);

    // Immediately check everything
    await this.checkAndUpdate();

    // Optionally start watching location continuously
    this.startWatchingLocation();
  }

  // Stop monitoring
  stop() {
    if (this.appListener) this.appListener.remove();
    if (this.locationWatcher) this.locationWatcher.remove();
  }

  async openLocationSettings() {
    try {
      if (Platform.OS === "android") {
        // Open Android location settings directly
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
        );
      } else {
        // On iOS: open app settings
        await Linking.openSettings();
      }
    } catch (err) {
      console.error("Failed to open location settings:", err);
    }
  }

  async checkForPermissionsAndStartTracking() {
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        Alert.alert(
          "Location Off",
          "Please turn on location services to continue.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => this.openLocationSettings(),
            },
          ]
        );

        return false;
      }

      const fgStatus = await Location.getForegroundPermissionsAsync();
      if (fgStatus.status !== "granted") {
        const fg = await Location.requestForegroundPermissionsAsync();
        if (fg.status !== "granted") {
          return false;
        }
      }

      const bgStatus = await Location.getBackgroundPermissionsAsync();
      if (bgStatus.status !== "granted") {
        const bg = await Location.requestBackgroundPermissionsAsync();
        if (bg.status !== "granted") {
          return false;
        }
      }

      const isRunning = await Location.hasStartedLocationUpdatesAsync(
        BACKGROUND_TASK
      );
      if (!isRunning) {
        await Location.startLocationUpdatesAsync(BACKGROUND_TASK, {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 5,
          timeInterval: 1000,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "🧪 Test Tracking",
            notificationBody: "Background tracking active",
            notificationColor: "#FF0000",
          },
        });

        toastMessage({
          text1: "Session Started",
          text2: "Activity session has been started",
          type: "success",
        });
      }

      return true;
    } catch (err) {
      console.error("Permission check failed:", err);
      return false;
    }
  }

  async clearBackgroundData() {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK
    );
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TYPE,
      STORAGE_KEYS.LAST_COORDS,
      STORAGE_KEYS.TOTAL_DISTANCE,
      STORAGE_KEYS.START_TIME,
      STORAGE_KEYS.PATH,
    ]);
    if (isRunning) {
      Location.stopLocationUpdatesAsync(BACKGROUND_TASK);
    }
  }

  // Check permission + GPS + location
  async checkAndUpdate() {
    try {
      // Check permissions
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        let { status: requestStatus } =
          await Location.requestForegroundPermissionsAsync();
        status = requestStatus;
      }

      // Check if GPS (location services) is enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        if (Platform.OS === "ios") {
          Alert.alert(
            "Location Services Disabled",
            "Please enable Location Services in Settings to use this feature.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        }
        return false;
      }

      let location = null;
      if (status === "granted" && servicesEnabled) {
        location = await this.getUserLocation();
      }

      // Send result to callback
      this.onUpdate({
        permission: status, // "granted" | "denied"
        servicesEnabled, // true if GPS on
        location, // may be null if unavailable
      });
    } catch (error) {
      console.error("LocationHelper error:", error);
      this.onUpdate({
        permission: "error",
        servicesEnabled: false,
        location: null,
        error: error.message,
      });
    }
  }

  // Hybrid location fetch (cached + fresh)
  async getUserLocation() {
    let cached = await Location.getLastKnownPositionAsync();
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
  }

  // Continuous location updates
  async startWatchingLocation() {
    if (this.locationWatcher) {
      this.locationWatcher.remove();
      this.locationWatcher = null;
    }

    this.locationWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 5, // update every 5m
      },
      (loc) => {
        this.onUpdate({
          permission: "granted",
          servicesEnabled: true,
          location: loc,
        });
      }
    );
  }

  // Handle app foreground/background
  handleAppState = async (nextAppState) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // Re-check when app comes to foreground
      await this.checkAndUpdate();
    }
    this.appState = nextAppState;
  };
}

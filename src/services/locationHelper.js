import * as Location from "expo-location";
import { Alert, AppState, Linking, Platform } from "react-native";

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

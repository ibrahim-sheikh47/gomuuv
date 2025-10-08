import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { BACKGROUND_TASK } from "../../tasks/trackingTasks"; // Ensure task defined
import { useSelector } from "react-redux";

export default function TrackingTestScreen() {
  const [logs, setLogs] = useState([]);
  const [permissionStatus, setPermissionStatus] = useState({});
  const [locationStatus, setLocationStatus] = useState({});
  const [taskStatus, setTaskStatus] = useState({});
  const { distance, duration, locations } = useSelector(
    (state) => state.tracking
  );

  const addLog = (msg, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { message: msg, type, timestamp }]);
    console.log(`[${type.toUpperCase()}] ${msg}`);
  };

  useEffect(() => {
    addLog("Screen mounted", "success");
    checkAll();
  }, []);

  const checkAll = async () => {
    await checkPermissions();
    await checkLocationServices();
    await checkBackgroundTask();
  };

  const checkPermissions = async () => {
    const fg = await Location.getForegroundPermissionsAsync();
    const bg = await Location.getBackgroundPermissionsAsync();
    setPermissionStatus({ foreground: fg.status, background: bg.status });
    if (fg.status === "granted" && bg.status === "granted")
      addLog("✅ All permissions granted", "success");
    else
      addLog(
        `❌ Permissions missing - FG: ${fg.status}, BG: ${bg.status}`,
        "error"
      );
  };

  const requestPermissions = async () => {
    const fg = await Location.requestForegroundPermissionsAsync();
    addLog(`Foreground: ${fg.status}`);
    if (fg.status === "granted") {
      const bg = await Location.requestBackgroundPermissionsAsync();
      addLog(`Background: ${bg.status}`);
    }
    await checkPermissions();
  };

  const checkLocationServices = async () => {
    const enabled = await Location.hasServicesEnabledAsync();
    const provider = await Location.getProviderStatusAsync();
    setLocationStatus({ enabled, ...provider });
    addLog(
      enabled ? "✅ Location enabled" : "❌ Location disabled",
      enabled ? "success" : "error"
    );
  };

  const checkBackgroundTask = async () => {
    const registered = await TaskManager.getRegisteredTasksAsync();
    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK
    );
    setTaskStatus({ registered: registered.map((t) => t.taskName), isRunning });
    if (registered.find((t) => t.taskName === BACKGROUND_TASK))
      addLog("✅ Background task registered", "success");
    else addLog("❌ Background task NOT registered", "error");
    addLog(
      isRunning ? "✅ Background task running" : "⚠️ Not running",
      isRunning ? "success" : "warning"
    );
  };

  const startBackgroundTask = async () => {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK
    );
    if (!isRunning) {
      await Location.startLocationUpdatesAsync(BACKGROUND_TASK, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 5,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "🧪 Test Tracking",
          notificationBody: "Background tracking active",
          notificationColor: "#FF0000",
        },
      });
      addLog("✅ Background task started", "success");
      await checkBackgroundTask();
    }
  };

  const stopBackgroundTask = async () => {
    await Location.stopLocationUpdatesAsync(BACKGROUND_TASK);
    addLog("✅ Background task stopped", "success");
    await checkBackgroundTask();
  };

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: "#f5f5f5" }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 15,
        }}
      >
        🔧 Tracking Debug
      </Text>

      <View style={{ marginBottom: 15 }}>
        <Text>
          Permissions: FG: {permissionStatus.foreground} | BG:{" "}
          {permissionStatus.background}
        </Text>
        <Text>Location: {locationStatus.enabled ? "✅" : "❌"}</Text>
        <Text>Task running: {taskStatus.isRunning ? "✅" : "❌"}</Text>
        <Text>
          Distance / Duration: {distance.toFixed(3)}km / {duration}s
        </Text>
        <Text>
          Journey:{" "}
          {locations.map((l) =>
            JSON.stringify({
              latitude: l.latitude,
              longitude: l.longitude,
              timestamp: l.timestamp,
            })
          )}
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <TouchableOpacity onPress={requestPermissions}>
          <Text>Request Permissions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={startBackgroundTask}>
          <Text>Start BG Task</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={stopBackgroundTask}>
          <Text>Stop BG Task</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={checkAll}>
          <Text>Refresh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ marginTop: 15 }}>
        {logs.map((log, i) => (
          <Text
            key={i}
            style={{
              color:
                log.type === "error"
                  ? "red"
                  : log.type === "success"
                  ? "green"
                  : "black",
            }}
          >
            [{log.timestamp}] {log.message}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

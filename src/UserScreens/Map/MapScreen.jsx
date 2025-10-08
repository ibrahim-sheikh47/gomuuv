import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Map from "../../components/Maps";
import CustomButton from "../../components/CustomButton";
import { FontSize } from "../../utils/font";
import { StatusBar, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { BACKGROUND_TASK, STORAGE_KEYS } from "../../tasks/trackingTasks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { formatDistance } from "../../utils/utilities";

const MapScreen = ({ route }) => {
  const navigation = useNavigation();
  const { distance } = useSelector((state) => state.tracking);
  const params = route?.params;
  const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 60 : StatusBar.currentHeight;

  const [elapsedTime, setElapsedTime] = useState(0);
  const [snapshot, setSnapshot] = useState(null);
  const [tracking, setTracking] = useState(true);

  useEffect(() => {
    if (snapshot) {
      endTrackingAndDisplayResults();
    }
  }, [snapshot]);

  const endTrackingAndDisplayResults = async () => {
    await clearBackgroundData();

    navigation.navigate("FinishActivity", {
      goal: params.goal,
      activityName: params.activityName,
      activityType: params.activityType,
      time: formatElapsedTime2(elapsedTime),
      distanceUnit: params.goal?.targetDistance?.unit || "m",
      heartRate: params.heartRate,
      snapshot: snapshot,
    });
  };

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
  };

  const onLocationUpdate = ({ time, snapshot }) => {
    setElapsedTime(time);
    setSnapshot(snapshot);
  };

  const stopTracking = () => {
    setTracking(false);
  };

  const formatElapsedTime2 = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes, seconds: seconds % 60 };
  };

  const formatElapsedTime = (totalSeconds = 0) => {
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    }

    if (totalSeconds < 3600) {
      const minutes = parseInt(totalSeconds / 60);
      const secs = parseInt(totalSeconds % 60);
      return `${minutes}m ${secs}s`;
    }

    const hours = parseInt(totalSeconds / 3600);
    const minutes = parseInt(totalSeconds / 60);
    const secs = parseInt(totalSeconds % 60);
    return `${hours || 0}h ${minutes || 0}m ${secs || 0}s`;
  };

  return (
    <View style={{ flex: 1 }}>
      <Map onLocationUpdate={onLocationUpdate} tracking={tracking} />

      <View
        style={{
          position: "absolute",
          top: STATUS_BAR_HEIGHT,
          left: 0,
          right: 0,
        }}
      >
        <Text
          style={{
            backgroundColor: "#000000aa",
            fontSize: FontSize.small,
            color: "white",
            textAlign: "center",
          }}
        >
          Time: {formatElapsedTime(elapsedTime)}
        </Text>
        <Text
          style={{
            backgroundColor: "#000000aa",
            fontSize: FontSize.small,
            color: "white",
            textAlign: "center",
          }}
        >
          Distance:{" "}
          {
            formatDistance(distance, params.goal?.targetDistance?.unit || "m")
              .formatted
          }
        </Text>
      </View>

      <CustomButton
        title={"End Tracking"}
        style={{
          bottom: 20,
          width: "90%",
          position: "absolute",
          alignSelf: "center",
        }}
        onPress={stopTracking}
      />
    </View>
  );
};

export default MapScreen;

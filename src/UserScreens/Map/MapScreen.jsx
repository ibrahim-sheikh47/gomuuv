import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Map from "../../components/Maps";
import CustomButton from "../../components/CustomButton";
import { FontSize } from "../../utils/font";
import { StatusBar, Platform } from "react-native";
import { useNavigation, useParams } from "@react-navigation/native";

const MapScreen = ({ route }) => {
  const navigation = useNavigation();
  const params = route?.params;
  const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 60 : StatusBar.currentHeight;

  const [location, setLocation] = useState(null); // To store the address
  const [totalDistance, setTotalDistance] = useState(0); // To store total distance
  const [elapsedTime, setElapsedTime] = useState(0); // To store the elapsed time
  const [coordinates, setCoordinates] = useState([]);
  const [snapshot, setSnapshot] = useState(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (snapshot) {
      navigation.navigate("FinishActivity", {
        goal: params.goal,
        activityName: params.activityName,
        activityType: params.activityType,
        distance: (totalDistance / 1609.34).toFixed(2),
        time: elapsedTime,
        distanceUnit: "mi",
        heartRate: params.heartRate,
        calories: params.calories,
        snapshot: snapshot,
      });
    }
  }, [snapshot]);

  const onLocationUpdate = ({
    address,
    distance,
    time,
    pathCoordinates,
    snapshot,
  }) => {
    setLocation(address);
    setTotalDistance(distance);
    setElapsedTime(time);
    setCoordinates(pathCoordinates);
    setSnapshot(snapshot);
  };

  const startTracking = () => {
    setTracking(true);
    // Optionally handle additional logic for starting tracking
  };

  const stopTracking = () => {
    setTracking(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Map
        onLocationUpdate={onLocationUpdate} // Pass the callback to Map.js
        address={location}
        pathCoordinates={[]}
        tracking={tracking} // Pass the tracking state to Map.js
      />

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
          {location || "Fetching address..."}
        </Text>
        <Text
          style={{
            backgroundColor: "#000000aa",
            fontSize: FontSize.small,
            color: "white",
            textAlign: "center",
          }}
        >
          Time: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s
        </Text>
        <Text
          style={{
            backgroundColor: "#000000aa",
            fontSize: FontSize.small,
            color: "white",
            textAlign: "center",
          }}
        >
          Distance: {totalDistance.toFixed(2)} meters
        </Text>
      </View>

      <CustomButton
        title={tracking ? "End" : "Start"} // Dynamically change button text based on tracking status
        style={{
          bottom: 20,
          width: "90%",
          position: "absolute",
          alignSelf: "center",
        }}
        onPress={tracking ? stopTracking : startTracking} // Call start/stop based on tracking status
      />
    </View>
  );
};

export default MapScreen;

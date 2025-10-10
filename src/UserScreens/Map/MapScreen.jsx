import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Map from "../../components/Maps";
import CustomButton from "../../components/CustomButton";
import { FontSize } from "../../utils/font";
import { StatusBar, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  formatDistance,
  formatElapsedTime,
  formatElapsedTime2,
} from "../../utils/utilities";
import LocationHelper from "../../services/locationHelper";

const MapScreen = ({ route }) => {
  const navigation = useNavigation();
  const { distance } = useSelector((state) => state.tracking);
  const params = route?.params;
  const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 60 : StatusBar.currentHeight;

  const [elapsedTime, setElapsedTime] = useState(0);
  const [snapshot, setSnapshot] = useState(null);
  const [tracking, setTracking] = useState(true);
  const helper = new LocationHelper(null);

  useEffect(() => {
    if (snapshot) {
      endTrackingAndDisplayResults();
    }
  }, [snapshot]);

  const endTrackingAndDisplayResults = async () => {
    await helper.clearBackgroundData();

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

  const onLocationUpdate = ({ time, snapshot }) => {
    setElapsedTime(time);
    setSnapshot(snapshot);
  };

  const stopTracking = () => {
    setTracking(false);
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

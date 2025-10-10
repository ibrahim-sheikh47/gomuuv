import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import { CustomCard } from "../../components/CustomCard";
import icons from "../../constants/icons";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../constants/colors";
import HeartRateIcon from "../../assets/svgs/HeartRateIcon";
import CaloriesIcon from "../../assets/svgs/CaloriesIcon";
import TimeIcon from "../../assets/svgs/TimeIcon";
import DistanceIcon from "../../assets/svgs/DistanceIcon";
import PaceIcon from "../../assets/svgs/PaceIcon";
import { FontSize } from "../../utils/font";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { useSelector } from "react-redux";
import { formatDistance } from "../../utils/utilities";
import { reset } from "../../navigation/RootNavigation";

const FinishActivity = () => {
  const route = useRoute();
  const { distance, calories } = useSelector((state) => state.tracking);
  const {
    goal,
    activityName,
    activityType,
    distanceUnit,
    time,
    heartRate,
    snapshot,
  } = route.params;

  const { token } = useSelector((state) => state.Auth);
  const navigation = useNavigation();

  const navigateBack = (data) => {
    navigation.reset({
      routes: [
        {
          name: "TabNavigator",
          params: {
            screen: "Home",
          },
        },
        {
          name: "ActivityDetailScreen",
          params: {
            goal: data,
            activityType,
            activityName,
            startSession: false,
          },
        },
      ],
      index: 1,
    });
  };

  const finishActivity = async () => {
    try {
      if (goal) {
        const response = await API.patch(
          `${END_POINTS.GOALS}`,
          {
            type: activityType,
            distance: {
              value: formatDistance(distance, distanceUnit).distance,
              unit: distanceUnit,
            },
            duration: {
              hours: time.hours,
              minutes: time.minutes,
              totalSeconds:
                time.hours * 3600 + time.minutes * 60 + time.seconds,
            },
            calories,
          },
          token
        );

        if (response?.data?.success) {
          navigateBack(response.data.data);
        }
      } else {
        const response = await API.patch(
          `${END_POINTS.PHYSICAL_ACTIVITIES}`,
          {
            type: activityType,
            distance: distance,
            duration: time.hours * 3600 + time.minutes * 60 + time.seconds,
            calories,
          },
          token
        );
        if (response?.data?.success) {
          navigateBack(null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const computePace = (timeObj, distance, unit = "m") => {
    const { hours = 0, minutes = 0, seconds = 0 } = timeObj;

    const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
    let dist = distance;
    if (unit === "km") dist = distance / 1000;
    if (unit === "mi") dist = distance / 1609.34;

    const timePerUnitInSeconds = dist > 0 ? timeInSeconds / dist : 0;
    const hoursTotal = timeInSeconds > 0 ? timeInSeconds / 3600 : 0;
    const paceUnitsPerHour = dist / hoursTotal;

    return {
      timePerUnit: timePerUnitInSeconds.toFixed(2),
      paceUnitsPerHour: parseFloat(paceUnitsPerHour.toFixed(2)),
      unit,
    };
  };

  const result = computePace(time, distance, distanceUnit);

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
    <Container>
      <Header title={`${activityName}`} showBackButton={true} />
      <ScrollView style={{ flex: 1, marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.bgColor,
              gap: 7,
              paddingVertical: 6,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}
          >
            <HeartRateIcon width={16} height={16} />
            <Text
              style={{
                fontSize: FontSize.small,
                fontFamily: "Poppins-Regular",
                color: "white",
              }}
            >
              {heartRate}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.bgColor,
              gap: 7,
              paddingVertical: 6,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}
          >
            <CaloriesIcon width={16} height={16} />
            <Text
              style={{
                fontSize: FontSize.small,
                fontFamily: "Poppins-Regular",
                color: "white",
              }}
            >
              {calories}
            </Text>
          </View>
        </View>
        {snapshot && (
          <Image
            source={{ uri: snapshot }}
            style={{
              width: "100%",
              height: 170,
              marginVertical: 20,
              resizeMode: "cover",
              borderRadius: 20,
            }}
          />
        )}
        <View style={styles.gridContainer}>
          <CustomCard
            label={`Time Per ${
              distanceUnit === "mi"
                ? "Mile"
                : distanceUnit === "km"
                ? "Km"
                : "Meter"
            }`}
            iconImage={icons.timePerMile}
            message={`${formatElapsedTime(result.timePerUnit)}/${distanceUnit}`}
          />
          <CustomCard
            label="Total Time"
            icon={TimeIcon}
            message={`${formatElapsedTime(
              time.hours * 3600 + time.minutes * 60 + time.seconds
            )}`}
            showGoal={goal}
            goal={`Goal: ${time.hours}hours ${time.minutes}mins daily`}
          />
        </View>
        <View style={styles.gridContainer}>
          <CustomCard
            label="Pace"
            icon={PaceIcon}
            message={`${result.paceUnitsPerHour.toFixed(2)} ${
              result.unit
            }/hour`}
          />
          <CustomCard
            label="Distance"
            icon={DistanceIcon}
            showGoal={goal}
            goal={`Goal: ${
              goal?.targetDistance?.value || 0
            }${distanceUnit} daily`}
            message={`${formatDistance(distance, distanceUnit).distance.toFixed(
              2
            )} ${distanceUnit}`}
          />
        </View>
      </ScrollView>
      <CustomButton
        title={"Finish"}
        style={{ marginTop: 20 }}
        onPress={finishActivity}
      />
    </Container>
  );
};

export default FinishActivity;

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
});

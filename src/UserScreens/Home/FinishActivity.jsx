import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import images from "../../constants/images";
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

const FinishActivity = () => {
  const route = useRoute();
  const {
    activityName,
    activityType,
    distance,
    distanceUnit,
    time,
    heartRate,
    calories,
    snapshot,
  } = route.params;

  const navigation = useNavigation();
  const { token } = useSelector((state) => state.Auth);

  // Convert time from seconds (assuming time is given in seconds)
  const timeInSeconds = time; // time is in seconds from params
  const distanceInMiles = distance; // Assuming distance is in miles

  // Calculate Time Per Mile (in minutes and seconds)
  const timePerMileInSeconds =
    timeInSeconds / (distanceInMiles > 0.0 ? distanceInMiles : 1);

  const minutesPerMile = Math.floor(timePerMileInSeconds / 60) || 0;
  const secondsPerMile = Math.round(timePerMileInSeconds % 60) || 0;

  // Calculate Pace (in miles per hour)
  const paceInHours = distanceInMiles / (timeInSeconds / 60) || 0; // timeInSeconds is divided by 3600 to convert time to hours
  const pace = paceInHours.toFixed(2) || 0; // Format the pace to 2 decimal places

  const finishActivity = async () => {
    try {
      const response = await API.patch(
        `${END_POINTS.GOALS}`,
        {
          type: activityType,
          distance: {
            value: distance,
            unit: "mi",
          },
          duration: {
            value: time / 60,
            unit: "minute",
          },
        },
        token
      );

      console.log(response.data.data);
      if (response?.data?.success) {
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
                goal: response.data.data,
                activityType,
                activityName,
              },
            },
          ],
          index: 1,
        });
      }
    } catch (error) {
      console.log(error);
    }
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
            label="Time Per Mile"
            iconImage={icons.timePerMile}
            message={`${minutesPerMile}m:${secondsPerMile}s/mi`}
          />
          <CustomCard
            label="Total Time"
            icon={TimeIcon}
            message={`${Math.floor(timeInSeconds / 60)}m ${
              timeInSeconds % 60
            }s`}
            goal={"Goal: 30 min daily"}
          />
        </View>
        <View style={styles.gridContainer}>
          <CustomCard
            label="Pace"
            icon={PaceIcon}
            message={`${pace} mi/minute`}
          />
          <CustomCard
            label="Distance"
            icon={DistanceIcon}
            goal={"Goal: 2mi daily"}
            message={`${distance} ${distanceUnit}`}
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

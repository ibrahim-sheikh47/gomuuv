import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AnimatedCircularProgress } from "react-native-circular-progress"; // Import Circular Progress
import { colors } from "../../constants/colors";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import images from "../../constants/images";

const EquipmentDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, workoutDetails } = route.params; // Destructure workoutDetails from params

  const [fill, setFill] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0); // Total duration in seconds

  useEffect(() => {
    if (workoutDetails) {
      const durationInSeconds = parseInt(workoutDetails.duration) * 60; // Convert minutes to seconds
      setTotalDuration(durationInSeconds);
      setRemainingTime(durationInSeconds);
    }
  }, [workoutDetails]);

  useEffect(() => {
    let interval;
    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
        setFill((prev) => prev + 100 / totalDuration); // Increment fill based on total duration
      }, 1000); // Update every second
    }

    return () => clearInterval(interval);
  }, [remainingTime, totalDuration]);

  const formattedTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  return (
    <Container>
      <Header title={category.label} showBackButton={true} />
      <View style={{ flex: 1 }}>
        <View style={styles.progressContainer}>
          {/* Circular Progress */}
          <AnimatedCircularProgress
            size={210}
            width={20}
            fill={fill}
            tintColor={colors.green}
            backgroundColor={colors.bgColor}
            rotation={0}
            lineCap="round"
          >
            {() => (
              <>
                <Text style={styles.remainingTime}>Remaining time</Text>
                <Text style={styles.remaining}>
                  {formattedTime(remainingTime)}
                </Text>
              </>
            )}
          </AnimatedCircularProgress>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 50,
              gap: 20,
              marginTop: 30,
            }}
          >
            <CustomButton
              style={{ flex: 1, backgroundColor: colors.bgColor, height: 40 }}
              textStyle={{ color: "white", fontSize: 14 }}
              title={"Reset"}
            />
            <CustomButton
              style={{ flex: 1, height: 40 }}
              title={"Continue"}
              textStyle={{ fontSize: 14 }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "Poppins-Medium",
              fontSize: 16,
            }}
          >
            Saved Workout
          </Text>
          <TouchableOpacity>
            <Image source={icons.edit} style={{ width: 12, height: 12 }} />
          </TouchableOpacity>
        </View>
        {workoutDetails ? (
          <TouchableOpacity style={styles.sessionContainer}>
            <Image source={images.treadmill} style={styles.sessionImage} />
            <Text style={styles.sessionTitleText}>
              {workoutDetails.workoutName}
            </Text>
            <View style={styles.sessionDetailsContainer}>
              <View style={styles.sessionDetail}>
                <Image style={styles.detailIcon} source={icons.calories} />
                <Text style={styles.detailText}>{workoutDetails.speed}</Text>
              </View>
              <View style={styles.sessionDetail}>
                <Image style={styles.detailIcon} source={icons.time} />
                <Text style={styles.detailText}>{workoutDetails.incline}</Text>
              </View>
              <View style={styles.sessionDetail}>
                <Image style={styles.detailIcon} source={icons.quadriceps} />
                <Text style={styles.detailText}>Quadriceps</Text>
              </View>
              <Image source={icons.nextBg} style={styles.nextIcon} />
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                color: "#AFAFAF",
                fontFamily: "Poppins-Medium",
                fontSize: 16,
              }}
            >
              No Saved Workouts
            </Text>
          </View>
        )}
      </View>
      <CustomButton
        title={"Log New Workout"}
        onPress={() => navigation.navigate("NewWorkout", { category })}
        style={{ marginBottom: 20 }}
      />
    </Container>
  );
};

export default EquipmentDetails;

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  remainingTime: {
    color: "white",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  remaining: {
    color: colors.green,
    fontSize: 26,
    fontFamily: "Poppins-SemiBold",
  },
  sessionContainer: {
    position: "relative",
    height: 200,
    marginTop: 30,
  },
  sessionImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
  },
  weekLabel: {
    color: colors.green,
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.bgColor,
    padding: 5,
    fontSize: 10,
    fontFamily: "Poppins-Bold",
  },
  sessionTitleText: {
    color: "white",
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    position: "absolute",
    bottom: 60,
    left: 10,
    width: 103,
  },
  sessionDetailsContainer: {
    position: "absolute",
    bottom: 15,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  sessionDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  detailIcon: {
    width: 15,
    height: 15,
  },
  detailText: {
    color: "#F8F8F8",
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    marginTop: 2,
  },
  nextIcon: {
    width: 30,
    height: 30,
  },
});

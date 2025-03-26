import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AnimatedCircularProgress } from "react-native-circular-progress"; // Import Circular Progress
import { colors } from "../../constants/colors";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import images from "../../constants/images";
import EditIcon from "../../assets/svgs/EditIcon";
import CaloriesIcon from "../../assets/svgs/CaloriesIcon";
import TimeIcon from "../../assets/svgs/TimeIcon";
import StrengthIcon from "../../assets/svgs/StrengthIcon";
import { IconButton } from "react-native-paper";
import { FontSize } from "../../utils/font";

const EquipmentDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, workoutDetails } = route.params; // Destructure workoutDetails from params

  const [fill, setFill] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0); // Total duration in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer state

  useEffect(() => {
    if (workoutDetails) {
      const durationInSeconds = parseInt(workoutDetails.duration) * 60; // Convert minutes to seconds
      setTotalDuration(durationInSeconds);
      setRemainingTime(durationInSeconds);
    }
  }, [workoutDetails]);

  useEffect(() => {
    let interval;
    if (remainingTime > 0 && isTimerRunning) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
        setFill((prev) => prev + 100 / totalDuration); // Increment fill based on total duration
      }, 1000); // Update every second
    }

    return () => clearInterval(interval);
  }, [remainingTime, totalDuration, isTimerRunning]);

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

  const handleReset = () => {
    setRemainingTime(0); // Reset remaining time
    setFill(0); // Reset circular progress fill
    setIsTimerRunning(false); // Stop timer
  };

  const handleStart = () => {
    if (
      !workoutDetails ||
      !workoutDetails.duration ||
      workoutDetails.duration === "0"
    ) {
      Alert.alert("No Workout Time", "Please create a workout first.");
    } else {
      setIsTimerRunning(true); // Start the timer
    }
  };

  const handlePause = () => {
    setIsTimerRunning(false); // Pause the timer
  };

  const handleContinue = () => {
    setIsTimerRunning(true); // Continue the timer
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
              textStyle={{ color: "white", fontSize: FontSize.medium }}
              title={"Reset"}
              onPress={handleReset}
            />
            <CustomButton
              style={{ flex: 1, height: 40 }}
              title={isTimerRunning ? "Pause" : "Start"}
              onPress={isTimerRunning ? handlePause : handleStart}
              textStyle={{ fontSize: FontSize.medium }}
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
              fontSize: FontSize.regular,
            }}
          >
            Saved Workout
          </Text>
          <TouchableOpacity>
            <EditIcon />
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
                <CaloriesIcon width={20} height={20} />
                <Text style={styles.detailText}>{workoutDetails.speed}</Text>
              </View>
              <View style={styles.sessionDetail}>
                <TimeIcon />
                <Text style={styles.detailText}>{workoutDetails.incline}</Text>
              </View>
              <View style={styles.sessionDetail}>
                <StrengthIcon />
                <Text style={styles.detailText}>Quadriceps</Text>
              </View>

              <IconButton
                icon="arrow-right"
                size={20} // Adjust the size as needed
                color="#aaa" // Adjust the color as needed
                style={styles.nextIcon}
              />
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
                fontSize: FontSize.regular,
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
    fontSize: FontSize.small,
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
    fontSize: FontSize.xxsmall,
    fontFamily: "Poppins-Bold",
  },
  sessionTitleText: {
    color: "white",
    fontSize: FontSize.xxlarge,
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
    gap: 10,
  },
  detailIcon: {
    width: 15,
    height: 15,
  },
  detailText: {
    color: "#F8F8F8",
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
    marginTop: 2,
  },
  nextIcon: {
    width: 30,
    height: 30,
    backgroundColor: colors.green,
  },
});

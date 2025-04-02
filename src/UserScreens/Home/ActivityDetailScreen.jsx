import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PanResponder,
  Animated,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import Selectable from "../../components/Selectable";
import { colors } from "../../constants/colors";
import icons from "../../constants/icons";
import { CustomCard } from "../../components/CustomCard";
import images from "../../constants/images";
import RunningIcon from "../../assets/svgs/RunningIcon";
import DistanceIcon from "../../assets/svgs/DistanceIcon";
import TimeIcon from "../../assets/svgs/TimeIcon";
import CaloriesIcon from "../../assets/svgs/CaloriesIcon";
import HeartRateIcon from "../../assets/svgs/HeartRateIcon";
import GoalIcon from "../../assets/svgs/GoalIcon";
import { FontSize } from "../../utils/font";

const ActivityDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    activityName,
    distance = null,
    time = null,
    distanceUnit = null,
  } = route.params || {};

  const duration = ["Today", "Weekly", "Monthly", "Quarterly", "Yearly"];
  const [selectedPeriod, setSelectedPeriod] = useState("Today");

  // Button dimensions
  const buttonWidth = 300; // Adjust this to match your button width
  const maxDragDistance = buttonWidth; // Icon width is 48, padding is 24

  const pan = useRef(new Animated.ValueXY()).current;
  const dragThreshold = maxDragDistance * 0.9; // Trigger navigation when dragged 80% of max distance

  // Reset position when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 0,
        useNativeDriver: false,
      }).start();
    }, [])
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Save the current position of the pan
        pan.setOffset({
          x: pan.x._value,
          y: 0,
        });
        // Reset the value to avoid jumping
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        // Limit the drag to stay within the button and only horizontal
        // Using clamp to keep the value between 0 and maxDragDistance
        const newX = Math.max(0, Math.min(gestureState.dx, maxDragDistance));
        pan.x.setValue(newX);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Clear the offset to avoid accumulation
        pan.flattenOffset();

        if (pan.x._value > dragThreshold) {
          navigation.navigate("Map");

          // navigation.navigate("FinishActivity", {
          //   activityName: activityName,
          //   distance: distance,
          //   time: time,
          //   distanceUnit: distanceUnit,
          //   heartRate: heartRate,
          //   calories: calories,
          // });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const heartRate = "0bpm";
  const calories = "0kcal";

  return (
    <Container>
      <Header title={`${activityName}`} showBackButton={true} />

      <View style={{ marginTop: 20, flex: 1 }}>
        <Selectable
          items={duration}
          selectedItem={selectedPeriod}
          setSelectedItem={setSelectedPeriod}
        />

        <View style={styles.content}>
          <Text style={styles.title}>Your Insights</Text>
          <TouchableOpacity
            style={styles.goalButton}
            onPress={() =>
              navigation.navigate("ActivityScreen", { activityName })
            }
          >
            <GoalIcon />
            <Text style={styles.goalText}>Set Goal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          <CustomCard
            label="Distance"
            icon={DistanceIcon}
            goal={"Goal: 2mi daily"}
            message={`${distance} ${distanceUnit}`}
          />
          <CustomCard
            label="Time"
            icon={TimeIcon}
            goal={"Goal: 45min"}
            message={time}
          />
        </View>

        <View style={styles.gridContainer}>
          <CustomCard label="Calories" icon={CaloriesIcon} message={calories} />
          <CustomCard
            label="Heart Rate"
            icon={HeartRateIcon}
            message={heartRate}
          />
        </View>
      </View>
      <View style={styles.button}>
        <Animated.View
          style={{
            transform: [{ translateX: pan.x }],
            height: 48,
            width: 48,
            position: "absolute",
            left: 12,
            zIndex: 10,
          }}
          {...panResponder.panHandlers}
        >
          <Image source={images.locationBg} style={{ height: 48, width: 48 }} />
        </Animated.View>
        <Text style={styles.buttonText}>Open Map</Text>
        <Image source={icons.slideArrows} style={styles.arrowIcon} />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 30,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  goalButton: {
    backgroundColor: colors.green,
    width: 92,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    flexDirection: "row",
    gap: 7,
  },
  goalIcon: {
    width: 17,
    height: 17,
  },
  goalText: {
    fontSize: FontSize.small,
    marginTop: 2,
    fontFamily: "Poppins-SemiBold",
  },
  gridContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 16,
  },
  button: {
    backgroundColor: "#242425",
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    paddingHorizontal: 12,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: FontSize.large,
    color: "white",
  },
  arrowIcon: {
    width: 35,
    height: 12,
    position: "absolute",
    right: 12,
  },
});

export default ActivityDetailScreen;

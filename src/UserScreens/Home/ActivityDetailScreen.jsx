import React, { useState, useRef, useMemo, useEffect } from "react";
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
  useIsFocused,
} from "@react-navigation/native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import Selectable from "../../components/Selectable";
import { colors } from "../../constants/colors";
import icons from "../../constants/icons";
import { CustomCard } from "../../components/CustomCard";
import images from "../../constants/images";
import DistanceIcon from "../../assets/svgs/DistanceIcon";
import TimeIcon from "../../assets/svgs/TimeIcon";
import CaloriesIcon from "../../assets/svgs/CaloriesIcon";
import HeartRateIcon from "../../assets/svgs/HeartRateIcon";
import GoalIcon from "../../assets/svgs/GoalIcon";
import { FontSize } from "../../utils/font";
import { END_POINTS } from "../../config/routes";
import { API } from "../../config/apiClient";
import { useSelector } from "react-redux";
import LocationHelper from "../../services/locationHelper";
import { STORAGE_KEYS } from "../../tasks/trackingTasks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { convertDistanceToMeter } from "../../utils/utilities";

const ActivityDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocussed = useIsFocused();
  const {
    activityType,
    activityName,
    goal: item,
    startSession,
  } = route.params || {};
  const { distance, calories } = useSelector((state) => state.tracking);

  const [goal, setGoal] = useState(item);
  const [stats, setStats] = useState(null);
  const [time, setTime] = useState(0);
  const duration = ["Today", "Weekly", "Monthly", "Quarterly", "Yearly"];
  const [selectedPeriod, setSelectedPeriod] = useState("Today");

  const { token } = useSelector((state) => state.Auth);
  // Button dimensions
  const buttonWidth = 300; // Adjust this to match your button width
  const maxDragDistance = buttonWidth; // Icon width is 48, padding is 24

  const pan = useRef(new Animated.ValueXY()).current;
  const dragThreshold = maxDragDistance * 0.9; // Trigger navigation when dragged 80% of max distance
  const helper = new LocationHelper(null);
  let timer;

  // Reset position when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 0,
        useNativeDriver: false,
      }).start();

      fetchActiveGoal();

      return () => {
        if (timer) clearInterval(timer);
      };
    }, [])
  );

  useEffect(() => {
    if (startSession) {
      checkAll();
    }
  }, [isFocussed]);

  const checkAll = async () => {
    const result = await helper.checkForPermissionsAndStartTracking();

    if (result) {
      startTimer();
    }
  };

  const startTimer = async () => {
    try {
      let savedStartTimeStr = await AsyncStorage.getItem(
        STORAGE_KEYS.START_TIME
      );
      if (!savedStartTimeStr) {
        savedStartTimeStr = Date.now().toString();
        await AsyncStorage.setItem(STORAGE_KEYS.START_TIME, savedStartTimeStr);
      }
      const savedStartTime = parseInt(savedStartTimeStr, 10);

      if (timer) clearInterval(timer);

      timer = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - savedStartTime) / 1000);
        setTime(elapsedSeconds);
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const resetPan = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setOffset({ x: pan.x._value, y: 0 });
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (evt, gestureState) => {
          const newX = Math.max(0, Math.min(gestureState.dx, maxDragDistance));
          pan.x.setValue(newX);
        },
        onPanResponderRelease: () => {
          pan.flattenOffset();

          if (pan.x._value > dragThreshold) {
            navigation.navigate("Map", {
              goal,
              activityName,
              activityType,
              heartRate,
            });
          }

          resetPan();
        },
      }),
    [goal, activityName, activityType, heartRate, calories]
  );

  const heartRate = "0bpm";

  const fetchActiveGoal = async () => {
    try {
      const response = await API.get(
        `${END_POINTS.GOALS}/type/${activityType}?filter=${selectedPeriod}`,
        {},
        token
      );

      if (response?.data?.success) {
        setGoal(response?.data?.data?.goal);
        setStats(response?.data?.data?.stats);
        console.log(response?.data?.data?.stats);
      }
    } catch (error) {
      // console.log(error);
      if (!startSession) {
        fetchPhysicalActivity();
      }
    }
  };

  const fetchPhysicalActivity = async () => {
    try {
      const response = await API.get(
        `${END_POINTS.PHYSICAL_ACTIVITIES}/type/${activityType}?filter=${selectedPeriod}`,
        {},
        token
      );

      if (response?.data?.success) {
        setStats(response?.data?.data?.stats);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatElapsedTime = (totalSeconds = 0) => {
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    }

    if (totalSeconds < 3600) {
      const minutes = parseInt(totalSeconds / 60);
      const secs = totalSeconds % 60;
      return `${minutes}m ${secs}s`;
    }

    const hours = parseInt(totalSeconds / 3600);
    const minutes = parseInt(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${hours || 0}h ${minutes || 0}m ${secs || 0}s`;
  };

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
              navigation.navigate("ActivityScreen", {
                activityName,
                activityType,
                goal,
                refresh: () => {
                  fetchActiveGoal();
                },
              })
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
            showProgress={true}
            current={startSession ? distance : stats?.distance || distance}
            target={
              goal
                ? startSession
                  ? convertDistanceToMeter(
                      goal.targetDistance.value,
                      goal.targetDistance.unit
                    )
                  : goal.targetDistance?.value
                : 0
            }
            showGoal={goal ? goal.targetDistance.value !== null : false}
            goal={`Goal: ${goal?.targetDistance?.value || 0} ${
              goal?.targetDistance?.unit || "mi"
            }`}
            message={`${
              startSession
                ? parseFloat(distance).toFixed(2)
                : parseFloat(stats?.distance).toFixed(2) ||
                  parseFloat(distance).toFixed(2)
            } ${startSession ? "m" : goal?.targetDistance?.unit || "m"}`}
          />
          <CustomCard
            label="Time"
            icon={TimeIcon}
            showGoal={goal ? goal.targetDuration.value !== null : false}
            goal={`Goal: ${goal?.targetDuration?.hours || 0} hours ${
              goal?.targetDuration?.minutes || 0
            } mins`}
            message={`${formatElapsedTime(
              startSession ? time : stats?.duration || time
            )}`}
          />
        </View>

        <View style={styles.gridContainer}>
          <CustomCard
            label="Calories"
            showGoal={false}
            icon={CaloriesIcon}
            message={`${
              startSession ? calories : stats?.calories || calories || 0
            }kcal`}
          />
          <CustomCard
            label="Heart Rate"
            showGoal={false}
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
    paddingHorizontal: 10,
    paddingVertical: 6,
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

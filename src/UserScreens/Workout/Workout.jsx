import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CaloriesIcon from "../../assets/svgs/CaloriesIcon";
import DumbbellIcon from "../../assets/svgs/DumbbellIcon";
import JumpRopeIcon from "../../assets/svgs/JumpRopeIcon";
import PullupBarIcon from "../../assets/svgs/PullupBarIcon";
import SearchIcon from "../../assets/svgs/SearchIcon";
import TimeIcon from "../../assets/svgs/TimeIcon";
import TreadMillIcon from "../../assets/svgs/TreadmillIcon";
import WalkingIcon from "../../assets/svgs/WalkingIcon";
import Container from "../../components/Container";
import Header from "../../components/Header";
import MealCategorySelector from "../../components/MealCategorySelector";
import Selectable from "../../components/Selectable";
import TabContainer from "../../components/TabContainer";
import WorkoutCard from "../../components/WorkoutCard";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { colors } from "../../constants/colors";
import images from "../../constants/images";
import {
  setTodaySessions,
  setTrendingWorkouts,
} from "../../redux/reducers/WorkoutSlice";
import { FontSize } from "../../utils/font";
import moment from "moment";

const WorkoutScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("Workout");
  const tabs = ["Workout", "Fasting"];
  const duration = ["Today", "Weekly", "Monthly", "Quarterly", "Yearly"];

  const date = moment().format("DD/MM/yyyy");
  const dayName = moment().format("dddd");
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const { token } = useSelector((state) => state.Auth);
  const { trendingData, todaySessions } = useSelector((state) => state.Workout);

  useFocusEffect(
    useCallback(() => {
      getTrendingWorkouts();
      getTodaySessions();
      getStats();
    }, [])
  );

  useEffect(() => {
    getStats();
  }, [selectedPeriod]);

  const getTrendingWorkouts = async () => {
    try {
      const res = await API.get(END_POINTS.WORKOUTS, null, token);
      if (res.data.success) {
        dispatch(setTrendingWorkouts(res?.data?.data));
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const getStats = async () => {
    try {
      const res = await API.get(
        `${END_POINTS.WORKOUTS}/stats/${selectedPeriod}`,
        null,
        token
      );
      if (res.data.success) {
        setStats(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const getTodaySessions = async () => {
    try {
      const res = await API.get(END_POINTS.WORKOUT_SESSIONS, null, token);
      if (res.data.success) {
        dispatch(setTodaySessions(res?.data?.data ? [res.data.data] : []));
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const handleTabClick = (tab) => {
    if (tab === "Fasting") {
      navToFasting();
    } else setActiveTab(tab);
  };

  const navToFasting = () => {
    setTimeout(() => {
      navigation.navigate("FastingScreen");
    }, 100);
  };
  const [selectedCategory, setSelectedCategory] = useState(null);

  const sessionCategories = [
    { label: "Treadmill", value: "treadmill", icon: <TreadMillIcon /> },
    { label: "Dumbbells", value: "dumbells", icon: <DumbbellIcon /> },
    { label: "Jump Rope", value: "jump_rope", icon: <JumpRopeIcon /> },
    { label: "Pull-Up Bar", value: "pull_up_bar", icon: <PullupBarIcon /> },
    { label: "Kettle Bells", value: "kettlebells", icon: <PullupBarIcon /> },
  ];

  const activityData = [
    { day: "M", value: 0 },
    { day: "T", value: 0 },
    { day: "W", value: 0 },
    { day: "T", value: 0 },
    { day: "F", value: 0 },
    { day: "S", value: 0 },
    { day: "S", value: 0 },
  ];

  const BarGraph = () => {
    const maxHeight = 150;

    return (
      <View style={styles.barOuterContainer}>
        {activityData.map((item, index) => {
          const barHeight = (item.value / 100) * maxHeight;

          return (
            <View key={index} style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: "#C2FF59",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.label,
                    {
                      color: "#000",
                    },
                  ]}
                >
                  {item.value}
                </Text>
              </View>
              <Text style={styles.label}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const handleCategorySelect = (index) => {
    setSelectedCategory(index);

    // Navigate to the next screen with selected category
    const selectedCategoryValue = sessionCategories[index];
    navigation.navigate("EquipmentDetails", {
      category: selectedCategoryValue,
    });
  };

  const steps = 0;
  const km = 0;
  const stepsTotal = 0;

  const workout = trendingData?.[0];

  return (
    <Container>
      <Header
        title={"Workout"}
        //  rightIcon1={<SearchIcon />}
      />
      <TabContainer
        activeTab={activeTab}
        onTabClick={handleTabClick}
        tabs={tabs}
      />
      <ScrollView>
        <Selectable
          items={duration}
          selectedItem={selectedPeriod}
          setSelectedItem={setSelectedPeriod}
        />
        {activeTab === "Workout" && (
          <>
            <View style={styles.stepContainer}>
              <View style={styles.row}>
                <WalkingIcon />
                <Text style={styles.titleText}>Steps</Text>
              </View>

              <View
                style={[
                  styles.row,
                  { justifyContent: "space-between", alignItems: "flex-end" },
                ]}
              >
                <View>
                  <View style={[styles.row, { marginTop: 10 }]}>
                    <Text style={[styles.titleText, { color: colors.green }]}>
                      {steps}
                    </Text>
                    <Text style={[styles.titleText]}>Today</Text>
                  </View>
                  <Text style={{ color: "#A4A4A4" }}>
                    {km} | {stepsTotal} total
                  </Text>
                </View>

                <BarGraph />

                {/* <Image
                  source={images.stepsGraph}
                  style={{ height: 59, width: 178 }}
                /> */}
              </View>
            </View>
            <View style={[styles.row, styles.metricsContainer]}>
              <MetricBox
                label="Calories"
                icon={CaloriesIcon}
                value={stats?.totalCalories || 0}
                unit="kcal"
              />
              <MetricBox
                label="Time"
                icon={TimeIcon}
                value={((stats?.totalDuration || 0) / 60).toFixed(2)}
                unit="mins"
              />
            </View>
            {todaySessions?.length > 0 &&
            todaySessions[0]?.workout?.days?.some(
              (d) => date === d.date || d.weekDay === dayName
            ) ? (
              <View>
                <Text style={styles.sessionTitle}>Today's Session</Text>
                <WorkoutCard
                  title={todaySessions[0]?.workout?.name}
                  image={todaySessions[0]?.workout?.image}
                  calories={todaySessions[0]?.workout?.calories}
                  time={todaySessions[0]?.workout?.workoutTime}
                  isTodayWorkout={true}
                  onPress={async () => {
                    try {
                      const day = todaySessions[0]?.workout?.days?.find(
                        (d) => date === d.date || d.weekDay === dayName
                      );
                      const incompleteExercises = day.exercises.filter(
                        (e) => !e.isCompleted
                      );
                      const activity =
                        day.activities?.find((a) => date === a.date) || null;

                      navigation.navigate("StartWorkout", {
                        title: todaySessions[0]?.workout?.name,
                        image: todaySessions[0]?.workout?.image,
                        time:
                          todaySessions[0]?.workout?.workoutTime * 60 -
                          (activity?.durationCompleted || 0),
                        workoutTime: todaySessions[0]?.workout?.workoutTime,
                        exercises: incompleteExercises,
                        level: todaySessions[0]?.workout?.level,
                        calories: todaySessions[0]?.workout?.calories,
                        workoutSessionId: todaySessions[0]?._id,
                        refresh: () => {
                          getTodaySessions();
                        },
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                />
              </View>
            ) : null}
            <View>
              <Text style={styles.sessionTitle}>
                Select Your Training Equipment
              </Text>
              <MealCategorySelector
                categories={sessionCategories}
                selectedCategory={selectedCategory}
                onSelect={handleCategorySelect} // Pass the navigation function
              />
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.sessionTitle}>Trending Workouts</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ViewAllWorkouts")}
                >
                  <Text style={styles.greenText}>View all</Text>
                </TouchableOpacity>
              </View>
              <WorkoutCard
                title={workout?.name ?? "Chest Workout"}
                image={workout?.image}
                calories={workout?.calories ?? "190 kcal"}
                time={
                  workout?.workoutTime ? `${workout.workoutTime}` : "25 mins"
                }
                category="Quadriceps"
                onPress={() =>
                  workout && navigation.navigate("WorkoutDetails", { workout })
                }
              />
            </View>
          </>
        )}
      </ScrollView>
    </Container>
  );
};

const MetricBox = ({ label, value, unit, icon: IconComponent }) => (
  <View style={styles.metricBox}>
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <IconComponent width={16} height={16} />
    </View>
    <View style={styles.metricValueContainer}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
    </View>
  </View>
);

export default WorkoutScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepContainer: {
    marginTop: 20,
    backgroundColor: colors.bgColor,
    borderRadius: 15,
    padding: 12,
  },
  metricsContainer: {
    width: "100%",
    marginTop: 14,
    gap: 14,
  },
  metricBox: {
    backgroundColor: colors.bgColor,
    flex: 1,
    height: 82,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metricLabel: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-SemiBold",
    color: "white",
  },
  metricValue: {
    fontSize: FontSize.large,
    fontFamily: "Poppins-Medium",
    color: colors.green,
  },
  metricUnit: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
    color: "white",
  },
  icon: {
    width: 24,
    height: 24,
  },
  titleText: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: "white",
    marginTop: 2,
  },
  sessionTitle: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: "white",
    marginVertical: 20,
  },
  sessionContainer: {
    position: "relative",
    height: 200,
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
    gap: 3,
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
  },
  greenText: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Bold",
    color: colors.green,
  },
  barOuterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20, // optional dark background
    maxHeight: 200,
  },
  barContainer: {
    alignItems: "center",
    width: 30,
  },
  bar: {
    width: 30,
    borderRadius: 3,
    marginBottom: 6,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
  },
});

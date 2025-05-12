import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import BikingIcon from "../../assets/svgs/BikingIcon";
import ChallengesIcon from "../../assets/svgs/ChallengesIcon";
import NutritionIcon from "../../assets/svgs/NutritionIcon";
import RunningIcon from "../../assets/svgs/RunningIcon";
import SearchIcon from "../../assets/svgs/SearchIcon";
import ShopIcon from "../../assets/svgs/ShopIcon";
import SleepIcon from "../../assets/svgs/SleepIcon";
import Tab5Icon from "../../assets/svgs/Tab5Icon";
import WalkingIcon from "../../assets/svgs/WalkingIcon";
import WorkoutsIcon from "../../assets/svgs/WorkoutsIcon";
import { ActivityCard } from "../../components/ActivityCard";
import Container from "../../components/Container";
import { CustomCard } from "../../components/CustomCard";
import DailyReport from "../../components/DailyReport";
import IconButton from "../../components/IconButton";
import ProfileSection from "../../components/ProfileSection";
import images from "../../constants/images";
import { FontSize } from "../../utils/font";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isFirstTime, setIsFirstTime] = useState(true); // Track if it's the user's first time
  const [stats, setStats] = useState(null); // Track if it's the user's first time
  const [goals, setGoals] = useState(null); // Track if it's the user's first time

  const { token } = useSelector((state) => ({
    token: state.Auth?.token,
  }));

  // Combine all useSelector Hooks
  const { userData } = useSelector((state) => ({
    userData: state.Auth?.data,
  }));

  const profileImage =
    userData.image !== "" ? { uri: userData.image } : images.dp;

  useFocusEffect(
    useCallback(() => {
      fetchStats();
      fetchGoals();
    }, [])
  );

  const handleInteraction = () => {
    if (isFirstTime) {
      setIsFirstTime(false);
    }
  };
  const activityIcons = {
    Walking: WalkingIcon,
    Running: RunningIcon,
    Biking: BikingIcon,
  };

  const fetchStats = async () => {
    try {
      const response = await API.post(`${END_POINTS.SIGNUP}/stats`, {}, token);

      if (response?.data?.success) {
        const stat = response?.data?.data;
        setStats(stat);

        let percentage = 0;
        if (stat.ordersCount > 0) {
          percentage += 20;
        }
        if (stat.challengesCount > 0) {
          percentage += 20;
        }
        if (stat.workoutSessionsCount > 0) {
          percentage += 20;
        }
        if (stat.totalCaloriesBurned > 0) {
          percentage += 20;
        }
        if (stat.totalDistanceCovered > 0) {
          percentage += 20;
        }
        setCompletionPercentage(percentage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await API.get(`${END_POINTS.GOALS}`, {}, token);

      if (response?.data?.success) {
        setGoals(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <ScrollView onScroll={handleInteraction}>
        <View style={styles.header}>
          <ProfileSection
            userName={
              (userData?.firstName || "") + " " + (userData?.lastName || "")
            }
            imageSource={profileImage}
            onPress={() => {
              navigation.navigate("Profile");
            }}
          />
          {/* <View style={styles.iconButtonContainer}>
            <IconButton icon={<SearchIcon />} />
          </View> */}
        </View>

        <DailyReport
          completionPercentage={completionPercentage}
          reportText="Daily Report"
        />

        <Text style={styles.sectionText}>What are you up to today?</Text>
        <View style={styles.activityCardContainer}>
          {["Walking", "Running", "Biking"].map((activity, index) => (
            <ActivityCard
              key={activity}
              icon={activityIcons[activity]}
              label={activity}
              onPress={() => {
                handleInteraction();
                const goal = goals?.find((g) => g.type === activity);

                if (goal) {
                  navigation.navigate("ActivityDetailScreen", {
                    activityType: goal.type,
                    activityName: goal.type,
                    goal,
                  });
                } else {
                  navigation.navigate("ActivityDetailScreen", {
                    activityType: activity,
                    activityName: activity,
                  });
                }
                // else {
                //   const heartRate = "0bpm";
                //   const calories = "0kcal";

                //   navigation.navigate("Map", {
                //     activityName: activity,
                //     heartRate,
                //     calories,
                //   });
                // }
              }}
            />
          ))}
        </View>

        <Text style={styles.sectionText}>Your Fitness Space</Text>

        <View style={styles.cardRow}>
          <CustomCard
            label="Activity"
            icon={RunningIcon}
            message={
              isFirstTime
                ? `Please start Activity to see data`
                : `${stats?.totalDistanceCovered || 0} mi`
            }
            goal="Goal: Walk 2 miles daily"
          />
          <CustomCard
            label="Sleep"
            icon={SleepIcon}
            message={
              isFirstTime
                ? `Please start Sleep to see data`
                : `${stats?.totalSleepCovered || 0}h ${
                    stats?.totalSleepCovered || 0
                  }m`
            }
            goal="Goal: 8 hours of sleep daily"
            value="0h 0m"
            onPress={() => {
              handleInteraction();
              navigation.navigate("SleepScreen");
            }}
          />
        </View>

        <View style={styles.cardRow}>
          <CustomCard
            label="Nutrition"
            icon={NutritionIcon}
            message={
              isFirstTime
                ? `Please start Nutrition to see data`
                : `${stats?.totalCaloriesBurned || 0} kcal`
            }
            goal="Goal: burn 1,457 kcal this week"
            value="123"
            onPress={() => {
              handleInteraction();
              navigation.navigate("Nutrition");
            }}
          />
          <CustomCard
            label="Workouts"
            icon={WorkoutsIcon}
            message={
              isFirstTime
                ? `Please start Workouts to see data`
                : `${stats?.workoutSessionsCount || 0}`
            }
            goal="Goal: 4 workouts per week"
            value="3"
            onPress={() => {
              handleInteraction();
              navigation.navigate("Workout");
            }}
          />
        </View>

        <View style={styles.cardRow}>
          <CustomCard
            label="Challenges"
            icon={ChallengesIcon}
            message={
              isFirstTime
                ? `Please start Challenges to see data`
                : `${stats?.challengesCount || 0}`
            }
            goal="Goal: 84kg"
            value="63kg"
            onPress={() => {
              handleInteraction();
              navigation.navigate("Challenges");
            }}
          />
          <CustomCard
            label="Shop"
            icon={ShopIcon}
            message={
              isFirstTime
                ? `Please start Shop to see data`
                : `${stats?.ordersCount || 0}`
            }
            goal="items in cart"
            value="02"
            onPress={() => {
              handleInteraction();
              navigation.navigate("Shop");
            }}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionText: {
    color: "#fff",
    marginTop: 20,
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
  },
  activityCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 20,
    marginTop: 20,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 20,
    marginTop: 20,
  },
});

export default HomeScreen;

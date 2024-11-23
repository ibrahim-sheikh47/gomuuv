import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import { colors } from "../../constants/colors";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import TabContainer from "../../components/TabContainer";
import Selectable from "../../components/Selectable";
import { useNavigation } from "@react-navigation/native";
import images from "../../constants/images";
import MealCategorySelector from "../../components/MealCategorySelector";
import WorkoutCard from "../../components/WorkoutCard";

const WorkoutScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Workout");
  const tabs = ["Workout", "Fasting"];
  const duration = ["Today", "Weekly", "Monthly", "Quarterly", "Yearly"];
  const [selectedPeriod, setSelectedPeriod] = useState("Today");

  const handleTabClick = (tab) => setActiveTab(tab);

  const navToFasting = () => {
    setTimeout(() => {
      navigation.navigate("FastingScreen");
    }, 100);
  };
  const [selectedCategory, setSelectedCategory] = useState(null);

  const sessionCategories = [
    { label: "Treadmill", icon: icons.treadmill },
    { label: "Dumbbells", icon: icons.dumbbell },
    { label: "Jump Rope", icon: icons.jumpRope },
    { label: "Pull-Up Bar", icon: icons.pullUp },
  ];
  const handleCategorySelect = (index) => {
    setSelectedCategory(index);

    // Navigate to the next screen with selected category
    const selectedCategoryValue = sessionCategories[index];
    navigation.navigate("EquipmentDetails", {
      category: selectedCategoryValue,
    });
  };

  const handleOnPress = (workout) => {
    // Navigate to the WorkoutDetail screen with the selected workout data
    navigation.navigate("WorkoutDetails", { workout });
  };
  const steps = 2000;
  const km = 10.5;
  const stepsTotal = 5000;
  return (
    <Container>
      <Header title={"Workout"} rightIcon1={icons.search} />
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
                <Image source={icons.walking} style={styles.icon} />
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

                <Image
                  source={images.stepsGraph}
                  style={{ height: 59, width: 178 }}
                />
              </View>
            </View>
            <View style={[styles.row, styles.metricsContainer]}>
              <MetricBox
                label="Calories"
                icon={icons.calories}
                value="65"
                unit="kcal"
              />
              <MetricBox
                label="Time"
                icon={icons.time}
                value="20"
                unit="mins"
              />
            </View>
            <View>
              <Text style={styles.sessionTitle}>Today's Session</Text>
              <WorkoutCard
                title="Chest Workout"
                image={images.chestWorkout}
                calories="190 kcal"
                time="25 mins"
                category="Quadriceps"
                isTodayWorkout={true}
              />
            </View>
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
                title="Chest Workout"
                image={images.chestWorkout}
                calories="190 kcal"
                time="25 mins"
                category="Quadriceps"
              />
            </View>
          </>
        )}
        {activeTab === "Fasting" && navToFasting()}
      </ScrollView>
    </Container>
  );
};

const MetricBox = ({ label, value, unit, icon }) => (
  <View style={styles.metricBox}>
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Image source={icon} style={styles.icon} />
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
    gap: 5,
  },
  stepContainer: {
    marginTop: 20,
    height: 118,
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
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "white",
  },
  metricValue: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: colors.green,
  },
  metricUnit: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "white",
  },
  icon: {
    width: 24,
    height: 24,
  },
  titleText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "white",
    marginTop: 2,
  },
  sessionTitle: {
    fontSize: 16,
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
  greenText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: colors.green,
  },
});

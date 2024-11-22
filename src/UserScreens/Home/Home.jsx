import React, { useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import Container from "../../components/Container";
import images from "../../constants/images";
import { colors } from "../../constants/colors";
import icons from "../../constants/icons";
import ProfileSection from "../../components/ProfileSection";
import IconButton from "../../components/IconButton";
import { ActivityCard } from "../../components/ActivityCard";
import { CustomCard } from "../../components/CustomCard";
import DailyReport from "../../components/DailyReport";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const completionPercentage = 75;
  const [isFirstTime, setIsFirstTime] = useState(true); // Track if it's the user's first time

  const handleInteraction = () => {
    if (isFirstTime) {
      setIsFirstTime(false);
    }
  };

  return (
    <Container>
      <ScrollView onScroll={handleInteraction}>
        <View style={styles.header}>
          <ProfileSection
            userName="*username here*"
            imageSource={images.dp}
            onPress={() => {
              navigation.navigate("Profile");
            }}
          />
          <View style={styles.iconButtonContainer}>
            <IconButton iconSource={icons.search} />
            <IconButton iconSource={icons.shop} />
          </View>
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
              iconSource={icons[activity.toLowerCase()]}
              label={activity}
              onPress={() => {
                handleInteraction();
                navigation.navigate("ActivityScreen", {
                  activityType: activity,
                  activityName: activity,
                });
              }}
            />
          ))}
        </View>

        <Text style={styles.sectionText}>Your Fitness Space</Text>

        <View style={styles.cardRow}>
          <CustomCard
            label="Activity"
            icon={icons.running}
            message={
              isFirstTime ? `Please start Activity to see data` : "1.5 mi"
            }
            goal="Goal: Walk 2 miles daily"
            value="1.5 mi"
          />
          <CustomCard
            label="Sleep"
            icon={icons.tab5Filled}
            message={isFirstTime ? `Please start Sleep to see data` : "7h 32m"}
            goal="Goal: 8 hours of sleep daily"
            value="7h 32m"
            onPress={() => {
              handleInteraction();
              navigation.navigate("SleepScreen");
            }}
          />
        </View>

        <View style={styles.cardRow}>
          <CustomCard
            label="Challenges"
            icon={icons.challenges}
            message={
              isFirstTime ? `Please start Challenges to see data` : "100"
            }
            goal="Goal: burn 1,457 kcal this week"
            value="123"
            onPress={() => {
              handleInteraction();
              navigation.navigate("Challenges");
            }}
          />
          <CustomCard
            label="Workouts"
            icon={icons.workouts}
            message={isFirstTime ? `Please start Workouts to see data` : 3}
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
            label="Nutrition"
            icon={icons.nutrition}
            message={
              isFirstTime ? `Please start Nutrition to see data` : "64kg"
            }
            goal="Goal: 84kg"
            value="63kg"
            onPress={() => {
              handleInteraction();
              navigation.navigate("Nutrition");
            }}
          />
          <CustomCard
            label="Shop"
            icon={icons.shop2}
            message={isFirstTime ? `Please start Shop to see data` : 2}
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
    fontSize: 16,
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

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
  // State to manage user activity data
  const [activities, setActivities] = useState({
    activity: false,
    sleep: false,
    challenges: false,
    workouts: false,
    nutrition: false,
    shop: false,
  });

  const completionPercentage = 75;

  return (
    <Container>
      <ScrollView>
        <View style={styles.header}>
          <ProfileSection userName="*username here*" imageSource={images.dp} />
          <View style={styles.iconButtonContainer}>
            <IconButton iconSource={icons.search} />
            <IconButton iconSource={icons.shop} />
          </View>
        </View>

        <DailyReport
          completionPercentage={completionPercentage}
          reportText="Daily Report"
        />

        <Text style={styles.activityText}>What are you up to today?</Text>
        <View style={styles.activityCardContainer}>
          <ActivityCard
            iconSource={icons.walking}
            label="Walking"
            onPress={() =>
              navigation.navigate("ActivityScreen", { activityType: "Walking" })
            }
          />
          <ActivityCard
            iconSource={icons.running}
            label="Running"
            onPress={() =>
              navigation.navigate("ActivityScreen", { activityType: "Running" })
            }
          />
          <ActivityCard
            iconSource={icons.biking}
            label="Biking"
            onPress={() =>
              navigation.navigate("ActivityScreen", { activityType: "Biking" })
            }
          />
        </View>

        <Text style={styles.fitnessSpaceText}>Your Fitness Space</Text>

        <View style={styles.cardRow}>
          <CustomCard
            label="Activity"
            icon={icons.running}
            goal={"Goal: Walk 2 miles daily"}
          >
            <Text
              style={{
                color: "#F8F8F8",
                textAlign: "center",
                fontSize: 24,
                fontFamily: "Poppins-Bold",
                marginTop: 10,
              }}
            >
              1.5 mi
            </Text>
          </CustomCard>
          <CustomCard
            label="Sleep"
            icon={icons.tab5Filled}
            goal={"Goal: 8 hours of sleep daily"}
          >
            <Text
              style={{
                color: "#F8F8F8",
                textAlign: "center",
                fontSize: 24,
                fontFamily: "Poppins-Bold",
                marginTop: 10,
              }}
            >
              7h 32m
            </Text>
          </CustomCard>
        </View>

        <View style={styles.cardRow}>
          <CustomCard
            label="Challenges"
            icon={icons.challenges}
            goal={"Goal: burn 1,457 kcal this week"}
          >
            <Text
              style={{
                color: "#F8F8F8",
                textAlign: "center",
                fontSize: 24,
                fontFamily: "Poppins-Bold",
                marginTop: 10,
              }}
            >
              123
            </Text>
          </CustomCard>
          <CustomCard
            label="Workouts"
            icon={icons.workouts}
            goal={"Goal: 4 workouts per week"}
          >
            <Text
              style={{
                color: "#F8F8F8",
                textAlign: "center",
                fontSize: 24,
                fontFamily: "Poppins-Bold",
                marginTop: 10,
              }}
            >
              3
            </Text>
          </CustomCard>
        </View>

        <View style={styles.cardRow}>
          <CustomCard
            label="Nutrition"
            icon={icons.nutrition}
            goal={"Goal: 54kg"}
          >
            <Text
              style={{
                color: "#F8F8F8",
                textAlign: "center",
                fontSize: 24,
                fontFamily: "Poppins-Bold",
                marginTop: 10,
              }}
            >
              63kg
            </Text>
          </CustomCard>
          <CustomCard
            label="Shop"
            icon={icons.shop2}
            goal={"items in cart"}
            onPress={() => {
              navigation.navigate("ShopScreen");
            }}
          >
            <Text
              style={{
                color: "#F8F8F8",
                textAlign: "center",
                fontSize: 24,
                fontFamily: "Poppins-Bold",
                marginTop: 10,
              }}
            >
              02
            </Text>
          </CustomCard>
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
  activityText: {
    color: "#fff",
    marginTop: 20,
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
  fitnessSpaceText: {
    color: "#fff",
    marginTop: 20,
  },
});

export default HomeScreen;

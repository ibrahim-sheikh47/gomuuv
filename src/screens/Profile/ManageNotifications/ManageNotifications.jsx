import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Container from "../../../components/Container";
import BackHeader from "../../../components/BackHeader";
import ManageNotificationItem from "../../../components/ManageNotificationItem";
import CustomButton from "../../../components/CustomButton";

const ManageNotifications = () => {
  // State to manage toggle switches for each notification category
  const [toggles, setToggles] = useState({
    physicalActivity: true,
    workoutsFasting: false,
    nutrition: true,
    fitnessChallenges: false,
    sleepTracker: true,
    fitnessShop: false,
  });

  // Function to toggle switches
  const toggleSwitch = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Container>
      <BackHeader title="Notifications" showBackButton={true} />
      <ScrollView style={{ marginTop: 30 }}>
        {/* Use the ManageNotificationItem component for each category */}
        <ManageNotificationItem
          label="Physical Activity"
          value={toggles.physicalActivity}
          onToggle={() => toggleSwitch("physicalActivity")}
        />
        <ManageNotificationItem
          label="Workouts and Fasting"
          value={toggles.workoutsFasting}
          onToggle={() => toggleSwitch("workoutsFasting")}
        />
        <ManageNotificationItem
          label="Nutrition"
          value={toggles.nutrition}
          onToggle={() => toggleSwitch("nutrition")}
        />
        <ManageNotificationItem
          label="Fitness Challenges"
          value={toggles.fitnessChallenges}
          onToggle={() => toggleSwitch("fitnessChallenges")}
        />
        <ManageNotificationItem
          label="Sleep Tracker"
          value={toggles.sleepTracker}
          onToggle={() => toggleSwitch("sleepTracker")}
        />
        <ManageNotificationItem
          label="Fitness Shop"
          value={toggles.fitnessShop}
          onToggle={() => toggleSwitch("fitnessShop")}
        />
      </ScrollView>
      <CustomButton title={"Save Changes"} />
    </Container>
  );
};

export default ManageNotifications;

const styles = StyleSheet.create({});

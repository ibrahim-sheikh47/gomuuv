import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Container from "../../../components/Container";
import BackHeader from "../../../components/BackHeader";
import ManageNotificationItem from "../../../components/ManageNotificationItem";
import CustomButton from "../../../components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { API } from "../../../config/apiClient";
import { END_POINTS } from "../../../config/routes";
import { setAuthData } from "../../../redux/reducers/AuthSlice";
import Toast from "react-native-toast-message";

const ManageNotifications = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // State to manage toggle switches for each notification category

  const { userData, token } = useSelector((state) => ({
    userData: state.Auth?.data,
    token: state.Auth?.token,
  }));

  const [toggles, setToggles] = useState({
    physicalActivity: userData.notificationSettings.physicalActivity,
    workoutsFasting: userData.notificationSettings.workoutsAndFasting,
    nutrition: userData.notificationSettings.nutrition,
    fitnessChallenges: userData.notificationSettings.fitnessChallenges,
    sleepTracker: userData.notificationSettings.sleepTracker,
    fitnessShop: userData.notificationSettings.fitnessShop,
  });

  // Function to toggle switches
  const toggleSwitch = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveChanges = async () => {
    // setLoading(true);
    try {
      const response = await API.patch(
        `${END_POINTS.SIGNUP}/${userData._id}`,
        {
          notificationSettings: {
            physicalActivity: toggles.physicalActivity,
            workoutsAndFasting: toggles.workoutsFasting,
            nutrition: toggles.nutrition,
            fitnessChallenges: toggles.fitnessChallenges,
            sleepTracker: toggles.sleepTracker,
            fitnessShop: toggles.fitnessShop,
          },
        },
        token
      );
      if (response?.data?.success) {
        dispatch(
          setAuthData({
            token: token,
            data: response?.data?.data,
          })
        );

        Toast.show({
          type: "success",
          text1: "Notification settings changed!",
          text2: "",
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Could not changed notification settings!",
        text2: error.response?.data?.message || error || "Please try again.",
      });
    } finally {
      // setLoading(false);
    }
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
      <CustomButton title={"Save Changes"} onPress={handleSaveChanges} />
    </Container>
  );
};

export default ManageNotifications;

const styles = StyleSheet.create({});

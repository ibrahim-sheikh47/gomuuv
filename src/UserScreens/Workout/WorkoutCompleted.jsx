import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Container from "../../components/Container";
import { colors } from "../../constants/colors";
import CustomButton from "../../components/CustomButton";
import { useSelector } from "react-redux";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { FontSize } from "../../utils/font";

const WorkoutCompleted = ({ route }) => {
  const navigation = useNavigation();
  const { title, duration, image, level, calories, isChallenge } = route.params;
  const { token } = useSelector((state) => state.Auth);

  // Navigate back to home or workouts list
  const handleNavigate = () => {
    navigation.reset({
      routes: [
        {
          name: "TabNavigator",
          params: {
            screen: isChallenge ? "Challenges" : "Workout", // Navigate to the "Chats" screen within the TabNavigator
          },
        },
      ],
      index: 0,
    });
  };

  return (
    <Container cusStyles={{ paddingHorizontal: 0 }}>
      <View style={styles.imageContainer}>
        <ImageBackground source={{ uri: image }} style={styles.backgroundImage}>
          <View style={styles.overlayContent}>
            <Text style={styles.completed}>
              {isChallenge ? "Day" : "Workout"} Completed
            </Text>
            <Text style={styles.workoutTitle}>{title}</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 60,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View>
                <Text style={styles.durationLabel}>Level</Text>
                {/* Display the formatted duration */}
                <Text style={styles.durationText}>{level}</Text>
              </View>
              <View>
                <Text style={styles.durationLabel}>Duration</Text>
                {/* Display the formatted duration */}
                <Text style={styles.durationText}>
                  {parseInt(duration / 60)} (mins)
                </Text>
              </View>
              <View>
                <Text style={styles.durationLabel}>Burned</Text>
                {/* Display the formatted duration */}
                <Text style={styles.durationText}>{calories} (kcal)</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
        <View style={{ padding: 16 }}>
          <CustomButton title={"Close"} onPress={handleNavigate} />
          <CustomButton
            onPress={() =>
              navigation.reset({
                routes: [
                  {
                    name: "TabNavigator",
                    params: {
                      screen: isChallenge ? "Challenges" : "Workout", // Navigate to the "Chats" screen within the TabNavigator
                    },
                  },
                  {
                    name: isChallenge ? "CategoryList" : "ViewAllWorkouts",
                    params: { category: "" },
                  },
                ],
                index: 1,
              })
            }
            title={isChallenge ? "More Challenges" : "Start Again"}
            style={{
              borderColor: colors.green,
              borderWidth: 2,
              backgroundColor: "transparent",
            }}
            textStyle={{ color: colors.green }}
          />
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    flex: 1,
  },
  overlayContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  workoutTitle: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
    color: "#f8f8f8",
    textAlign: "center",
  },
  completed: {
    fontSize: FontSize.xxlarge,
    fontFamily: "Poppins-Bold",
    color: colors.green,
    marginBottom: 10,
    textAlign: "center",
  },
  durationLabel: {
    fontSize: FontSize.regular,
    color: "#fff",
    fontFamily: "Poppins-Medium",
    marginBottom: 5,
  },
  durationText: {
    fontSize: FontSize.medium,
    color: "#fff",
    fontFamily: "Poppins-Regular",
    marginBottom: 30,
    textAlign: "center",
  },
  endWorkoutButton: {
    width: "80%",
    paddingVertical: 15,
    backgroundColor: colors.green,
    borderRadius: 10,
    alignItems: "center",
  },
  endWorkoutText: {
    color: "#000",
    fontSize: FontSize.large,
    fontFamily: "Poppins-Bold",
  },
});

export default WorkoutCompleted;

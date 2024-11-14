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

const WorkoutCompleted = ({ route }) => {
  const navigation = useNavigation();
  const { title, duration, image, level, calories } = route.params;

  // Navigate back to home or workouts list
  const handleNavigate = () => {
    navigation.navigate("Workout"); // Change "Home" to your desired screen
  };

  return (
    <Container cusStyles={{ paddingHorizontal: 0 }}>
      <View style={styles.imageContainer}>
        <ImageBackground source={image} style={styles.backgroundImage}>
          <View style={styles.overlayContent}>
            <Text style={styles.completed}>Workout Completed</Text>
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
                <Text style={styles.durationText}>{duration}</Text>
              </View>
              <View>
                <Text style={styles.durationLabel}>Burned</Text>
                {/* Display the formatted duration */}
                <Text style={styles.durationText}>{calories}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
        <View style={{ padding: 16 }}>
          <CustomButton title={"Close"} onPress={handleNavigate} />
          <CustomButton
            onPress={() => navigation.navigate("ViewAllWorkouts")}
            title={"Start Again"}
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
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#f8f8f8",
    textAlign: "center",
  },
  completed: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: colors.green,
    marginBottom: 10,
    textAlign: "center",
  },
  durationLabel: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Poppins-Medium",
    marginBottom: 5,
  },
  durationText: {
    fontSize: 14,
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
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
});

export default WorkoutCompleted;

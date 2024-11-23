import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import icons from "../../constants/icons";
import images from "../../constants/images";
import Container from "../../components/Container";
import { colors } from "../../constants/colors";
import Selectable from "../../components/Selectable";
import CustomButton from "../../components/CustomButton";
import { Switch } from "react-native-paper";

const SwitchItem = ({ label, isSwitchOn, onToggleSwitch }) => (
  <View style={styles.switchContainer}>
    <Text style={styles.switchLabel}>{label}</Text>
    <Switch
      value={isSwitchOn}
      onValueChange={onToggleSwitch}
      color={colors.green}
    />
  </View>
);

const WorkoutDetails = () => {
  const navigation = useNavigation();
  const { workout } = useRoute().params;
  const [selectedPeriod, setSelectedPeriod] = useState("Day 1");
  const [isWarmUpVisible, setIsWarmUpVisible] = useState(false);
  const [isStretchVisible, setIsStretchVisible] = useState(false);

  console.log(workout);

  // Existing function to render exercises
  const renderExercise = (heading, exercises) => (
    <>
      <Text style={styles.exerciseHeading}>{heading}</Text>
      {exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseContainer}>
          <Image source={exercise.image} style={styles.exerciseImage} />
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <Text style={styles.exerciseReps}>{exercise.reps}</Text>
        </View>
      ))}
    </>
  );

  // New function to render exercises for the selected week
  const renderDayExercise = (dayExercises) => {
    return dayExercises.map((exercise, index) => (
      <View key={index} style={styles.exerciseContainer}>
        <Image source={exercise.image} style={styles.exerciseImage} />
        <Text style={styles.exerciseTitle}>{exercise.title}</Text>
        <Text style={styles.exerciseReps}>{exercise.reps}</Text>
      </View>
    ));
  };

  // Function to get exercises for the selected week
  // Function to get exercises for the selected day
  const getExercisesForDay = (day) => {
    switch (day) {
      case "Day 1":
        return workout.days.day1 || [];
      case "Day 2":
        return workout.days.day2 || [];
      case "Day 3":
        return workout.days.day3 || [];
      case "Day 4":
        return workout.days.day4 || [];
      default:
        return [];
    }
  };

  const selectedExercises = getExercisesForDay(selectedPeriod);

  const handleStartWorkout = () => {
    navigation.navigate("StartWorkout", {
      title: workout.title,
      image: workout.image,
      time: workout.time,
      exercises: selectedExercises,
      level: workout.level,
      calories: workout.calories,
    });
  };
  return (
    <Container cusStyles={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={icons.back} style={styles.backIcon} />
          </TouchableOpacity>

          <View>
            <Image source={workout.image} style={styles.workoutImage} />
            <Text style={styles.absoluteTitle}>{workout.title}</Text>

            <View
              style={{
                backgroundColor: colors.bgColor,
                borderRadius: 10,
                width: 50,
                padding: 5,
                position: "absolute",
                bottom: -25,
                left: 20,
              }}
            >
              <Text style={styles.dayTitle}>{selectedPeriod}</Text>
            </View>
          </View>

          <View style={{ padding: 16 }}>
            <View style={styles.infoBox}>
              <View style={styles.row}>
                {["Exercises", "Calories", "Time"].map((label, index) => (
                  <View style={styles.detailItem} key={index}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.value}>
                      {label === "Exercises"
                        ? workout.exercises + " Exercises"
                        : label === "Calories"
                        ? workout.calories + " kcal"
                        : workout.time + " mins"}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.row}>
                {["Equipment", "Level"].map((label, index) => (
                  <View style={styles.detailItem} key={index}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.value}>
                      {label === "Equipment"
                        ? workout.equipment
                        : workout.level}
                    </Text>
                  </View>
                ))}
                <View style={styles.detailItem}></View>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{workout.description}</Text>
            <SwitchItem
              label="Start With Warm-Up"
              isSwitchOn={isWarmUpVisible}
              onToggleSwitch={() => setIsWarmUpVisible(!isWarmUpVisible)}
            />
            <SwitchItem
              label="Stretch After Workout"
              isSwitchOn={isStretchVisible}
              onToggleSwitch={() => setIsStretchVisible(!isStretchVisible)}
            />
            {isWarmUpVisible &&
              renderExercise("Warm Up", [
                { title: "Push Ups", reps: "x10", image: images.chestWorkout },
              ])}
            <Text style={styles.sectionTitle}>Exercises</Text>
            <Selectable
              items={["Day 1", "Day 2", "Day 3", "Day 4"]}
              selectedItem={selectedPeriod}
              setSelectedItem={setSelectedPeriod}
            />
            {selectedExercises.length > 0 &&
              renderDayExercise(selectedExercises)}
            {isStretchVisible &&
              renderExercise("Stretch", [
                {
                  title: "Leg Stretch",
                  reps: "x10",
                  image: images.chestWorkout,
                },
              ])}
          </View>
        </View>
      </ScrollView>

      <View style={{ padding: 16 }}>
        <CustomButton title={"Start Workout"} onPress={handleStartWorkout} />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  workoutImage: {
    width: "100%",
    height: 285,
  },
  absoluteTitle: {
    position: "absolute",
    bottom: 30,
    left: 20,
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: colors.green,
  },
  infoBox: {
    backgroundColor: colors.bgColor,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#F8F8F8",
  },
  value: {
    marginTop: 5,
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: colors.green,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "white",
    marginTop: 20,
  },
  description: {
    color: "#AFAFAF",
    marginTop: 10,
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  switchContainer: {
    height: 38,
    backgroundColor: colors.bgColor,
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    color: "#F8F8F8",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  exerciseHeading: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginTop: 10,
  },
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 66,
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  exerciseImage: {
    width: 53,
    height: 53,
    borderRadius: 10,
  },
  exerciseTitle: {
    marginLeft: 16,
    color: "#F8F8F8",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  exerciseReps: {
    marginLeft: "auto",
    color: colors.green,
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    textAlign: "center",
  },
});

export default WorkoutDetails;

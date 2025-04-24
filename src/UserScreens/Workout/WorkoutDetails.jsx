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
import images from "../../constants/images";
import Container from "../../components/Container";
import { colors } from "../../constants/colors";
import Selectable from "../../components/Selectable";
import CustomButton from "../../components/CustomButton";
import { Switch } from "react-native-paper";
import BackIcon from "../../assets/svgs/BackIcon";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { useDispatch, useSelector } from "react-redux";
import { setTodaySessions } from "../../redux/reducers/WorkoutSlice";
import { FontSize } from "../../utils/font";

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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { workout } = useRoute().params;
  const [selectedPeriod, setSelectedPeriod] = useState("Day 1");
  const [isWarmUpVisible, setIsWarmUpVisible] = useState(false);
  const [isStretchVisible, setIsStretchVisible] = useState(false);
  const { token, userData } = useSelector((state) => ({
    token: state.Auth?.token,
    userData: state.Auth?.data,
  }));
  const getExercisesForDay = (day) => {
    const dayData = workout.days.find((d) => d.shortName === day);
    return {
      exercises: dayData ? dayData.exercises : [],
      warmupExercises:
        dayData && dayData.startWithWarmup ? dayData.warmupExercises : [],
      stretchExercises:
        dayData && dayData.stretchAfterWorkout ? dayData.stretchExercises : [],
    };
  };

  const selectedDayData = getExercisesForDay(selectedPeriod);
  const {
    exercises: selectedExercises,
    warmupExercises,
    stretchExercises,
  } = selectedDayData;

  const renderExercise = (heading, exercises) => (
    <>
      <Text style={styles.exerciseHeading}>{heading}</Text>
      {exercises.map((exercise) => (
        <View key={exercise._id} style={styles.exerciseContainer}>
          <Image source={images.chestWorkout} style={styles.exerciseImage} />
          <Text style={styles.exerciseTitle}>{exercise.name}</Text>
          <Text style={styles.exerciseReps}>{exercise.reps}</Text>
        </View>
      ))}
    </>
  );

  const renderDayExercise = (dayExercises) => {
    return dayExercises.map((exercise) => (
      <View key={exercise._id} style={styles.exerciseContainer}>
        <Image source={images.chestWorkout} style={styles.exerciseImage} />
        <Text style={styles.exerciseTitle}>{exercise.name}</Text>
        <Text style={styles.exerciseReps}>{exercise.reps}</Text>
      </View>
    ));
  };

  const deleteWorkoutSession = async (id) => {
    try {
      const res = await API.delete(
        END_POINTS.WORKOUT_SESSIONS + `/${id}`,
        token
      );
      if (res?.data.success) {
      }
    } catch (error) {}
  };

  const handleStartWorkout = async () => {
    try {
      // deleteWorkoutSession();
      let payload = { user: userData?._id, workout: workout?._id };
      const res = await API.post(END_POINTS.WORKOUT_SESSIONS, payload, token);
      if (res.data.success) {
        dispatch(setTodaySessions([res?.data?.data]));
        navigation.navigate("StartWorkout", {
          title: workout.name,
          image: workout.image,
          time: workout.workoutTime,
          exercises: selectedExercises,
          level: workout.level,
          calories: workout.calories,
          workoutSessionId: res?.data?.data?._id,
        });
      }
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  return (
    <Container cusStyles={{ marginTop: 20 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </TouchableOpacity>

          <View>
            <Image
              source={{ uri: workout.image }}
              style={styles.workoutImage}
            />
            <Text style={styles.absoluteTitle}>{workout.name}</Text>

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
                        ? `${selectedExercises.length} Exercises`
                        : label === "Calories"
                        ? workout.calories + " kcal"
                        : workout.workoutTime + " mins"}
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
                        ? workout.equipments.join(", ")
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
              warmupExercises.length > 0 &&
              renderExercise("Warm Up", warmupExercises)}
            <Text style={styles.sectionTitle}>Exercises</Text>
            <Selectable
              items={["Day 1", "Day 2", "Day 3", "Day 4"]}
              selectedItem={selectedPeriod}
              setSelectedItem={setSelectedPeriod}
            />
            {selectedExercises.length > 0 &&
              renderDayExercise(selectedExercises)}
            {isStretchVisible &&
              stretchExercises.length > 0 &&
              renderExercise("Stretch", stretchExercises)}
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
    fontSize: FontSize.small,
    color: "#F8F8F8",
  },
  value: {
    marginTop: 5,
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
    color: colors.green,
  },
  sectionTitle: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: "white",
    marginTop: 20,
  },
  description: {
    color: "#AFAFAF",
    marginTop: 10,
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
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
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Medium",
  },
  exerciseHeading: {
    color: "white",
    fontSize: FontSize.regular,
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
    fontSize: FontSize.regular,
    maxWidth: "65%",
  },
  exerciseReps: {
    marginLeft: "auto",
    color: colors.green,
    fontFamily: "Poppins-Medium",
    fontSize: FontSize.regular,
  },
  dayTitle: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    textAlign: "center",
  },
});

export default WorkoutDetails;

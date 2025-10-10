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
import moment from "moment";
import { capitalize } from "lodash";

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
  const { workout: item } = useRoute().params;

  const date = moment().format("DD/MM/yyyy");
  const dayName = moment().format("dddd");

  const [workout, setWorkout] = useState(item);
  const [selectedPeriod, setSelectedPeriod] = useState(
    workout?.days[
      workout?.days?.indexOf(
        workout?.days?.find((d) => d.date === date || d.weekDay === dayName)
      )
    ]?.shortName || `${workout?.days.length} Days`
  );
  const [isWarmUpVisible, setIsWarmUpVisible] = useState(
    workout?.days?.find((d) => d.date === date || d.weekDay === dayName)
      ?.startWithWarmup || false
  );
  const [isStretchVisible, setIsStretchVisible] = useState(
    workout?.days?.find((d) => d.date === date || d.weekDay === dayName)
      ?.stretchAfterWorkout || false
  );
  const { token, data: userData } = useSelector((state) => state.Auth);
  const getExercisesForDay = (day) => {
    const dayData = workout.days.find(
      (d) => d.shortName === day
      //  || (d.date === date || d.weekDay === dayName)
    );
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

  const getExerciseParam = (e) => {
    return e.exercise ? e.exercise : e;
  };

  const renderExercise = (heading, exercises) => {
    return (
      <>
        <Text style={styles.exerciseHeading}>{heading}</Text>
        {exercises.map((e) => {
          const ex = getExerciseParam(e);
          return (
            <View key={ex._id} style={styles.exerciseContainer}>
              <Image
                source={images.chestWorkout}
                style={styles.exerciseImage}
              />
              <Text style={styles.exerciseTitle}>{ex.name}</Text>
              <Text
                style={styles.exerciseReps}
              >{`${ex.sets} Sets (${ex.reps} reps)`}</Text>
            </View>
          );
        })}
      </>
    );
  };

  const renderDayExercise = (dayExercises) => {
    return dayExercises.map((e) => {
      const ex = getExerciseParam(e);
      return (
        <View key={ex._id} style={styles.exerciseContainer}>
          <Image source={images.chestWorkout} style={styles.exerciseImage} />
          <Text style={styles.exerciseTitle}>{ex.name}</Text>
          <Text
            style={styles.exerciseReps}
          >{`${ex.sets} Sets (${ex.reps} reps)`}</Text>
        </View>
      );
    });
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
      let payload = { user: userData?._id, workout: workout?._id };
      const res = await API.post(END_POINTS.WORKOUT_SESSIONS, payload, token);
      if (res.data.success) {
        dispatch(setTodaySessions([res?.data?.data]));

        navigation.navigate("StartWorkout", {
          title: workout.name,
          image: workout.image,
          workoutTime: workout.workoutTime,
          time: workout.workoutTime * 60,
          // exercises: selectedExercises.filter((e) => !e.isCompleted),
          exercises: getExercisesForDay(
            workout.days[0]?.shortName
          ).exercises.filter((e) => !e.isCompleted),
          level: workout.level,
          calories: workout.calories,
          workoutSessionId: res?.data?.data?._id,
          refresh: () => {
            fetchWorkout();
          },
        });
      }
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const fetchWorkout = async () => {
    try {
      const res = await API.get(
        `${END_POINTS.WORKOUTS}/${workout._id}`,
        null,
        token
      );
      if (res.data.success) {
        setWorkout(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching challenge:", error);
    }
  };

  return (
    <Container cusStyles={{ marginTop: 0, paddingHorizontal: 0 }}>
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
                padding: 10,
                position: "absolute",
                bottom: -25,
                left: 20,
              }}
            >
              <Text style={styles.dayTitle}>{selectedPeriod}</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { padding: 20 }]}>
            Description
          </Text>
          <Text style={[styles.description, { paddingHorizontal: 20 }]}>
            {workout.description}
          </Text>

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
                        ? capitalize(
                            workout.equipments.join(", ").replaceAll("_", " ")
                          )
                        : workout.level}
                    </Text>
                  </View>
                ))}
                <View style={styles.detailItem}></View>
              </View>
            </View>
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
              items={Array.from(
                { length: workout.days.length },
                (_, i) => workout.days[i]?.shortName || `Day ${i + 1}`
              )}
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
    flex: 1,
    color: "#F8F8F8",
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.regular,
    maxWidth: "65%",
  },
  exerciseReps: {
    marginLeft: "auto",
    color: colors.green,
    fontFamily: "Poppins-Medium",
    fontSize: FontSize.small,
  },
  dayTitle: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    textAlign: "center",
  },
});

export default WorkoutDetails;

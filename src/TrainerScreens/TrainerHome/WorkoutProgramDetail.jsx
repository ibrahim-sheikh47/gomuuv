import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { colors } from "../../constants/colors";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import Selectable from "../../components/Selectable";
import EditIcon from "../../assets/svgs/EditIcon";
import { FontSize } from "../../utils/font";
import moment from "moment";
import images from "../../constants/images";
import BackIcon from "../../assets/svgs/BackIcon";
import CustomButton from "../../components/CustomButton";

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

const WorkoutProgramDetail = ({ route }) => {
  const { program } = route.params;
  const date = moment().format("DD/MM/yyyy");
  const dayName = moment().format("dddd");

  const [selectedPeriod, setSelectedPeriod] = useState(
    program?.days[
      program?.days?.indexOf(
        program?.days?.find((d) => d.date === date || d.weekDay === dayName)
      )
    ]?.shortName || ""
  );
  const [isWarmUpVisible, setIsWarmUpVisible] = useState(
    program?.days?.find((d) => d.date === date || d.weekDay === dayName)
      ?.startWithWarmup || false
  );
  const [isStretchVisible, setIsStretchVisible] = useState(
    program?.days?.find((d) => d.date === date || d.weekDay === dayName)
      ?.stretchAfterWorkout || false
  );
  const getExercisesForDay = (day) => {
    const dayData = program.days.find(
      (d) => d.shortName === day && (d.date === date || d.weekDay === dayName)
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
        {exercises.map((e) => (
          <View key={getExerciseParam(e)._id} style={styles.exerciseContainer}>
            <Image source={images.chestWorkout} style={styles.exerciseImage} />
            <Text style={styles.exerciseTitle}>{getExerciseParam(e).name}</Text>
            <Text style={styles.exerciseReps}>{getExerciseParam(e).reps}</Text>
          </View>
        ))}
      </>
    );
  };

  const renderDayExercise = (dayExercises) => {
    return dayExercises.map((e) => (
      <View key={getExerciseParam(e)._id} style={styles.exerciseContainer}>
        <Image source={images.chestWorkout} style={styles.exerciseImage} />
        <Text style={styles.exerciseTitle}>{getExerciseParam(e).name}</Text>
        <Text style={styles.exerciseReps}>{getExerciseParam(e).reps}</Text>
      </View>
    ));
  };

  return (
    <Container cusStyles={{ marginTop: 0, paddingHorizontal: 0 }}>
      <Header
        title={"Workout Program"}
        showBackButton={true}
        // rightIcon1={
        //   <TouchableOpacity
        //     style={{
        //       backgroundColor: colors.green,
        //       padding: 10,
        //       borderRadius: 10,
        //     }}
        //   >
        //     <Text>Edit</Text>
        //   </TouchableOpacity>
        // }
        cusStyle={{ width: 58, height: 32 }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ position: "relative" }}>

          <View>
            <Image
              source={{ uri: program.image }}
              style={styles.workoutImage}
            />
            <Text style={styles.absoluteTitle}>{program.name}</Text>

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

          <Text style={[styles.sectionTitle, { padding: 20 }]}>
            Description
          </Text>
          <Text style={[styles.description, { paddingHorizontal: 20 }]}>
            {program.description}
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
                        ? program.calories + " kcal"
                        : program.workoutTime + " mins"}
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
                        ? program.equipments.join(", ")
                        : program.level}
                    </Text>
                  </View>
                ))}
                <View style={styles.detailItem}></View>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{program.description}</Text>
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

export default WorkoutProgramDetail;

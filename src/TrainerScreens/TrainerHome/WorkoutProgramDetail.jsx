import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { colors } from "../../constants/colors";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import Selectable from "../../components/Selectable";
import EditIcon from "../../assets/svgs/EditIcon";
import { FontSize } from "../../utils/font";

const WorkoutProgramDetail = ({ route }) => {
  const { program } = route.params;
  const [selectedPeriod, setSelectedPeriod] = useState("Day 1");
  const renderDayExercise = (dayExercises) => {
    return dayExercises.map((exercise, index) => (
      <View key={index} style={styles.exerciseContainer}>
        <Image source={exercise.image} style={styles.exerciseImage} />
        <Text style={styles.exerciseTitle}>{exercise.title}</Text>
        <Text style={styles.exerciseReps}>{exercise.reps}</Text>
      </View>
    ));
  };
  const getExercisesForDay = (day) => {
    switch (day) {
      case "Day 1":
        return program.days.day1 || [];
      case "Day 2":
        return program.days.day2 || [];
      case "Day 3":
        return program.days.day3 || [];
      case "Day 4":
        return program.days.day4 || [];
      default:
        return []; // Return an empty array if the day is not found
    }
  };

  const selectedExercises = getExercisesForDay(selectedPeriod);

  return (
    <Container>
      <Header
        title={"Workout Program"}
        showBackButton={true}
        rightIcon1={
          <View
            style={{
              backgroundColor: colors.green,
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text>Edit</Text>
          </View>
        }
        cusStyle={{ width: 58, height: 32 }}
      />
      <ScrollView style={{ marginTop: 20 }}>
        <Image source={program.image} style={styles.image} />
        <View style={styles.content}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.title}>{program.title}</Text>
            <Text style={styles.price}>{program.price}</Text>
          </View>

          <Text style={styles.description}>{program.subtitle}</Text>

          <Text style={styles.sectionTitle}>Description</Text>

          <Text style={styles.cardDescription}>{program.description}</Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.row}>
            {["Exercises", "Calories", "Time"].map((label, index) => (
              <View style={styles.detailItem} key={index}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>
                  {label === "Exercises"
                    ? program.exercises + " Exercises"
                    : label === "Calories"
                    ? program.calories + " kcal"
                    : program.time + " mins"}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.row}>
            {["Equipment", "Level"].map((label, index) => (
              <View style={styles.detailItem} key={index}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>
                  {label === "Equipment" ? program.equipment : program.level}
                </Text>
              </View>
            ))}
            <View style={styles.detailItem}></View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Exercises</Text>
        <Selectable
          items={["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]}
          selectedItem={selectedPeriod}
          setSelectedItem={setSelectedPeriod}
        />
        {selectedExercises.length > 0 && renderDayExercise(selectedExercises)}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    borderColor: colors.bgColor,
    borderWidth: 2,
  },
  content: {
    marginVertical: 20,
  },
  title: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    width: 200,
  },
  description: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
    color: "#F8F8F8",
  },
  sectionTitle: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: "white",
    marginTop: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  detailIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  detailText: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Regular",
    color: "#F8F8F8",
  },
  price: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
  },
  cardDescription: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
    color: "#F8F8F8",
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
  },
  exerciseReps: {
    marginLeft: "auto",
    color: colors.green,
    fontFamily: "Poppins-Medium",
    fontSize: FontSize.regular,
  },
});

export default WorkoutProgramDetail;

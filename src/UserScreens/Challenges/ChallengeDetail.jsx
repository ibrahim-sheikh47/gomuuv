import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native"; // Get route params
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import { colors } from "../../constants/colors";
import Selectable from "../../components/Selectable";
import CustomButton from "../../components/CustomButton";
import SearchIcon from "../../assets/svgs/SearchIcon";
import { FontSize } from "../../utils/font";

const ChallengeDetail = () => {
  const route = useRoute();
  const { challenge } = route.params; // Access challenge data from params

  const [selectedPeriod, setSelectedPeriod] = useState("Day 1");

  console.log(challenge);
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
        return challenge.days.day1 || [];
      case "Day 2":
        return challenge.days.day2 || [];
      case "Day 3":
        return challenge.days.day3 || [];
      case "Day 4":
        return challenge.days.day4 || [];
      default:
        return []; // Return an empty array if the day is not found
    }
  };

  const selectedExercises = getExercisesForDay(selectedPeriod);
  return (
    <Container>
      <Header
        title={"Challenges & Goals"}
        showBackButton={true}
        rightIcon1={<SearchIcon />}
      />
      <ScrollView>
        <Image source={challenge.image} style={styles.challengeImage} />
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.cardSubtitle}>{challenge.cardSubtitle}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{challenge.description}</Text>

        <View style={styles.infoBox}>
          <View style={styles.row}>
            {["Exercises", "Calories", "Time"].map((label, index) => (
              <View style={styles.detailItem} key={index}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>
                  {label === "Exercises"
                    ? challenge.exercises + " Exercises"
                    : label === "Calories"
                    ? challenge.calories + " kcal"
                    : challenge.time + ""}
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
                    ? challenge.equipment
                    : challenge.level}
                </Text>
              </View>
            ))}
            <View style={styles.detailItem}></View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Exercises</Text>
        <Selectable
          items={Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)}
          selectedItem={selectedPeriod}
          setSelectedItem={setSelectedPeriod}
        />

        {selectedExercises.length > 0 && renderDayExercise(selectedExercises)}
      </ScrollView>
      {challenge.type === "enroll" && (
        <CustomButton title={"Continue Challenge"} style={{ marginTop: 20 }} />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  challengeImage: {
    width: "100%",
    height: 175,
    borderRadius: 10,
    marginTop: 20,
  },
  title: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    marginTop: 10,
  },
  cardSubtitle: {
    fontSize: FontSize.medium,
    color: "#F8F8F8",
    marginVertical: 5,
  },
  level: {
    fontSize: FontSize.large,
    color: "#F8F8F8",
    fontFamily: "Poppins-Regular",
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

export default ChallengeDetail;

import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";

// Reusable MealCard component
const MealCard = ({ icon, label }) => (
  <TouchableOpacity style={styles.card}>
    <Image source={icon} style={{ width: 32, height: 32 }} />
    <Text style={styles.cardText}>{label}</Text>
  </TouchableOpacity>
);

const AddMeal = () => {
  return (
    <Container>
      <Header title={"Choose to Add Meal"} showBackButton={true} />

      <View style={styles.grid}>
        <MealCard label="Breakfast" icon={icons.breakfast} />
        <MealCard label="Lunch" icon={icons.lunch} />
        <MealCard label="Dinner" icon={icons.dinner} />
        <MealCard label="Snacks" icon={icons.snacks} />
      </View>
    </Container>
  );
};

export default AddMeal;

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#242425",
    height: 163,
    width: "48%", // Ensures two cards fit per row
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
});

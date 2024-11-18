import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import { useNavigation } from "@react-navigation/native";
import MealCard from "../../components/MealCard";

const AddMeal = () => {
  return (
    <Container>
      <Header title={"Choose Meal to Add "} showBackButton={true} />

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
});

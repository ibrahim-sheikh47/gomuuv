import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import { useNavigation } from "@react-navigation/native";
import MealCard from "../../components/MealCard";
import BreakfastIcon from "../../assets/svgs/BreakfastIcon";
import LunchIcon from "../../assets/svgs/LunchIcon";
import SnacksIcon from "../../assets/svgs/SnacksIcon";
import DinnerIcon from "../../assets/svgs/DinnerIcon";

const AddMeal = () => {
  return (
    <Container>
      <Header title={"Choose Meal to Add "} showBackButton={true} />

      <View style={styles.grid}>
        <MealCard label="Breakfast" icon={BreakfastIcon} />
        <MealCard label="Lunch" icon={LunchIcon} />
        <MealCard label="Dinner" icon={DinnerIcon} />
        <MealCard label="Snacks" icon={SnacksIcon} />
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

import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import { colors } from "../../constants/colors";
import NutrientItem from "../../components/NutrientItem";
import { MealItem } from "../../components/MealItem";
import { preferredMeal } from "../../utils/data";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";

const FinalizePlan = () => {
  const navigation = useNavigation();
  const goalValue = "2000 kcal";
  const currentValue = "1800 kcal";

  const [addedMeals, setAddedMeals] = useState({}); // Track added meals by ID

  const handleAddRemove = (mealName, mealId) => {
    // Check if the meal is already added
    const isAdded = !!addedMeals[mealId];

    if (!isAdded) {
      Alert.alert("Added", `${mealName} has been added to your plan.`);
    } else {
      Alert.alert("Removed", `${mealName} has been removed from your plan.`);
    }

    // Toggle the meal's added state
    setAddedMeals((prev) => ({
      ...prev,
      [mealId]: !isAdded,
    }));
  };

  return (
    <Container>
      <Header title={"Nutrition"} />
      <ScrollView>
        <View style={styles.cardContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Goal</Text>
            <Text style={styles.value}>{goalValue}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Current</Text>
            <Text style={styles.value}>{currentValue}</Text>
          </View>
        </View>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            marginTop: 20,
            fontFamily: "Poppins-Bold",
          }}
        >
          Meals Based On Your Preferences
        </Text>
        <FlatList
          data={preferredMeal}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MealItem
              title={item.title}
              mealName={item.mealName}
              mealImage={item.mealImage}
              calories={item.calories}
              time={item.time}
              forFinalizePlan={true}
              iconType={"next"}
              onPress={() =>
                navigation.navigate("MealDetailScreen", { meal: item })
              }
              style={{ width: "100%" }}
              isAdded={!!addedMeals[item.id]} // Determine if the meal is added
              handleAddRemove={() => handleAddRemove(item.mealName, item.id)} // Pass meal name and ID
            />
          )}
          contentContainerStyle={{ gap: 10, marginBottom: 20 }}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
      <CustomButton
        title={"Finalize Plan"}
        onPress={() => {
          navigation.navigate("ViewAllMeals", { title: "My Daily Plan" });
        }}
      />
    </Container>
  );
};

export default FinalizePlan;

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 20,
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    padding: 20,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#f8f8f8",
    width: 100,
  },
  value: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: colors.green, // Text in green
  },
});

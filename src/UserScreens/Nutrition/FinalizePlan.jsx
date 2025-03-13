import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import { MealItem } from "../../components/MealItem";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { colors } from "../../constants/colors";

const FinalizePlan = ({ route }) => {
  const { planData } = route.params;
  const navigation = useNavigation();
  const goalValue = "2000 kcal";
  const currentValue = "1800 kcal";

  const [addedMeals, setAddedMeals] = useState({}); // Track added meals by ID
  const { token, nutritionMeals } = useSelector((state) => ({
    token: state.Auth?.token,
    nutritionMeals: state.Nutrition.data,
  }));

  const handleAddRemove = (mealName, mealId) => {
    const isAdded = !!addedMeals[mealId];

    Toast.show({
      type: isAdded ? "error" : "success",
      text1: isAdded ? "Removed!" : "Added!",
      text2: `${mealName} has been ${
        isAdded ? "removed from" : "added to"
      } your plan.`,
    });

    setAddedMeals((prev) => ({
      ...prev,
      [mealId]: !isAdded,
    }));
  };

  const handleFinalizePlan = async () => {
    const selectedMealIds = Object.keys(addedMeals).filter(
      (id) => addedMeals[id]
    );

    if (selectedMealIds.length === 0) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2: "Please select at least one meal to finalize the plan.",
      });
      return;
    }

    const payload = {
      ...planData,
      dailyMeals: selectedMealIds, // Add selected meal IDs to payload
    };

    try {
      const res = await API.post(END_POINTS.PERSONALIZED_PLANS, payload, token);
      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: "Plan finalized successfully!",
        });
        navigation.replace("ViewAllMeals", { title: "My Daily Plan" });
      }
    } catch (error) {
      console.error("Error finalizing plan:", JSON.stringify(error, null, 2));
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Failed to finalize the plan. Please try again.",
      });
    }
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
          data={nutritionMeals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MealItem
              title={item.title}
              mealName={item.name}
              mealImage={item.image}
              calories={item.calories}
              time={item.preparationTime}
              forFinalizePlan={true}
              iconType={"next"}
              onPress={() =>
                navigation.navigate("MealDetailScreen", { meal: item })
              }
              style={{ width: "100%" }}
              isAdded={!!addedMeals[item._id]} // Determine if the meal is added
              handleAddRemove={() => handleAddRemove(item.name, item._id)} // Pass meal name and ID
            />
          )}
          contentContainerStyle={{ gap: 10, marginBottom: 20 }}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
      <CustomButton
        title={"Finalize Plan"}
        onPress={() => {
          handleFinalizePlan();
          // navigation.navigate("ViewAllMeals", { title: "My Daily Plan" });
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

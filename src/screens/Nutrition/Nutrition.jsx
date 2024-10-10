import {
  Image,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { colors } from "../../constants/colors";
import { ProgressBar } from "../../components/ProgressBar";
import NutrientItem from "../../components/NutrientItem";
import images from "../../constants/images";
import { MealItem } from "../../components/MealItem";
import { mealData, nutritionPlans, popularRecipes } from "../../utils/data";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import WaterIntake from "../../components/WaterIntake";

// Meal Item Component

const NutritionScreen = () => {
  const navigation = useNavigation();
  const [eatenCalories, setEatenCalories] = useState(300);
  const [burnedCalories, setBurnedCalories] = useState(300);
  const [totalCalories, setTotalCalories] = useState(1000);
  const [consumedGlasses, setConsumedGlasses] = useState(3); // Track consumed water glasses
  const totalGlasses = 5;

  // State for nutrients (carbs, proteins, fats)
  const [carbs, setCarbs] = useState({ current: 20, total: 30 });
  const [proteins, setProteins] = useState({ current: 10, total: 30 });
  const [fats, setFats] = useState({ current: 30, total: 30 });

  // Calculate remaining calories
  const remainingCalories = totalCalories - eatenCalories;

  // Calculate the fill percentage for the circular progress
  const fillPercentage = (remainingCalories / totalCalories) * 100;

  const waterProgress = (consumedGlasses / totalGlasses) * 100;

  const handleAddWater = () => {
    if (consumedGlasses < totalGlasses) {
      setConsumedGlasses(consumedGlasses + 1);
    }
  };

  // Data for daily meal plan

  return (
    <Container>
      <Header title={"Nutrition"} showBackButton={true} />
      <ScrollView>
        <View style={styles.rowContainer}>
          {/* Eaten Section */}
          <View style={styles.columnContainer}>
            <Image style={styles.icon} source={icons.eaten} />
            <Text style={styles.valueText}>{eatenCalories}</Text>
            <Text style={styles.labelText}>Eaten</Text>
          </View>

          {/* Circular Progress for kcal Remaining */}
          <AnimatedCircularProgress
            size={130}
            width={8}
            fill={fillPercentage}
            tintColor={colors.green}
            backgroundColor="#454545"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.centeredContainer}>
                <Text style={styles.remainingText}>
                  {remainingCalories} kcal
                </Text>
                <Text style={styles.remainingLabel}>remaining</Text>
              </View>
            )}
          </AnimatedCircularProgress>

          {/* Burned Section */}
          <View style={styles.columnContainer}>
            <Image style={styles.icon} source={icons.burned} />
            <Text style={styles.valueText}>{burnedCalories}</Text>
            <Text style={styles.labelText}>Burned</Text>
          </View>
        </View>

        {/* Carbs, Proteins, Fats Section */}
        <View style={styles.nutrientContainer}>
          <NutrientItem
            title="Carbs"
            current={carbs.current}
            total={carbs.total}
          />
          <NutrientItem
            title="Proteins"
            current={proteins.current}
            total={proteins.total}
          />
          <NutrientItem
            title="Fats"
            current={fats.current}
            total={fats.total}
          />
        </View>

        {/* Water Intake Section */}
        <View style={styles.intakeHeader}>
          <Text style={styles.title}>Water Intake</Text>
          <TouchableOpacity>
            <Text style={styles.greenText}>+ Add Water</Text>
          </TouchableOpacity>
        </View>
        <WaterIntake
          consumedGlasses={consumedGlasses}
          totalGlasses={totalGlasses}
          onAddWater={handleAddWater}
        />

        <View style={styles.dailyPlanHeader}>
          <Text style={styles.title}>Your Daily Plan</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ViewAllMeals")} // Navigate to the new screen
          >
            <Text style={styles.greenText}>View all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={mealData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MealItem
              title={item.title}
              mealName={item.mealName}
              mealImage={item.mealImage}
              calories={item.calories}
              time={item.time}
              onPress={() =>
                navigation.navigate("MealDetailScreen", { meal: item })
              }
            />
          )}
          contentContainerStyle={{ gap: 10, marginBottom: 20 }}
          showsHorizontalScrollIndicator={false}
        />

        <CustomButton
          title={" + Add Meal"}
          onPress={() => {
            navigation.navigate("AddMeal");
          }}
        />

        <View style={styles.dailyPlanHeader}>
          <Text style={styles.title}>Popular Recipes</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ViewAllMeals")} // Navigate to the new screen
          >
            <Text style={styles.greenText}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={popularRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MealItem
              title={item.title}
              mealName={item.mealName}
              mealImage={item.mealImage}
              calories={item.calories}
              time={item.time}
              onPress={() =>
                navigation.navigate("MealDetailScreen", { meal: item })
              }
            />
          )}
          contentContainerStyle={{ gap: 10, marginBottom: 20 }}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.title}>Nutrition Your Way</Text>

        <View style={styles.gridContainer}>
          {nutritionPlans.map((plan, index) => (
            <TouchableOpacity key={plan.id} style={styles.nutritionPlanCard}>
              <Image source={plan.icon} style={styles.nutritionPlanIcon} />
              <Text style={styles.nutritionPlanText}>{plan.title}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.nutritionPlanCard,
              { backgroundColor: colors.green },
            ]}
          >
            <Text
              style={[
                styles.nutritionPlanText,
                {
                  color: "black",
                  textAlign: "center",
                  width: 120,
                  fontFamily: "Poppins-Bold",
                },
              ]}
            >
              Create Personalized Plans
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
};

export default NutritionScreen;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginHorizontal: 10,
  },
  columnContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  centeredContainer: {
    alignItems: "center",
  },
  icon: {
    width: 26,
    height: 26,
  },
  valueText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "white",
  },
  labelText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#A4A4A4",
  },
  remainingText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "white",
  },
  remainingLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#A4A4A4",
  },
  nutrientContainer: {
    backgroundColor: "#242425",
    height: 85,
    borderRadius: 15,
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  intakeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  waterIntakeContainer: {
    height: 117,
    backgroundColor: "#252525",
    borderRadius: 15,
    marginTop: 20,
    padding: 10,
  },
  waterIntakeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  waterIntakeText: {
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    fontSize: 12,
  },
  glassIcon: {
    width: 24,
    height: 24,
  },
  waterConsumptionText: {
    fontFamily: "Poppins-SemiBold",
    color: "white",
    fontSize: 12,
    marginTop: 10,
  },
  waterProgressBar: {
    marginTop: 10,
    height: 12,
  },
  dailyPlanHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  greenText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: colors.green,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 10,
    marginTop: 10,
  },
  nutritionPlanCard: {
    width: "48%",
    height: 92,
    backgroundColor: "#242425",
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  nutritionPlanIcon: {
    width: 24,
    height: 24,
  },
  nutritionPlanText: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "white",
  },
});

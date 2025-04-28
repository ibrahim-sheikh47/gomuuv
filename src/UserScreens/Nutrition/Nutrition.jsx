import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useDispatch, useSelector } from "react-redux";
import CaloriesIcon from "../../assets/svgs/CaloriesIcon";
import EatenIcon from "../../assets/svgs/EatenIcon";
import GoalIcon from "../../assets/svgs/GoalIcon";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import { MealItem } from "../../components/MealItem";
import NutrientItem from "../../components/NutrientItem";
import WaterIntake from "../../components/WaterIntake";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { colors } from "../../constants/colors";
import {
  setDailyPlans,
  setNutritionMeals,
} from "../../redux/reducers/NutritionSlice";
import { nutritionPlans } from "../../utils/data";
import { FontSize } from "../../utils/font";
import moment from "moment";

// Meal Item Component

const NutritionScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [eatenCalories, setEatenCalories] = useState(0);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [goal, setGoal] = useState(null);
  const date = moment().format("DD/MM/yyyy");

  const [consumedGlasses, setConsumedGlasses] = useState(
    goal?.activities.find((a) => a.date === date)?.distance?.value || 0
  );
  const [totalGlasses, setTotalGlasses] = useState(
    goal?.targetDistance?.value || 0
  ); // Default to 8 glasses
  const [totalIntakeGoal, setTotalIntakeGoal] = useState(0);
  const { token, dailyPlans, nutritionMeals } = useSelector((state) => ({
    token: state.Auth?.token,
    dailyPlans: state.Nutrition.dailyPlans,
    nutritionMeals: state.Nutrition.data,
  }));

  // State for nutrients (carbs, proteins, fats)
  const [carbs, setCarbs] = useState({ current: 0, total: 30 });
  const [proteins, setProteins] = useState({ current: 0, total: 30 });
  const [fats, setFats] = useState({ current: 0, total: 30 });

  // Calculate remaining calories
  const remainingCalories = totalCalories - eatenCalories;

  // Calculate the fill percentage for the circular progress
  const fillPercentage = (remainingCalories / totalCalories) * 100;

  const waterProgress = (consumedGlasses / totalGlasses) * 100;

  useFocusEffect(
    useCallback(() => {
      fetchActiveGoal();
    }, [])
  );

  useEffect(() => {
    getNutritionMeals();
    getDailyPlans();
  }, []);

  const getNutritionMeals = async () => {
    try {
      const res = await API.get(END_POINTS.NUTRITION_MEALS, null, token);
      if (res.data.success) {
        console.log(
          "res?.data?.data",
          JSON.stringify(res?.data?.data, null, 2)
        );
        dispatch(setNutritionMeals(res?.data?.data || []));
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  const getDailyPlans = async () => {
    try {
      const res = await API.get(END_POINTS.DAILY_PLANS, null, token);
      if (res.data.success) {
        dispatch(setDailyPlans(res?.data?.data?.meals || []));

        let totalCalories = 0,
          totalCarbs = 0,
          totalProteins = 0,
          totalSugar = 0,
          totalFats = 0,
          totalVitamins = 0;
        for (meal of res?.data?.data?.meals) {
          totalCalories += meal.calories;
          totalCarbs += meal.carbs;
          totalFats += meal.fats;
          totalProteins += meal.protein;
          totalSugar += meal.sugar;
          totalVitamins += meal.vitamins;
        }

        setTotalCalories(totalCalories);
        setProteins({ current: 0, total: totalProteins });
        setCarbs({ current: 0, total: totalCarbs });
        setFats({ current: 0, total: totalFats });
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  const handleAddWater = () => {
    // Check if consumed glasses have reached the total glasses limit (equal but not exceeded)
    if (consumedGlasses >= totalGlasses - 1) {
      // Show a notification that the daily limit is reached
      Alert.alert(
        "Daily Limit Reached",
        "You've reached your daily water intake goal!",
        [
          {
            text: "Continue Drinking",
            onPress: () => updateWaterIntake(),
          },
          {
            text: "Close",
            style: "cancel",
            onPress: () => updateWaterIntake(),
          },
        ]
      );
    } else {
      updateWaterIntake();
    }
  };

  // The rest of the component remains the same
  const handleSetGoal = () => {
    navigation.navigate("SetWaterGoal");
  };

  const updateWaterIntake = async () => {
    try {
      const response = await API.patch(
        `${END_POINTS.GOALS}`,
        {
          type: "Drinking",
          distance: {
            value: consumedGlasses + 1,
          },
          duration: {
            value: (consumedGlasses + 1) * goal?.targetDuration.value,
          },
        },
        token
      );

      if (response?.data?.success) {
        setConsumedGlasses((prev) => prev + 1);
        // fetchActiveGoal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchActiveGoal = async () => {
    try {
      const response = await API.get(
        END_POINTS.GOALS + "/type/Drinking",
        {},
        token
      );

      if (response?.data?.success) {
        setGoal(response?.data?.data);
        setTotalGlasses(parseInt(goal?.targetDistance?.value || 0));
        setConsumedGlasses(
          parseInt(
            goal?.activities.find((a) => a.date === date)?.distance?.value || 0
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Data for daily meal plan

  return (
    <Container>
      <Header title={"Nutrition"} />
      <ScrollView>
        <View style={styles.rowContainer}>
          {/* Eaten Section */}
          <View style={styles.columnContainer}>
            <EatenIcon />
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
            <CaloriesIcon />
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
          <Text style={styles.title}>Water Tracker</Text>
          <TouchableOpacity style={styles.goalButton} onPress={handleSetGoal}>
            <GoalIcon />
            <Text style={styles.goalText}>Set Goal</Text>
          </TouchableOpacity>
        </View>
        <WaterIntake
          consumedGlasses={consumedGlasses}
          totalGlasses={totalGlasses}
          totalVolume={goal?.targetDuration.value}
          onAddWater={handleAddWater}
        />

        <View style={styles.dailyPlanHeader}>
          <Text style={styles.title}>Your Daily Plan</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ViewAllMeals", {
                title: "My Daily Plan",
              })
            }
          >
            <Text style={styles.greenText}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={dailyPlans.slice(0, 4)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MealItem
              mealName={item?.name}
              mealImage={item?.image}
              calories={item?.calories}
              time={item?.preparationTime}
              mealItemOrientation={"Horizontal"}
              onPress={() =>
                navigation.navigate("MealDetailScreen", {
                  meal: item,
                  source: "dailyPlan",
                })
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
            onPress={() =>
              navigation.navigate("ViewAllMeals", { title: "Recipes" })
            } // Navigate to the new screen
          >
            <Text style={styles.greenText}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={nutritionMeals.slice(0, 4)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MealItem
              mealName={item?.name}
              mealImage={item?.image}
              calories={item?.calories}
              time={item?.preparationTime}
              mealItemOrientation={"Horizontal"}
              onPress={() =>
                navigation.navigate("MealDetailScreen", {
                  meal: item,
                  source: "popularRecipes",
                })
              }
            />
          )}
          contentContainerStyle={{ gap: 10, marginBottom: 20 }}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.title}>Nutrition Your Way</Text>

        <View style={styles.gridContainer}>
          {nutritionPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={styles.nutritionPlanCard}
              onPress={() =>
                navigation.navigate("NutritionPlans", {
                  title: plan.title,
                  type: plan.type,
                })
              }
            >
              {plan.icon}
              <Text style={styles.nutritionPlanText}>{plan.title}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => navigation.navigate("CreatePlan")}
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
    fontSize: FontSize.large,
    color: "white",
  },
  labelText: {
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
    color: "#A4A4A4",
  },
  remainingText: {
    fontFamily: "Poppins-Bold",
    fontSize: FontSize.large,
    color: "white",
  },
  remainingLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
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
    fontSize: FontSize.regular,
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
    fontSize: FontSize.small,
  },
  goalButton: {
    backgroundColor: colors.green,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    flexDirection: "row",
    gap: 7,
  },
  goalIcon: {
    width: 17,
    height: 17,
  },
  goalText: {
    fontSize: FontSize.small,
    marginTop: 2,
    fontFamily: "Poppins-SemiBold",
  },
  glassIcon: {
    width: 24,
    height: 24,
  },
  waterConsumptionText: {
    fontFamily: "Poppins-SemiBold",
    color: "white",
    fontSize: FontSize.small,
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
    fontSize: FontSize.small,
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
    fontSize: FontSize.small,
    fontFamily: "Poppins-SemiBold",
    color: "white",
  },
});

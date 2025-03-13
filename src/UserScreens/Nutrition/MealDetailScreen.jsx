import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackIcon from "../../assets/svgs/BackIcon";
import CaloriesIcon from "../../assets/svgs/CaloriesIcon";
import MealAddedIcon from "../../assets/svgs/MealAddedIcon";
import TimeIcon from "../../assets/svgs/TimeIcon";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import NutrientItem from "../../components/NutrientItem";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { colors } from "../../constants/colors";
import images from "../../constants/images";
import { setDailyPlans } from "../../redux/reducers/NutritionSlice";

const MealDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const { meal } = route.params; // Extract meal data from route params
  const [carbs, setCarbs] = useState({ current: meal?.carbs || 0, total: 30 });
  const [proteins, setProteins] = useState({
    current: meal?.protein || 0,
    total: 30,
  });
  const [fats, setFats] = useState({ current: meal?.fats || 0, total: 30 });
  const { token } = useSelector((state) => ({
    token: state.Auth?.token,
  }));

  // Combine meal details and ingredients into one array
  const renderData = [
    { type: "mealInfo", id: "mealInfo", meal },
    {
      type: "ingredients",
      id: "ingredients",
      ingredients: meal.ingredients.map((ingredient, index) => ({
        id: index.toString(), // Generate a unique key
        name: ingredient,
        quantity: "", // Add quantity if available
      })),
    },
    {
      type: "steps",
      id: "steps",
      steps: meal.recipe.map((step, index) => ({
        id: index.toString(), // Generate a unique key
        step: step,
      })),
    },
  ];

  const handleAddToPlan = async () => {
    try {
      const payload = {
        mealId: meal._id,
      };
      const res = await API.post(END_POINTS.ADD_DAILY_PLAN, payload, token);
      if (res.data.success) {
        dispatch(setDailyPlans(res.data?.data?.meals || []));
        setModalVisible(true);
        // dispatch(setNutritionMeals(res?.data?.data || []));
      }
    } catch (error) {
      console.error("Error adding daily plan:", error);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    setTimeout(() => {
      navigation.navigate("Nutrition");
    }, 500);
  };

  const renderItem = ({ item }) => {
    if (item.type === "mealInfo") {
      // Check if the mealImage is a valid URL or an object with a URI
      const imageSource =
        item.meal.image &&
        (typeof item.meal.image === "string" || item.meal.image?.uri)
          ? { uri: item.meal.image?.uri || item.meal.image }
          : images.lunch;
      return (
        <View style={{ position: "relative" }}>
          {/* Back Button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 60, // Adjust according to your image top padding
              left: 20, // Aligning to the left
              zIndex: 1,
            }}
            onPress={() => navigation.goBack()} // Add back navigation logic
          >
            <BackIcon />
          </TouchableOpacity>
          <Image source={imageSource} style={styles.image} />
          <View style={{ padding: 20 }}>
            <Text style={styles.mealName}>{item.meal?.name}</Text>
            <Text style={styles.title}>{item.meal?.title}</Text>

            {/* Meal Stats Container */}
            <View style={styles.mealStatsContainer}>
              <View style={styles.mealStats}>
                <View style={styles.statItem}>
                  <CaloriesIcon width={18} height={18} />
                  <Text style={styles.statText}>{item.meal.calories} kcal</Text>
                </View>
                <View style={styles.statItem}>
                  <TimeIcon />
                  <Text style={styles.statText}>
                    {item.meal.preparationTime}
                  </Text>
                </View>
              </View>
            </View>
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

            {/* Ingredients Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Text style={styles.title}>Ingredients</Text>
              <Text
                style={styles.items}
              >{`${item.meal.ingredients.length} items`}</Text>
            </View>

            <View
              style={{
                borderTopColor: "#69696952",
                borderTopWidth: 1,
                marginTop: 12,
              }}
            />
          </View>
        </View>
      );
    }

    if (item.type === "ingredients") {
      return (
        <>
          <FlatList
            data={item.ingredients}
            keyExtractor={(ingredient) => ingredient.id}
            renderItem={({ item }) => (
              <View style={styles.ingredientContainer}>
                <Text style={styles.ingredientText}>{item.name}</Text>
                <Text style={styles.ingredientQuantity}>{item.quantity}</Text>
              </View>
            )}
          />

          <View
            style={{
              borderTopColor: "#69696952",
              borderTopWidth: 1,
              marginVertical: 12,
            }}
          />
        </>
      );
    }
    if (item.type === "steps") {
      return (
        <View style={{ padding: 20 }}>
          <Text style={styles.title}>How to make Step by Steppppp</Text>
          <FlatList
            data={item.steps}
            keyExtractor={(step) => step.id}
            renderItem={({ item, index }) => (
              <View style={styles.stepContainer}>
                {/* Displaying the step number dynamically */}
                <Text style={styles.stepNum}>{`Step ${index + 1}`}</Text>
                <Text style={styles.stepText}>{item.step}</Text>
              </View>
            )}
          />

          <CustomButton
            style={{ marginTop: 20 }}
            title={"Add to your Plan"}
            onPress={handleAddToPlan}
          />
          <CustomModal
            visible={isModalVisible}
            onClose={handleClose}
            modalIcon={<MealAddedIcon />}
            modalText={"Meal Added!"}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <Container cusStyles={{ padding: 0 }}>
      <FlatList
        data={renderData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  mealName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
    color: colors.green,
  },
  image: {
    width: "100%",
    height: 290,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: "Poppins-SemiBold",
    color: "white",
  },
  items: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "Poppins-Medium",
    color: "#AFAFAF",
  },
  mealStatsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", // Aligns the mealStats to the right
  },
  mealStats: {
    flexDirection: "row",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15, // Adds space between stat items
    gap: 5,
  },
  statIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  statText: {
    fontFamily: "Poppins-Regular",
    color: "#F8F8F8",
    fontSize: 12,
    marginTop: 2,
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
  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingVertical: 10,
    paddingHorizontal: 24,
  },
  ingredientText: {
    color: "#F8F8F8",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginVertical: 5,
  },
  ingredientQuantity: {
    color: "#AFAFAF",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  stepContainer: {
    marginBottom: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  stepNum: {
    color: colors.green,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  stepText: {
    color: "#AFAFAF",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
});

export default MealDetailScreen;

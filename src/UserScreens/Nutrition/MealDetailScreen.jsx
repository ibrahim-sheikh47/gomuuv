import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../constants/colors";
import icons from "../../constants/icons";
import NutrientItem from "../../components/NutrientItem";
import CustomModal from "../../components/CustomModal";
import { useNavigation } from "@react-navigation/native";
import BackIcon from "../../assets/svgs/BackIcon";
import CaloriesIcon from "../../assets/svgs/CaloriesIcon";
import TimeIcon from "../../assets/svgs/TimeIcon";
import MealAddedIcon from "../../assets/svgs/MealAddedIcon";

const MealDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { meal } = route.params; // Extract meal data from route params
  const [carbs, setCarbs] = useState({ current: 20, total: 30 });
  const [proteins, setProteins] = useState({ current: 10, total: 30 });
  const [fats, setFats] = useState({ current: 30, total: 30 });

  // Combine meal details and ingredients into one array
  const renderData = [
    { type: "mealInfo", id: "mealInfo", meal },
    { type: "ingredients", id: "ingredients", ingredients: meal.ingredients },
    { type: "steps", id: "steps", steps: meal.steps },
  ];

  const [isModalVisible, setModalVisible] = useState(false);
  const handleAddToPlan = () => {
    setModalVisible(true);
  };
  const handleClose = () => {
    setModalVisible(false);
    setTimeout(() => {
      navigation.navigate("Nutrition");
    }, 500);
  };

  const renderItem = ({ item }) => {
    if (item.type === "mealInfo") {
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
          <Image source={item.meal.mealImage} style={styles.image} />
          <View style={{ padding: 20 }}>
            <Text style={styles.mealName}>{item.meal.mealName}</Text>
            <Text style={styles.title}>{item.meal.title}</Text>

            {/* Meal Stats Container */}
            <View style={styles.mealStatsContainer}>
              <View style={styles.mealStats}>
                <View style={styles.statItem}>
                  <CaloriesIcon width={18} height={18} />
                  <Text style={styles.statText}>{item.meal.calories} kcal</Text>
                </View>
                <View style={styles.statItem}>
                  <TimeIcon />
                  <Text style={styles.statText}>{item.meal.time} mins</Text>
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
                marginVertical: 12,
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
    paddingVertical: 10,
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

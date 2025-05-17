import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import NutrientItem from "../../components/NutrientItem";
import SearchBar from "../../components/SearchBar";
import { colors } from "../../constants/colors";
import icons from "../../constants/icons";
// Import the new meal data arrays
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { MealItem } from "../../components/MealItem";
import { FontSize } from "../../utils/font";

const AddMealDetails = ({ route }) => {
  const navigation = useNavigation();
  const { label } = route.params; // Label passed from MealCard (e.g., "Breakfast", "Lunch")
  const [carbs, setCarbs] = useState({ current: 0, total: 30 });
  const [proteins, setProteins] = useState({ current: 0, total: 30 });
  const [fats, setFats] = useState({ current: 0, total: 30 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const { nutritionMeals } = useSelector((state) => state.Nutrition);

  // Combine dailyPlanData and popularRecipesData
  const mealData = [...nutritionMeals];

  // Filter meal data based on type
  useEffect(() => {
    const filtered = mealData.filter(
      (meal) => meal.category.toLowerCase() === label.toLowerCase()
    );
    setFilteredData(filtered);
  }, [label]);

  // Handle search functionality
  const onChangeSearch = (query) => {
    setSearchQuery(query);

    if (query) {
      // Filter meal data based on the search query within the filtered meals
      const filtered = mealData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      // Reset to the type-based filtered data if the search query is empty
      const filtered = mealData.filter(
        (meal) => meal.type.toLowerCase() === label.toLowerCase()
      );
      setFilteredData(filtered);
    }
  };

  return (
    <Container style={styles.container}>
      <Header title={label} showBackButton={true} />

      <SearchBar searchQuery={searchQuery} onChangeSearch={onChangeSearch} />

      <FlatList
        style={{ marginBottom: 20 }}
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MealItem
            style={styles.ViewAll}
            mealName={item.name}
            mealImage={item.image}
            calories={item.calories}
            time={item.preparationTime}
            showDelIcon={true}
            onPress={() =>
              navigation.navigate("MealDetailScreen", {
                meal: item,
                source: "popularRecipes",
              })
            }
          />
        )}
        ListHeaderComponent={
          <>
            <Text
              style={{
                color: "white",
                fontFamily: "Poppins-Bold",
                fontSize: FontSize.regular,
              }}
            >
              Daily Intake
            </Text>
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

            <Text
              style={{
                color: "white",
                fontFamily: "Poppins-Bold",
                fontSize: FontSize.small,
                marginVertical: 20,
              }}
            >
              Your {label}
            </Text>
          </>
        }
        showsVerticalScrollIndicator={false}
      />
      <CustomButton
        title={"Scan Your Meal"}
        btnIcon={icons.scan}
        iconStyle={{ width: 18, height: 18 }}
      />
      <CustomButton
        onPress={() =>
          navigation.navigate("ViewAllMeals", { title: "Recipes" })
        }
        title={"Add Manually"}
        style={{
          borderColor: colors.green,
          borderWidth: 1,
          backgroundColor: "transparent",
        }}
        textStyle={{ color: colors.green }}
        btnIcon={icons.greenPlus}
        iconStyle={{ width: 12, height: 12 }}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: FontSize.xxlarge,
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
  ViewAll: {
    width: "100%",
  },
});

export default AddMealDetails;

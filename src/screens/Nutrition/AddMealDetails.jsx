import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import Header from "../../components/Header";
import Container from "../../components/Container";
import SearchBar from "../../components/SearchBar";
import NutrientItem from "../../components/NutrientItem";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import { colors } from "../../constants/colors";
// Import the new meal data arrays
import { dailyPlanData, popularRecipesData } from "../../utils/data";
import { MealItem } from "../../components/MealItem";

const AddMealDetails = ({ route }) => {
  const { label } = route.params; // Label passed from MealCard (e.g., "Breakfast", "Lunch")
  const [carbs, setCarbs] = useState({ current: 10, total: 30 });
  const [proteins, setProteins] = useState({ current: 10, total: 30 });
  const [fats, setFats] = useState({ current: 30, total: 30 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Combine dailyPlanData and popularRecipesData
  const mealData = [...dailyPlanData, ...popularRecipesData];

  // Filter meal data based on type
  useEffect(() => {
    const filtered = mealData.filter(
      (meal) => meal.type.toLowerCase() === label.toLowerCase()
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
            title={item.title}
            mealName={item.mealName}
            mealImage={item.mealImage}
            calories={item.calories}
            time={item.time}
            showDelIcon={true}
          />
        )}
        ListHeaderComponent={
          <>
            <Text
              style={{
                color: "white",
                fontFamily: "Poppins-Bold",
                fontSize: 16,
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
                fontSize: 16,
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
    fontSize: 24,
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

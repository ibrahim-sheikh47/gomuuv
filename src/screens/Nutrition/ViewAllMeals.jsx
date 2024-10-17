import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { MealItem } from "../../components/MealItem";
import { dailyPlanData, popularRecipesData } from "../../utils/data"; // Import both data sources
import Container from "../../components/Container";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import MealCategorySelector from "../../components/MealCategorySelector"; // Import the new component

const ViewAllMeals = ({ route, navigation }) => {
  const { title } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Determine which data source to use based on the title
  useEffect(() => {
    if (title.toLowerCase() === "recipes") {
      setFilteredData(popularRecipesData);
    } else {
      setFilteredData(dailyPlanData);
    }
  }, [title]);

  const onChangeSearch = (query) => {
    setSearchQuery(query);

    // Filter data based on the currently selected dataset
    const dataToFilter =
      title.toLowerCase() === "recipes" ? popularRecipesData : dailyPlanData;

    if (query) {
      const filtered = dataToFilter.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(dataToFilter);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState(null);
  const mealCategories = [
    { label: "All", icon: icons.dinner },
    { label: "Breakfast", icon: icons.breakfast },
    { label: "Lunch", icon: icons.lunch },
    { label: "Snacks", icon: icons.snacks },
  ];

  return (
    <Container>
      <Header title={title} showBackButton={true} />

      <SearchBar searchQuery={searchQuery} onChangeSearch={onChangeSearch} />

      {title.toLowerCase() === "recipes" && (
        <>
          <MealCategorySelector
            categories={mealCategories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory} // Pass the state updater directly
          />

          <Text
            style={{
              color: "white",
              fontFamily: "Poppins-Bold",
              fontSize: 16,
              marginBottom: 5,
            }}
          >
            Popular Recipes
          </Text>
        </>
      )}

      <FlatList
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
            iconType="next"
            onPress={() =>
              navigation.navigate("MealDetailScreen", { meal: item })
            }
          />
        )}
        contentContainerStyle={{ flex: 1 }}
        numColumns={1} // One item per row
        showsVerticalScrollIndicator={false}
      />
      {title.toLowerCase() !== "recipes" && (
        <CustomButton
          title={"Add Meal"}
          onPress={() => navigation.navigate("AddMeal")}
        />
      )}
    </Container>
  );
};

export default ViewAllMeals;

const styles = StyleSheet.create({
  searchBar: {
    margin: 10,
    borderRadius: 20,
  },
  ViewAll: {
    width: "100%",
  },
});

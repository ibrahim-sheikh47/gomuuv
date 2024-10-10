import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { MealItem } from "../../components/MealItem";
import { mealData } from "../../utils/data"; // or popularRecipes depending on which data you are viewing
import Container from "../../components/Container";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import CustomButton from "../../components/CustomButton";

const ViewAllMeals = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(mealData); // Initially, display all items

  // Handle search functionality
  const onChangeSearch = (query) => {
    setSearchQuery(query);

    if (query) {
      // Filter meal data based on the search query
      const filtered = mealData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      // Show all items if search query is empty
      setFilteredData(mealData);
    }
  };

  return (
    <Container>
      <Header title={"All Meals"} showBackButton={true} />

      <SearchBar searchQuery={searchQuery} onChangeSearch={onChangeSearch} />

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
            showDelIcon={true}
          />
        )}
        contentContainerStyle={{ flex: 1 }}
        numColumns={1} // One item per row
        showsVerticalScrollIndicator={false}
      />
      <CustomButton title={"+ Add Meal"} />
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

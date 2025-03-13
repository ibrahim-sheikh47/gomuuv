import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BreakfastIcon from "../../assets/svgs/BreakfastIcon";
import EatenIcon from "../../assets/svgs/EatenIcon";
import LunchIcon from "../../assets/svgs/LunchIcon";
import SnacksIcon from "../../assets/svgs/SnacksIcon";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import MealCategorySelector from "../../components/MealCategorySelector";
import { MealItem } from "../../components/MealItem";
import SearchBar from "../../components/SearchBar";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import {
  setDailyPlans,
  setNutritionMeals,
} from "../../redux/reducers/NutritionSlice";

const ViewAllMeals = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { title } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default to 'All'

  const { token, dailyPlans, nutritionMeals } = useSelector((state) => ({
    token: state.Auth?.token,
    nutritionMeals: state.Nutrition.data,
    dailyPlans: state.Nutrition.dailyPlans,
  }));

  useEffect(() => {
    if (title === "Recipes") {
      getNutritionMeals();
    } else {
      getDailyPlans();
    }
  }, []);

  useEffect(() => {
    filterMeals(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory, nutritionMeals]);

  const getNutritionMeals = async () => {
    try {
      const res = await API.get(END_POINTS.NUTRITION_MEALS, null, token);
      if (res.data.success) {
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
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    filterMeals(query, selectedCategory);
  };

  const filterMeals = (query, category) => {
    let dataToFilter = title === "Recipes" ? nutritionMeals : dailyPlans;

    // Filter by category
    if (category !== "All") {
      dataToFilter = dataToFilter.filter(
        (item) => item?.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query
    if (query) {
      dataToFilter = dataToFilter.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredData(dataToFilter);
  };

  const mealCategories = [
    { label: "All", icon: <EatenIcon />, value: "All" },
    {
      label: "Breakfast",
      icon: <BreakfastIcon width={22} height={22} />,
      value: "Breakfast",
    },
    {
      label: "Lunch",
      icon: <LunchIcon width={24} height={24} />,
      value: "Lunch",
    },
    {
      label: "Snacks",
      icon: <SnacksIcon width={24} height={24} />,
      value: "Snacks",
    },
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
            onSelect={(index) =>
              setSelectedCategory(mealCategories[index].value)
            }
          />

          <Text style={styles.title}>Popular Recipes</Text>
        </>
      )}

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MealItem
            style={styles.ViewAll}
            mealName={item?.name}
            mealImage={item?.image}
            calories={item?.calories}
            time={item?.preparationTime}
            iconType="next"
            onPress={() =>
              navigation.navigate("MealDetailScreen", { meal: item })
            }
          />
        )}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ marginBottom: 25 }} />}
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
  title: {
    color: "white",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    marginBottom: 5,
    marginTop: 20,
  },
});

import React, { useState, useCallback } from "react";
import { Text, FlatList, StyleSheet } from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import { MealItem } from "../../components/MealItem";
import { FontSize } from "../../utils/font";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const NutritionPlans = ({ route, navigation }) => {
  const { title, type } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlans, setFilteredPlans] = useState([]);

  const { token } = useSelector((state) => state.Auth);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  useFocusEffect(
    useCallback(() => {
      getNutritionMeals();
    }, [])
  );

  const getNutritionMeals = async () => {
    try {
      const res = await API.get(`${END_POINTS.DIET_PLANS}`, null, token);
      if (res.data.success) {
        setFilteredPlans(res?.data?.data.filter((p) => p.type === type));
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  return (
    <Container>
      <Header title={"Nutrition Your Way"} showBackButton={true} />
      <SearchBar searchQuery={searchQuery} onChangeSearch={onChangeSearch} />

      <Text
        style={{
          fontSize: FontSize.regular,
          fontFamily: "Poppins-Bold",
          color: "#fff",
        }}
      >
        {title}
      </Text>
      <FlatList
        data={filteredPlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MealItem
            style={styles.ViewAll}
            title={item.title}
            mealName={item.name}
            mealImage={item.cover}
            calories={item.meals.reduce(
              (sum, meal) => sum + (meal.calories || 0),
              0
            )}
            time={"50mins"}
            iconType="next"
            onPress={() => navigation.navigate("NutritionPlan", { plan: item })}
          />
        )}
        ListEmptyComponent={
          <Text
            style={{
              fontSize: FontSize.small,
              color: "white",
              fontWeight: "bold",
            }}
          >
            No Plans
          </Text>
        }
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: filteredPlans.length === 0 ? "center" : "flex-start",
        }}
        numColumns={1} // One item per row
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default NutritionPlans;

const styles = StyleSheet.create({
  ViewAll: {
    width: "100%",
  },
});

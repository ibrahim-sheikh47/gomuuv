import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import { MealItem } from "../../components/MealItem";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal"; // Import your CustomModal
import { nutritionPlansData } from "../../utils/data";
import icons from "../../constants/icons";
import { FontSize } from "../../utils/font";

const NutritionPlans = ({ route, navigation }) => {
  const { title, type } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [modalText, setModalText] = useState(""); // State for modal text
  const [modalIcon, setModalIcon] = useState(null); // State for modal icon

  useEffect(() => {
    const plans = nutritionPlansData.filter((plan) => plan.type === type);
    setFilteredPlans(plans);
  }, [type]);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  const handleStartPlan = () => {
    // Set the modal text and icon here
    setModalText("You have started this nutrition plan!"); // Customize this message
    setModalIcon();
    setModalVisible(true); // Show the modal
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
        contentContainerStyle={{ flexGrow: 1 }}
        numColumns={1} // One item per row
        showsVerticalScrollIndicator={false}
      />
      <CustomButton
        style={{ marginTop: 20 }}
        title={"Start this Plan"}
        onPress={handleStartPlan} // Handle button press
      />

      {/* Render the custom modal */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modalText={"Plan Added!"}
        modalIcon={
          <Image style={{ width: 60, height: 60 }} source={icons.planAdded} />
        }
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

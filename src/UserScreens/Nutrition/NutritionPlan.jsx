import React, { useState } from "react";
import { FlatList, StyleSheet, Image } from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import { MealItem } from "../../components/MealItem";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal"; // Import your CustomModal
import icons from "../../constants/icons";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const NutritionPlan = ({ route }) => {
  const { plan } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [modalText, setModalText] = useState(""); // State for modal text
  const [modalIcon, setModalIcon] = useState(null); // State for modal icon

  const { token } = useSelector((state) => state.Auth);

  const handleStartPlan = async () => {
    try {
      for (meal of plan.meals) {
        const payload = {
          mealId: meal._id,
        };
        await API.post(END_POINTS.ADD_DAILY_PLAN, payload, token);
      }
    } catch (error) {
      console.error("Error adding daily plan:", error);
    }

    setModalText("You have started this nutrition plan!"); // Customize this message
    setModalIcon();
    setModalVisible(true); // Show the modal
  };

  return (
    <Container>
      <Header title={plan.name} showBackButton={true} />

      <FlatList
        data={plan.meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MealItem
            style={{ width: "100%" }}
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
        onClose={() => {
          setModalVisible(false);
          navigation.reset({
            routes: [
              {
                name: "TabNavigator",
                params: {
                  screen: "Nutrition", // Navigate to the "Chats" screen within the TabNavigator
                },
              },
            ],
            index: 0,
          });
        }}
        modalText={"Plan Added!"}
        modalIcon={
          <Image style={{ width: 60, height: 60 }} source={icons.planAdded} />
        }
      />
    </Container>
  );
};

export default NutritionPlan;

const styles = StyleSheet.create({
  ViewAll: {
    width: "100%",
  },
});

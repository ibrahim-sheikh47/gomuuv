import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import Selectable from "../../components/Selectable";
import MealCard from "../../components/MealCard";
import InputField from "../../components/InputField"; // Import InputField
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import icons from "../../constants/icons";
import { colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

const CreatePlan = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [is2ndModalVisible, set2ndModalVisible] = useState(false);
  const handleSave = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      set2ndModalVisible(true);
    }, 2000);
  };
  const handleClose = () => {
    setModalVisible(false);
    set2ndModalVisible(false);
    navigation.navigate("Nutrition");
  };
  const duration = [
    "Lose Weight",
    "Gain Weight",
    "Maintain Weight",
    "Stay Fit",
    "Others",
  ];
  const diets = [
    "Vegetarian",
    "Gluten-free",
    "High Fibre",
    "Raw",
    "Organic",
    "Low Carbs",
    "Dairy Free",
    "High Proteins",
    "Keto",
  ];

  // Single state object to hold all input values
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    targetWeight: "",
  });

  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState(null);

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const [selectedGender, setSelectedGender] = useState(null);

  const handleGenderSelection = (gender) => {
    setSelectedGender(gender);
  };

  return (
    <Container>
      <Header title={"Create Plan"} showBackButton={true} />
      <ScrollView style={{ marginVertical: 30 }}>
        <View>
          <Text
            style={{ color: "white", fontSize: 16, fontFamily: "Poppins-Bold" }}
          >
            What's Your Main Goal
          </Text>
          <Selectable
            items={duration}
            selectedItem={selectedPeriod}
            setSelectedItem={setSelectedPeriod}
            wrapOnLineChange={true}
          />
          <Text
            style={{
              color: "white",
              fontSize: 16,
              marginVertical: 20,
              fontFamily: "Poppins-Bold",
            }}
          >
            What's Your Gender
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              style={[
                styles.card,
                selectedGender === "male" ? styles.selectedCard : {},
              ]}
              onPress={() => handleGenderSelection("male")}
            >
              <Image
                source={icons.male}
                style={[
                  styles.icon,
                  selectedGender === "male" ? styles.selectedIcon : {},
                ]}
              />
              <Text
                style={[
                  styles.cardText,
                  selectedGender === "male" ? styles.selectedText : {},
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.card,
                selectedGender === "female" ? styles.selectedCard : {},
              ]}
              onPress={() => handleGenderSelection("female")}
            >
              <Image
                source={icons.female}
                style={[
                  styles.icon,
                  selectedGender === "female" ? styles.selectedIcon : {},
                ]}
              />
              <Text
                style={[
                  styles.cardText,
                  selectedGender === "female" ? styles.selectedText : {},
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
          <InputField
            label="What's Your Age"
            value={formData.age}
            onChangeText={(value) => handleInputChange("age", value)}
            keyboardType="numeric"
            placeholder="Enter your age"
          />
          <InputField
            label="What's Your Height"
            value={formData.height}
            onChangeText={(value) => handleInputChange("height", value)}
            keyboardType="numeric"
            placeholder="Enter your height"
          />
          <InputField
            label="What's Your Weight"
            value={formData.weight}
            onChangeText={(value) => handleInputChange("weight", value)}
            keyboardType="numeric"
            placeholder="Enter your weight"
          />
          <InputField
            label="What's Your Target Weight"
            value={formData.targetWeight}
            onChangeText={(value) => handleInputChange("targetWeight", value)}
            keyboardType="numeric"
            placeholder="Enter your target weight"
          />
          <Text
            style={{
              color: "white",
              fontSize: 16,
              marginVertical: 20,
              fontFamily: "Poppins-Bold",
            }}
          >
            Select your Dietary Preferences
          </Text>
          <Selectable
            items={diets}
            selectedItem={selectedDiet}
            setSelectedItem={setSelectedDiet}
            wrapOnLineChange={true}
          />
        </View>
      </ScrollView>

      <CustomButton title={"Save"} onPress={handleSave} />
      <CustomModal
        visible={isModalVisible}
        onClose={handleClose}
        modalIcon={icons.wait}
        modalText={"Please Wait While We Select Plan For You"}
      />
      <CustomModal
        visible={is2ndModalVisible}
        onClose={handleClose}
        modalIcon={icons.planAdded}
        modalText={"Plan Added!"}
      />
    </Container>
  );
};

export default CreatePlan;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#242425",
    height: 103,
    width: "48%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  selectedCard: {
    backgroundColor: colors.green,
  },
  icon: {
    width: 32,
    height: 32,
  },
  selectedIcon: {
    tintColor: "black", // Icon color when selected
  },
  selectedText: {
    color: "black",
  },
  cardText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 10,
    fontFamily: "Poppins-Bold",
  },
});

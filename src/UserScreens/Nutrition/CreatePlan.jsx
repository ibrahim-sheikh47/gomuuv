import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import Header from "../../components/Header";
import InputField from "../../components/InputField"; // Import InputField
import Selectable from "../../components/Selectable";
import { colors } from "../../constants/colors";
import icons from "../../constants/icons";
import { useSelector } from "react-redux";

const CreatePlan = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [is2ndModalVisible, set2ndModalVisible] = useState(false);
  const { userData } = useSelector((state) => ({
    userData: state.Auth?.data,
  }));
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
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    targetWeight: "",
    targetWeightUnit: "kg",
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

  const handleClose = (payload) => {
    setModalVisible(false);
    set2ndModalVisible(false);
    navigation.navigate("FinalizePlan", { planData: payload });
  };

  const handleSave = async () => {
    if (!selectedPeriod) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2: "Please select a goal (e.g., lose weight, gain weight, etc.).",
      });
      return;
    }

    if (!selectedGender) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2: "Please select a gender.",
      });
      return;
    }

    if (!formData.age || isNaN(formData.age) || formData.age <= 0) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2: "Please enter a valid age.",
      });
      return;
    }

    if (!formData.height || isNaN(formData.height) || formData.height <= 0) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2: "Please enter a valid height.",
      });
      return;
    }

    if (!formData.weight || isNaN(formData.weight) || formData.weight <= 0) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2: "Please enter a valid weight.",
      });
      return;
    }

    if (
      !formData.targetWeight ||
      isNaN(formData.targetWeight) ||
      formData.targetWeight <= 0
    ) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2: "Please enter a valid target weight.",
      });
      return;
    }

    if (
      formData.targetWeight >= formData.weight &&
      selectedPeriod === "lose weight"
    ) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2:
          "Target weight must be less than the current weight to lose weight.",
      });
      return;
    }

    if (
      formData.targetWeight <= formData.weight &&
      selectedPeriod === "gain weight"
    ) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2:
          "Target weight must be greater than the current weight to gain weight.",
      });
      return;
    }

    if (!selectedDiet) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2: "Please select a dietary preference.",
      });
      return;
    }

    // Prepare Payload
    const createPlanPayload = {
      user: userData?._id,
      goal: selectedPeriod?.toLowerCase(),
      gender: selectedGender?.toLowerCase(),
      age: parseInt(formData.age, 10),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      targetWeight: parseFloat(formData.targetWeight),
      dietaryPreferences: [selectedDiet?.toLowerCase()],
    };

    try {
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        set2ndModalVisible(true);

        setTimeout(() => {
          set2ndModalVisible(false);
          handleClose(createPlanPayload); // Pass the payload when navigating
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error("Error creating plan:", error);
    }
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
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField
                label="What's Your Height"
                value={formData.height}
                onChangeText={(value) => handleInputChange("height", value)}
                keyboardType="numeric"
                placeholder="Enter your height"
              />
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.heightUnit}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  handleInputChange("heightUnit", itemValue)
                }
                dropdownIconColor={colors.green}
              >
                <Picker.Item label="cm" value="cm" />
                <Picker.Item label="ft" value="ft" />
              </Picker>
            </View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField
                label="What's Your Weight"
                value={formData.weight}
                onChangeText={(value) => handleInputChange("weight", value)}
                keyboardType="numeric"
                placeholder="Enter your weight"
              />
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.weightUnit}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  handleInputChange("weightUnit", itemValue)
                }
                dropdownIconColor={colors.green}
              >
                <Picker.Item label="kg" value="kg" />
                <Picker.Item label="lb" value="lb" />
              </Picker>
            </View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField
                label="What's Your Target Weight"
                value={formData.targetWeight}
                onChangeText={(value) =>
                  handleInputChange("targetWeight", value)
                }
                keyboardType="numeric"
                placeholder="Enter your target weight"
              />
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.targetWeightUnit}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  handleInputChange("targetWeightUnit", itemValue)
                }
                dropdownIconColor={colors.green}
              >
                <Picker.Item label="kg" value="kg" />
                <Picker.Item label="lb" value="lb" />
              </Picker>
            </View>
          </View>

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
        modalText={"Plan Created!"}
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  pickerContainer: {
    height: 50,
    width: 100,
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: "#1A1919", // Match the input field background
  },
  picker: {
    height: "100%",
    width: "100%",
    color: "#fff",
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

import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  SafeAreaView,
} from "react-native";
import Toast from "react-native-toast-message";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import Selectable from "../../components/Selectable";
import MultiSelectable from "../../components/MultiSelectable";
import { colors } from "../../constants/colors";
import icons from "../../constants/icons";
import { useSelector } from "react-redux";
import { FontSize } from "../../utils/font";

// Unit Selection Modal Component
const UnitSelectionModal = ({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Unit</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  selectedValue === option.value && styles.selectedOption,
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedValue === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const CreatePlan = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [is2ndModalVisible, set2ndModalVisible] = useState(false);
  const { data: userData } = useSelector((state) => state.Auth);

  // Modal visibility states
  const [heightUnitModalVisible, setHeightUnitModalVisible] = useState(false);
  const [weightUnitModalVisible, setWeightUnitModalVisible] = useState(false);
  const [targetWeightUnitModalVisible, setTargetWeightUnitModalVisible] =
    useState(false);

  // Unit options
  const heightUnitOptions = [
    { label: "cm", value: "cm" },
    { label: "ft", value: "ft" },
  ];

  const weightUnitOptions = [
    { label: "kg", value: "kg" },
    { label: "lb", value: "lb" },
  ];

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
    heightFeet: "",
    heightInches: "",
    weight: "",
    weightUnit: "kg",
    targetWeight: "",
    targetWeightUnit: "kg",
  });

  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);

  // Effect to handle height unit changes
  useEffect(() => {
    if (formData.heightUnit === "ft") {
      // Convert cm to feet and inches if switching from cm to ft
      if (formData.height && !formData.heightFeet) {
        const totalInches = Math.round(formData.height / 2.54);
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        setFormData((prev) => ({
          ...prev,
          heightFeet: feet.toString(),
          heightInches: inches.toString(),
          height: `${feet} ft ${inches} inches`,
        }));
      }
    } else {
      // Convert feet and inches to cm if switching from ft to cm
      if (formData.heightFeet && formData.heightInches) {
        const totalInches =
          parseInt(formData.heightFeet) * 12 +
          parseInt(formData.heightInches || 0);
        const cm = Math.round(totalInches * 2.54);
        setFormData((prev) => ({
          ...prev,
          height: cm.toString(),
        }));
      }
    }
  }, [formData.heightUnit]);

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Function to handle feet and inches input
  const handleHeightChange = (field, value) => {
    // Only allow numbers
    if (value !== "" && !/^\d+$/.test(value)) {
      return;
    }

    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [field]: value,
      };

      // Update the combined height display
      if (field === "heightFeet" || field === "heightInches") {
        const feet = newData.heightFeet || "0";
        const inches = newData.heightInches || "0";
        newData.height = `${feet} ft ${inches} inches`;
      }

      return newData;
    });
  };

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

    // Height validation
    if (formData.heightUnit === "cm") {
      if (!formData.height || isNaN(formData.height) || formData.height <= 0) {
        Toast.show({
          type: "error",
          text1: "Alert!",
          text2: "Please enter a valid height.",
        });
        return;
      }
    } else {
      // For feet and inches
      if (
        !formData.heightFeet ||
        isNaN(formData.heightFeet) ||
        formData.heightFeet < 0
      ) {
        Toast.show({
          type: "error",
          text1: "Alert!",
          text2: "Please enter valid feet for height.",
        });
        return;
      }
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
      parseFloat(formData.targetWeight) >= parseFloat(formData.weight) &&
      selectedPeriod.toLowerCase() === "lose weight"
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
      parseFloat(formData.targetWeight) <= parseFloat(formData.weight) &&
      selectedPeriod.toLowerCase() === "gain weight"
    ) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2:
          "Target weight must be greater than the current weight to gain weight.",
      });
      return;
    }

    if (selectedDiets.length === 0) {
      Toast.show({
        type: "error",
        text1: "Alert!",
        text2: "Please select at least one dietary preference.",
      });
      return;
    }

    // Calculate height in cm for the payload
    let heightInCm;
    if (formData.heightUnit === "cm") {
      heightInCm = parseFloat(formData.height);
    } else {
      // Convert feet and inches to cm
      const feet = parseInt(formData.heightFeet) || 0;
      const inches = parseInt(formData.heightInches) || 0;
      const totalInches = feet * 12 + inches;
      heightInCm = Math.round(totalInches * 2.54);
    }

    // Prepare Payload
    const createPlanPayload = {
      user: userData?._id,
      goal: selectedPeriod?.toLowerCase(),
      gender: selectedGender?.toLowerCase(),
      age: parseInt(formData.age, 10),
      height: heightInCm,
      weight: parseFloat(formData.weight),
      targetWeight: parseFloat(formData.targetWeight),
      dietaryPreferences: selectedDiets.map((diet) => diet.toLowerCase()),
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
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create plan. Please try again.",
      });
    }
  };

  // Render height input based on unit
  const renderHeightInput = () => {
    if (formData.heightUnit === "cm") {
      return (
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <InputField
              label="What's Your Height"
              value={formData.height}
              onChangeText={(value) => handleInputChange("height", value)}
              keyboardType="numeric"
              placeholder="Enter your height in cm"
            />
          </View>
          <TouchableOpacity
            style={styles.unitSelector}
            onPress={() => setHeightUnitModalVisible(true)}
          >
            <Text style={styles.unitText}>{formData.heightUnit}</Text>
            <Image source={icons.dropdown} style={styles.dropdownIcon} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.label}>What's Your Height</Text>
          <View style={styles.feetInchesContainer}>
            <View style={styles.feetContainer}>
              <TextInput
                style={styles.feetInput}
                value={formData.heightFeet}
                onChangeText={(value) =>
                  handleHeightChange("heightFeet", value)
                }
                keyboardType="numeric"
                placeholder="Feet"
                placeholderTextColor="#888"
              />
              <Text style={styles.feetInchesLabel}>ft</Text>
            </View>
            <View style={styles.inchesContainer}>
              <TextInput
                style={styles.inchesInput}
                value={formData.heightInches}
                onChangeText={(value) =>
                  handleHeightChange("heightInches", value)
                }
                keyboardType="numeric"
                placeholder="Inches"
                placeholderTextColor="#888"
              />
              <Text style={styles.feetInchesLabel}>in</Text>
            </View>
            <TouchableOpacity
              style={styles.unitSelector}
              onPress={() => setHeightUnitModalVisible(true)}
            >
              <Text style={styles.unitText}>{formData.heightUnit}</Text>
              <Image source={icons.dropdown} style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>
        </View>
      );
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
              fontSize: FontSize.regular,
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

          {renderHeightInput()}

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
            <TouchableOpacity
              style={styles.unitSelector}
              onPress={() => setWeightUnitModalVisible(true)}
            >
              <Text style={styles.unitText}>{formData.weightUnit}</Text>
              <Image source={icons.dropdown} style={styles.dropdownIcon} />
            </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.unitSelector}
              onPress={() => setTargetWeightUnitModalVisible(true)}
            >
              <Text style={styles.unitText}>{formData.targetWeightUnit}</Text>
              <Image source={icons.dropdown} style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: "white",
              fontSize: FontSize.regular,
              marginVertical: 20,
              fontFamily: "Poppins-Bold",
            }}
          >
            Select your Dietary Preferences
          </Text>
          <MultiSelectable
            items={diets}
            selectedItems={selectedDiets}
            setSelectedItems={setSelectedDiets}
            wrapOnLineChange={true}
          />
        </View>
      </ScrollView>

      <CustomButton title={"Create Plan"} onPress={handleSave} />

      {/* Unit Selection Modals */}
      <UnitSelectionModal
        visible={heightUnitModalVisible}
        onClose={() => setHeightUnitModalVisible(false)}
        options={heightUnitOptions}
        selectedValue={formData.heightUnit}
        onSelect={(value) => handleInputChange("heightUnit", value)}
      />

      <UnitSelectionModal
        visible={weightUnitModalVisible}
        onClose={() => setWeightUnitModalVisible(false)}
        options={weightUnitOptions}
        selectedValue={formData.weightUnit}
        onSelect={(value) => handleInputChange("weightUnit", value)}
      />

      <UnitSelectionModal
        visible={targetWeightUnitModalVisible}
        onClose={() => setTargetWeightUnitModalVisible(false)}
        options={weightUnitOptions}
        selectedValue={formData.targetWeightUnit}
        onSelect={(value) => handleInputChange("targetWeightUnit", value)}
      />

      {/* Process Modals */}
      <CustomModal
        visible={isModalVisible}
        onClose={handleClose}
        modalIcon={
          <Image style={{ width: 60, height: 60 }} source={icons.wait} />
        }
        modalText={"Please Wait While We Select Plan For You"}
      />
      <CustomModal
        visible={is2ndModalVisible}
        onClose={handleClose}
        modalIcon={
          <Image style={{ width: 60, height: 60 }} source={icons.planAdded} />
        }
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
    backgroundColor: "#BBF65480",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  unitSelector: {
    height: 50,
    width: 100,
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: "#1A1919",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  unitText: {
    color: "#fff",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
    marginRight: 5,
  },
  dropdownIcon: {
    width: 12,
    height: 12,
    tintColor: colors.green,
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
    fontSize: FontSize.small,
    marginTop: 10,
    fontFamily: "Poppins-Bold",
  },
  label: {
    color: "#fff",
    fontSize: FontSize.small,
    marginBottom: 8,
    fontFamily: "Poppins-Medium",
  },
  feetInchesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  feetContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1919",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  inchesContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1919",
    borderRadius: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  feetInput: {
    flex: 1,
    color: "#fff",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  inchesInput: {
    flex: 1,
    color: "#fff",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  feetInchesLabel: {
    color: "#fff",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#242425",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    color: "#fff",
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Bold",
  },
  closeButton: {
    color: colors.green,
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
  },
  optionsContainer: {
    padding: 20,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  selectedOption: {
    backgroundColor: "rgba(187, 246, 84, 0.1)",
  },
  optionText: {
    color: "#fff",
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Regular",
  },
  selectedOptionText: {
    color: colors.green,
    fontFamily: "Poppins-Medium",
  },
});

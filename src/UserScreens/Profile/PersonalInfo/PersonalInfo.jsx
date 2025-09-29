import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EditIcon from "../../../assets/svgs/EditIcon";
import BackHeader from "../../../components/BackHeader";
import Container from "../../../components/Container";
import CustomButton from "../../../components/CustomButton";
import InputField from "../../../components/InputField";
import { colors } from "../../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { API } from "../../../config/apiClient";
import { END_POINTS } from "../../../config/routes";
import { setUserData } from "../../../redux/reducers/AuthSlice";
import { useNavigation } from "@react-navigation/native";
import { FontSize } from "../../../utils/font";

const PersonalInfoScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { data: userData, token } = useSelector((state) => state.Auth);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    height: "",
    heightInches: "",
    heightUnit: "cm",
    weight: userData?.weight || "",
    weightUnit: "kg",
    date: userData?.dob || "",
  });

  useEffect(() => {
    if (userData?.height?.includes("ft")) {
      const [ft, inch] = userData.height.split(" ");
      setPersonalInfo((prev) => ({
        ...prev,
        height: ft.replace("ft", ""),
        heightInches: inch?.replace("in", "") || "",
        heightUnit: "ft-in",
      }));
    } else if (userData?.height?.includes("cm")) {
      setPersonalInfo((prev) => ({
        ...prev,
        height: userData.height.replace("cm", ""),
        heightUnit: "cm",
      }));
    }
    if (userData?.weight?.includes("lbs")) {
      setPersonalInfo((prev) => ({
        ...prev,
        weight: userData.weight.replace("lbs", ""),
        weightUnit: "lbs",
      }));
    } else if (userData?.weight?.includes("kg")) {
      setPersonalInfo((prev) => ({
        ...prev,
        weight: userData.weight.replace("kg", ""),
        weightUnit: "kg",
      }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setPersonalInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const validateFields = () => {
    // Ensure all fields are filled
    if (
      !personalInfo.firstName ||
      !personalInfo.lastName ||
      (personalInfo.heightUnit === "cm"
        ? !personalInfo.height
        : !personalInfo.height || !personalInfo.heightInches) ||
      !personalInfo.weight ||
      !personalInfo.date
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields are required.",
      });
      return false;
    }

    // Ensure height and weight are valid decimal numbers (allowing decimal values)
    const decimalRegex = /^\d+(\.\d+)?$/; // Regex for validating decimal numbers

    if (!decimalRegex.test(personalInfo.height)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Height should be a valid number (can be a decimal).",
      });
      return false;
    }

    if (!decimalRegex.test(personalInfo.weight)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Weight should be a valid number (can be a decimal).",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    let heightFormatted =
      personalInfo.heightUnit === "cm"
        ? `${personalInfo.height}cm`
        : `${personalInfo.height}ft ${personalInfo.heightInches}in`;
    let weightFormatted = `${personalInfo.weight}${personalInfo.weightUnit}`;

    try {
      const updatedData = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        height: heightFormatted,
        weight: weightFormatted,
        dob: personalInfo.date,
      };
      const response = await API.patch(
        END_POINTS.UPDATE_USER + `${userData?._id}`,
        updatedData,
        token
      );

      if (response?.data?.success) {
        dispatch(setUserData(response?.data?.data));
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Personal information updated successfully.",
        });
        navigation.goBack();
      } else {
        throw new Error("Failed to update information.");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          error ||
          "An error occurred. Please try again.",
      });
    }
  };

  const dummyData = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Height", key: "height", keyboardType: "numeric" },
    { label: "Weight", key: "weight", keyboardType: "numeric" },
    { label: "Date Of Birth", key: "date" },
  ];

  // Custom modal selection component
  const SelectionModal = ({ visible, onClose, options, onSelect, title }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <Container>
      <BackHeader title={"Personal Information"} showBackButton={true} />
      <FlatList
        style={{ marginTop: 30 }}
        data={dummyData}
        renderItem={({ item }) => {
          const isHeight = item.key === "height";
          const isWeight = item.key === "weight";

          return (
            <View style={styles.fieldContainer}>
              <View>
                <InputField
                  type={item.key}
                  label={item.label}
                  value={personalInfo[item.key]}
                  onChangeText={(value) => handleInputChange(item.key, value)}
                  keyboardType={item.keyboardType || "default"} // Use keyboardType if specified
                  compositeFields={
                    personalInfo.heightUnit === "ft-in"
                      ? [
                          {
                            key: "height", // feet
                            value: personalInfo.height,
                            onChangeText: (text) =>
                              handleInputChange("height", text),
                            placeholder: "Feet",
                          },
                          {
                            key: "heightInches", // inches
                            value: personalInfo.heightInches,
                            onChangeText: (text) =>
                              handleInputChange("heightInches", text),
                            placeholder: "Inches",
                          },
                        ]
                      : []
                  }
                  unitType={
                    isHeight ? "height" : isWeight ? "weight" : undefined
                  }
                  unitValue={
                    isHeight
                      ? personalInfo.heightUnit
                      : isWeight
                      ? personalInfo.weightUnit
                      : undefined
                  }
                  onUnitChange={(unit) => {
                    if (isHeight)
                      setPersonalInfo({ ...personalInfo, heightUnit: unit });
                    else if (isWeight)
                      setPersonalInfo({ ...personalInfo, weightUnit: unit });
                  }}
                />

                {/* <TouchableOpacity style={styles.editIcon}>
                <EditIcon />
              </TouchableOpacity> */}
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.scrollContainer}
      />
      <CustomButton title={"Save Changes"} onPress={handleSave} />
    </Container>
  );
};

export default PersonalInfoScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontFamily: "Poppins-Medium",
    fontSize: FontSize.medium,
    color: "#fff",
    marginBottom: 8, // Add spacing between label and input field
  },
  editIcon: {
    position: "absolute",
    tintColor: colors.green,
    right: 15,
    bottom: 30,
    width: 12,
    height: 12,
  },
});

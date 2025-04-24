import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
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
import Loader from "../../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import { FontSize } from "../../../utils/font";

const PersonalInfoScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { userData, token } = useSelector((state) => ({
    userData: state.Auth?.data,
    token: state.Auth?.token,
  }));
  // State for personal information fields
  const [personalInfo, setPersonalInfo] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    height: userData?.height || "",
    weight: userData?.weight || "",
    date: userData?.dob || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    console.log(field, value);

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
      !personalInfo.height ||
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
    setIsLoading(true);

    try {
      const updatedData = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        height: personalInfo.height,
        weight: personalInfo.weight,
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
    } finally {
      setIsLoading(false);
    }
  };

  const dummyData = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Height", key: "height", keyboardType: "numeric" },
    { label: "Weight", key: "weight", keyboardType: "numeric" },
    { label: "Date Of Birth", key: "date" },
  ];

  return (
    <Container>
      <BackHeader title={"Personal Information"} showBackButton={true} />
      <FlatList
        style={{ marginTop: 30 }}
        data={dummyData}
        renderItem={({ item }) => (
          <View style={styles.fieldContainer}>
            <View>
              <InputField
                type={item.key}
                label={item.label}
                value={personalInfo[item.key]}
                onChangeText={(value) => handleInputChange(item.key, value)}
                keyboardType={item.keyboardType || "default"} // Use keyboardType if specified
              />
              {/* <TouchableOpacity style={styles.editIcon}>
                <EditIcon />
              </TouchableOpacity> */}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.scrollContainer}
      />
      <CustomButton title={"Save Changes"} onPress={handleSave} />
      <Loader isLoading={isLoading} message="Processing your request..." />
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

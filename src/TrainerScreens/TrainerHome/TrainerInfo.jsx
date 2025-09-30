import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import Container from "../../components/Container";
import BackHeader from "../../components/BackHeader";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import { FontSize } from "../../utils/font";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { setUserData } from "../../redux/reducers/AuthSlice";
import { useNavigation } from "@react-navigation/native";

const TrainerInfo = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { data:userData, token } = useSelector((state) => state.Auth);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
  });
  const [email, setEmail] = useState(userData?.email || "");

  const handleInputChange = (field, value) => {
    setPersonalInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const validateFields = () => {
    // Ensure all fields are filled
    if (!personalInfo.firstName || !personalInfo.lastName) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields are required.",
      });
      return false;
    }

    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateFields()) return;

    try {
      const updatedData = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
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
      console.log(error);
    }
  };

  return (
    <Container>
      <BackHeader title={"Personal Information"} showBackButton={true} />
      <ScrollView>
        <View style={styles.fieldContainer}>
          <InputField
            label={"Name"}
            value={personalInfo.firstName} // Display initial value or allow editing
            onChangeText={(text) => handleInputChange("firstName", text)}
          />
        </View>
        <View style={styles.fieldContainer}>
          <InputField label={"Email"} value={email} editable={false} />
        </View>
        <View style={styles.fieldContainer}>
          <InputField
            label={"Professional Title"}
            value={personalInfo.lastName} // Display initial value or allow editing
            onChangeText={(text) => handleInputChange("lastName", text)}
          />
        </View>
      </ScrollView>
      <CustomButton title={"Save Changes"} onPress={handleSaveChanges} />
    </Container>
  );
};

export default TrainerInfo;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  fieldContainer: {
    marginBottom: 12,
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    right: 15,
    bottom: 30,
    width: 12,
    height: 12,
  },
  label: {
    fontFamily: "Poppins-Medium",
    fontSize: FontSize.regular,
    color: "#fff",
    marginBottom: 8, // Add spacing between label and input field
  },
});

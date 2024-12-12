import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Container from "../../../components/Container";
import BackHeader from "../../../components/BackHeader";
import InputField from "../../../components/InputField";
import CustomButton from "../../../components/CustomButton";
import { colors } from "../../../constants/colors";
import icons from "../../../constants/icons";
import EditIcon from "../../../assets/svgs/EditIcon";

const PersonalInfoScreen = () => {
  // State for personal information fields
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    height: "180",
    weight: "75",
    dateOfBirth: "16 Sept 1999",
  });

  const handleInputChange = (field, value) => {
    setPersonalInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Logic to save the personal information, e.g., API call
    console.log("Personal Information Saved:", personalInfo);
  };

  const dummyData = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Height", key: "height", keyboardType: "numeric" },
    { label: "Weight", key: "weight", keyboardType: "numeric" },
    { label: "Date Of Birth", key: "dateOfBirth" },
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
                label={item.label}
                value={personalInfo[item.key]}
                onChangeText={(value) => handleInputChange(item.key, value)}
                keyboardType={item.keyboardType || "default"} // Use keyboardType if specified
              />
              <TouchableOpacity style={styles.editIcon}>
                <EditIcon />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    fontSize: 16,
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

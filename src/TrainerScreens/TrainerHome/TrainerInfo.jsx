import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Container from "../../components/Container";
import BackHeader from "../../components/BackHeader";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../constants/colors";
import icons from "../../constants/icons";
import EditIcon from "../../assets/svgs/EditIcon";

const TrainerInfo = () => {
  // State to hold dynamic values for each input field
  const [firstName, setFirstName] = useState("fname");
  const [lastName, setLastName] = useState("lname");
  const [profession, setProfession] = useState("profession");

  // State to toggle between edit and view mode
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    profession: false,
  });

  // Handler for saving the changes
  const handleSaveChanges = () => {
    // You can implement saving functionality here, like sending the updated values to a backend.
    alert("Changes Saved");
  };

  // Handler for toggling the edit mode
  const handleEdit = (field) => {
    setIsEditing((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };

  return (
    <Container>
      <BackHeader title={"Personal Information"} showBackButton={true} />
      <ScrollView>
        <View style={styles.fieldContainer}>
          <InputField
            label={"First Name"}
            value={isEditing.firstName ? firstName : firstName} // Display initial value or allow editing
            onChangeText={(text) => setFirstName(text)}
            editable={isEditing.firstName}
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => handleEdit("firstName")}
          >
            <EditIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.fieldContainer}>
          <InputField
            label={"Last Name"}
            value={isEditing.lastName ? lastName : lastName} // Display initial value or allow editing
            onChangeText={(text) => setLastName(text)}
            editable={isEditing.lastName}
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => handleEdit("lastName")}
          >
            <EditIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.fieldContainer}>
          <InputField
            label={"Professional Title"}
            value={isEditing.profession ? profession : profession} // Display initial value or allow editing
            onChangeText={(text) => setProfession(text)}
            editable={isEditing.profession}
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => handleEdit("profession")}
          >
            <EditIcon />
          </TouchableOpacity>
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
    fontSize: 16,
    color: "#fff",
    marginBottom: 8, // Add spacing between label and input field
  },
});

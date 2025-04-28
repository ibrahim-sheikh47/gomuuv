// screens/SetGoalScreen.js
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import InputField from "../../components/InputField";
import Container from "../../components/Container";
import Header from "../../components/Header";
import CustomButton from "../../components/CustomButton";
import EditIcon from "../../assets/svgs/EditIcon";
import { colors } from "../../constants/colors";
import { FontSize } from "../../utils/font";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { useSelector } from "react-redux";

const SetWaterGoal = ({ navigation, route }) => {
  const [glassQuantity, setGlassQuantity] = useState("");
  const [volumePerGlass, setVolumePerGlass] = useState(250);

  const { token } = useSelector((state) => ({
    token: state.Auth?.token,
  }));

  const handleSaveGoal = () => {
    if (glassQuantity && volumePerGlass) {
      createGoal();
    }
  };

  const createGoal = async () => {
    try {
      const response = await API.post(
        `${END_POINTS.GOALS}`,
        {
          type: "Drinking",
          targetDistance: {
            value: glassQuantity,
          },
          targetDuration: {
            value: glassQuantity * volumePerGlass,
          },
        },
        token
      );

      if (response?.data?.success) {
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Header title={"Water Tracker"} showBackButton={true} />
      <Text style={styles.headerText}>Set Your Goal</Text>
      <ScrollView style={{ flex: 1 }}>
        {/* Input field for the number of glasses */}
        <View>
          <InputField
            label="Quantity"
            value={glassQuantity}
            onChangeText={setGlassQuantity}
            keyboardType="numeric"
            placeholder="1(Glass)"
          />
          <TouchableOpacity style={styles.editIcon}>
            <EditIcon />
          </TouchableOpacity>
        </View>
        {/* Input field for the volume per glass */}
        <InputField
          label="Volume per Glass (ml)"
          value={volumePerGlass}
          onChangeText={setVolumePerGlass}
          keyboardType="numeric"
          placeholder="250 ml"
        />

        <CustomButton
          title={"Save"}
          onPress={handleSaveGoal}
          style={{ marginTop: 50 }}
        />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#252525",
  },
  headerText: {
    fontSize: FontSize.large,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 30,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
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

export default SetWaterGoal;

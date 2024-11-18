// screens/SetGoalScreen.js
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import InputField from "../../components/InputField";
import Container from "../../components/Container";
import Header from "../../components/Header";
import CustomButton from "../../components/CustomButton";

const SetWaterGoal = ({ navigation, route }) => {
  const [glassQuantity, setGlassQuantity] = useState("");
  const [volumePerGlass, setVolumePerGlass] = useState("");

  const handleSaveGoal = () => {
    if (glassQuantity && volumePerGlass) {
      const totalIntake = glassQuantity * volumePerGlass; // Calculate total intake in ml
      route.params?.setTotalIntakeGoal(totalIntake); // Pass total intake back
      route.params?.setTotalGlasses(glassQuantity); // Pass total glasses back
      navigation.goBack(); // Go back to the previous screen
    }
  };

  return (
    <Container>
      <Header title={"Water Tracker"} showBackButton={true} />
      <Text style={styles.headerText}>Set Your Goal</Text>
      <View style={{ flex: 1 }}>
        {/* Input field for the number of glasses */}
        <InputField
          label="Quantity"
          value={glassQuantity}
          onChangeText={setGlassQuantity}
          keyboardType="numeric"
          placeholder="1(Glass)"
        />

        {/* Input field for the volume per glass */}
        <InputField
          label="Volume per Glass (ml)"
          value={volumePerGlass}
          onChangeText={setVolumePerGlass}
          keyboardType="numeric"
          placeholder="250 ml"
        />
      </View>

      <CustomButton title={"Save"} onPress={handleSaveGoal} />
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
    fontSize: 18,
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
});

export default SetWaterGoal;

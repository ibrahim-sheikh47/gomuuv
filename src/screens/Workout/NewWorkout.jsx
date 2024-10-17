import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../constants/colors";
import Selectable from "../../components/Selectable";
import { Text } from "react-native";
import CustomModal from "../../components/CustomModal";
import icons from "../../constants/icons";

const NewWorkout = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;

  const [workoutName, setWorkoutName] = useState("");
  const [duration, setDuration] = useState("");
  const [speed, setSpeed] = useState("");
  const [incline, setIncline] = useState("");
  const [notes, setNotes] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const handleSave = () => {
    setModalVisible(true); // Show the modal when saving the workout
    // Navigate back and pass data to EquipmentDetails
    setTimeout(() => {
      navigation.navigate("EquipmentDetails", {
        category,
        workoutDetails: {
          workoutName,
          duration,
          speed,
          incline,
          notes,
        },
      });
      setModalVisible(false); // Close the modal after confirming
    }, 2000);
  };

  const mode = ["Manual", "Interval Training", "Fat Burn", "Hill Climb"];
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  return (
    <Container>
      <Header title={category.label} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={{ marginTop: 30 }}>
          <InputField
            label="Workout Name"
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="Enter workout name"
          />
          <Text style={styles.sessionTitle}>Workout Mode</Text>

          <Selectable
            items={mode}
            selectedItem={selectedPeriod}
            setSelectedItem={setSelectedPeriod}
            wrapOnLineChange={true}
          />
          <InputField
            label="Duration"
            value={duration}
            onChangeText={setDuration}
            placeholder="Total Workout Duration (minutes)"
            keyboardType="numeric"
          />
          <InputField
            label="Speed"
            value={speed}
            onChangeText={setSpeed}
            placeholder="Average Speed (km/h or mph)"
            keyboardType="numeric"
          />
          <InputField
            label="Incline"
            value={incline}
            onChangeText={setIncline}
            placeholder="Average Incline (%)"
            keyboardType="numeric"
          />
          <InputField
            label="Additional Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes.."
            multiline={true}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          style={{ flex: 1, backgroundColor: colors.bgColor }}
          textStyle={{ color: "#AFAFAF", fontSize: 16 }}
          title="Cancel"
          onPress={handleSave}
        />
        <CustomButton
          style={{ flex: 1 }}
          textStyle={{ fontSize: 16 }}
          title="Save Workout"
          onPress={handleSave}
        />
      </View>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modalText="Workout Saved!"
        modalIcon={icons.tab2}
      />
    </Container>
  );
};

export default NewWorkout;

const styles = StyleSheet.create({
  formContainer: {
    paddingBottom: 20, // Ensure there's space for scrolling
  },
  sessionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "white",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    gap: 20,
  },
});

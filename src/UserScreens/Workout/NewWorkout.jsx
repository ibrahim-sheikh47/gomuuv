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
import Tab2Icon from "../../assets/svgs/Tab2Icon";
import { FontSize } from "../../utils/font";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

const NewWorkout = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, workout } = route.params;

  const [workoutName, setWorkoutName] = useState(workout?.name || "");
  const [duration, setDuration] = useState(workout?.duration?.value || 0);
  const [speed, setSpeed] = useState(workout?.speed?.value || 0);
  const [incline, setIncline] = useState(workout?.incline || 0);
  const [notes, setNotes] = useState(workout?.notes || "");
  const mode = ["Manual", "Interval Training", "Fat Burn", "Hill Climb"];
  const [selectedPeriod, setSelectedPeriod] = useState(workout?.mode || null);
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const { token } = useSelector((state) => state.Auth);

  const saveEquipmentWorkout = async () => {
    try {
      setModalVisible(true);
      await API.post(
        `${END_POINTS.EQUIPMENTS_WORKOUTS}`,
        {
          name: workoutName,
          type: category.value,
          notes,
          mode: selectedPeriod,
          duration: {
            value: duration,
            unit: "minute",
          },
          speed: {
            value: speed,
            unit: "kph",
          },
          incline,
        },
        token
      );
      navigation.goBack();
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const updateEquipmentWorkout = async (id) => {
    try {
      setModalVisible(true);
      await API.patch(
        `${END_POINTS.EQUIPMENTS_WORKOUTS}/${id}`,
        {
          name: workoutName,
          type: category.label.replace(" ", "_").replace("-", "").toLowerCase(),
          notes,
          mode: selectedPeriod,
          duration: {
            value: duration,
            unit: "minute",
          },
          speed: {
            value: speed,
            unit: "kph",
          },
          incline,
        },
        token
      );
      navigation.goBack();
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const validate = () => {
    if (workoutName.trim().length <= 3) {
      Toast.show({
        text1: "Workout name should be atleast 4 characters long",
        type: "error",
      });
      return false;
    }
    if (selectedPeriod === null) {
      Toast.show({
        text1: "Workout mode should be selected",
        type: "error",
      });
      return false;
    }
    if (!/^\d+$/.test(duration) || Number(duration) === 0) {
      Toast.show({
        text1: "Duration should be a non-zero number",
      });
      return false;
    }
    if (!/^\d+$/.test(speed) || Number(speed) === 0) {
      Toast.show({
        text1: "Speed should be a non-zero number",
        type: "error",
      });
      return false;
    }
    if (!/^\d+$/.test(incline)) {
      Toast.show({
        text1: "Incline should be a number",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (validate()) {
      if (workout) {
        updateEquipmentWorkout(workout?._id);
      } else {
        saveEquipmentWorkout();
      }
    }
  };

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
          textStyle={{ color: "#AFAFAF", fontSize: FontSize.regular }}
          title="Cancel"
          onPress={() => navigation.goBack()}
        />
        <CustomButton
          style={{ flex: 1 }}
          textStyle={{ fontSize: FontSize.regular }}
          title="Save Workout"
          onPress={handleSave}
        />
      </View>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modalText="Workout Saved!"
        modalIcon={<Tab2Icon />}
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
    fontSize: FontSize.regular,
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

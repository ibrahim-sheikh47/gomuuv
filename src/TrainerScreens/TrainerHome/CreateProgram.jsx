import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import Selectable from "../../components/Selectable";
import { colors } from "../../constants/colors";
import CustomModal from "../../components/CustomModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SearchIcon from "../../assets/svgs/SearchIcon";
import { IconButton } from "react-native-paper";
import StrengthIcon from "../../assets/svgs/StrengthIcon";

const CreateProgram = () => {
  const modes = ["Strength", "Cardio", "Hill Climb", "Fat Burn", "Flexibility"];
  const equipment = [
    "Dumbbell",
    "Kettlebell",
    "Barbell",
    "Treadmill",
    "Resistance Bands",
  ];

  const [selectedMode, setSelectedMode] = useState("Strength");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("Beginner");
  const [selectedEquipment, setSelectedEquipment] = useState(modes[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [createdModalVisible, setCreatedModalVisible] = useState(false);

  const [selectedDay, setSelectedDay] = useState(null);
  const [exercises, setExercises] = useState([
    { exercise: "", time: "", reps: "" },
  ]);

  const [savedExercises, setSavedExercises] = useState([]);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const openCreatedModal = () => setCreatedModalVisible(true);
  const closeCreatedModal = () => setCreatedModalVisible(false);

  const addExercise = () => {
    setExercises([...exercises, { exercise: "", time: "", reps: "" }]);
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };
  const handleSave = () => {
    if (selectedDay) {
      setSavedExercises((prev) => [
        ...prev,
        { day: selectedDay, exercises: [...exercises] },
      ]);
      setModalVisible(false);
      setExercises([{ exercise: "", time: "", reps: "" }]); // Reset exercises
      setSelectedDay(null); // Reset selected day
    } else {
      alert("Please select a day before saving!");
    }
  };
  const showStartDatePicker = () => setStartDatePickerVisibility(true);
  const hideStartDatePicker = () => setStartDatePickerVisibility(false);

  const showEndDatePicker = () => setEndDatePickerVisibility(true);
  const hideEndDatePicker = () => setEndDatePickerVisibility(false);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateConfirm = (date) => {
    const today = new Date();
    if (date < today) {
      alert("Start date cannot be earlier than today's date.");
      return;
    }

    setStartDate(date);
    hideStartDatePicker();
  };

  const handleEndDateConfirm = (date) => {
    if (!startDate) {
      alert("Please select the start date first.");
      return;
    }
    if (date <= startDate) {
      alert("End date must be after the start date.");
      return;
    }
    setEndDate(date);
    hideEndDatePicker();
  };
  const [formData, setFormData] = useState({
    title: "",
    selectedMode: "",
    selectedSkillLevel: "",
    selectedEquipment: "",
    price: "",
    calories: "",
    targetMuscle: "",
  });
  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  return (
    <Container>
      <Header
        title={"Create New Program"}
        showBackButton={true}
        rightIcon1={<SearchIcon />}
      />
      <ScrollView>
        <InputField
          label={"Title"}
          placeholder={"Add Your Program Title"}
          value={formData.title}
          onChangeText={(text) => handleInputChange("title", text)}
        />

        <Text style={styles.text}>Workout Mode</Text>
        <Selectable
          items={modes}
          selectedItem={formData.selectedMode}
          setSelectedItem={(item) => handleInputChange("selectedMode", item)}
          wrapOnLineChange={true}
        />

        <View style={styles.planDurationContainer}>
          <Text style={styles.text}>Plan Duration</Text>
        </View>

        <View style={{ flex: 1 }}>
          <InputField
            placeholder={"Select Start Date"}
            value={startDate ? startDate.toLocaleDateString() : ""}
          />
          <TouchableOpacity>
            <IconButton
              icon="calendar" // Calendar icon from MaterialCommunityIcons
              size={24}
              iconColor={colors.green}
              onPress={showStartDatePicker}
              style={styles.calendarIcon}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
          />
        </View>
        <View style={{ flex: 1 }}>
          <InputField
            placeholder={"Select End Date"}
            value={endDate ? endDate.toLocaleDateString() : ""}
          />
          <TouchableOpacity onPress={showEndDatePicker}>
            <IconButton
              icon="calendar" // Calendar icon from MaterialCommunityIcons
              size={24}
              iconColor={colors.green}
              onPress={showEndDatePicker}
              style={styles.calendarIcon}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />
        </View>
        <Text style={styles.text}>Skill Level</Text>
        <Selectable
          items={["Beginner", "Intermediate", "Advance"]}
          selectedItem={formData.selectedSkillLevel}
          setSelectedItem={(item) =>
            handleInputChange("selectedSkillLevel", item)
          }
          wrapOnLineChange={true}
        />
        <InputField
          label={"Price $"}
          value={formData.price}
          onChangeText={(text) => handleInputChange("price", text)}
        />

        <View style={styles.addExerciseContainer}>
          <Text style={styles.text}>Add Exercise</Text>
          <TouchableOpacity style={styles.addButton} onPress={openModal}>
            <Text style={styles.addButtonText}>Add + </Text>
          </TouchableOpacity>
        </View>
        {savedExercises.map((entry, index) => (
          <View key={index} style={styles.savedExerciseContainer}>
            <Text style={styles.savedDayText}>{entry.day}</Text>
            {entry.exercises.map((exercise, idx) => (
              <View key={idx} style={styles.exerciseDisplay}>
                <Text style={styles.exerciseText}>
                  {exercise.exercise} x {exercise.reps} Reps ({exercise.time}{" "}
                  mins)
                </Text>
              </View>
            ))}
          </View>
        ))}
        <CustomModal
          visible={modalVisible}
          onClose={closeModal}
          width={"90%"}
          height={"80%"}
        >
          <ScrollView>
            <Text style={styles.modalText}>Select Day</Text>
            <View style={styles.dayContainer}>
              {["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"].map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDay === day && styles.selectedDayButton,
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={styles.dayText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {exercises.map((exercise, index) => (
              <View key={index}>
                <View style={styles.exerciseView}>
                  <View style={{ flex: 1 }}>
                    <InputField
                      label={"Exercise"}
                      value={exercise.exercise}
                      onChangeText={(text) =>
                        updateExercise(index, "exercise", text)
                      }
                    />
                  </View>
                  <InputField
                    label={"Time"}
                    value={exercise.time}
                    onChangeText={(text) => updateExercise(index, "time", text)}
                  />
                  <InputField
                    label={"Reps"}
                    value={exercise.reps}
                    onChangeText={(text) => updateExercise(index, "reps", text)}
                  />
                </View>

                <TouchableOpacity style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>Upload Media</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addMoreButton}
              onPress={addExercise}
            >
              <Text style={styles.addMoreButtonText}>Add More</Text>
            </TouchableOpacity>
          </ScrollView>

          <CustomButton
            title={"Save"}
            onPress={handleSave}
            style={{ marginTop: 30, width: 200, marginHorizontal: "auto" }}
          />
        </CustomModal>

        <InputField
          label={"Calories"}
          value={formData.calories}
          onChangeText={(text) => handleInputChange("calories", text)}
        />
        <InputField
          label={"Calories"}
          value={formData.calories}
          onChangeText={(text) => handleInputChange("targetMuscle", text)}
        />
        <InputField label={"Target Muscle"} value={formData.targetMuscle} />

        <Text style={styles.text}>Select Main Equipment</Text>
        <Selectable
          items={equipment}
          selectedItem={selectedEquipment}
          setSelectedItem={setSelectedEquipment}
          wrapOnLineChange={true}
        />
      </ScrollView>
      <CustomButton
        title={"Create"}
        style={{ marginTop: 20 }}
        onPress={openCreatedModal}
      />
      <CustomModal
        visible={createdModalVisible}
        onClose={closeCreatedModal}
        modalText={"Program Created !"}
        modalIcon={<StrengthIcon width={50} height={50} />}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    fontFamily: "Poppins-Medium",
    width: 200,
  },
  planDurationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendarIcon: {
    position: "absolute",
    right: 5,
    bottom: 8,
  },
  addExerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: colors.bgColor,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 10,
  },
  addButtonText: {
    color: colors.green,
    fontSize: 14,
  },
  modalText: {
    color: "#f8f8f8",
    fontSize: 18,
    marginBottom: 10,
  },
  dayContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayButton: {
    backgroundColor: colors.bgColor,
    borderColor: colors.bgColor,
    borderWidth: 1,
    padding: 8,
    margin: 5,
    borderRadius: 5,
  },
  selectedDayButton: {
    borderColor: colors.green,
  },
  dayText: {
    color: "white",
  },
  exerciseView: {
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: colors.bgColor,
    padding: 16,
    borderRadius: 10,
    marginTop: 5,
  },
  uploadButtonText: {
    color: "white",
    textAlign: "center",
  },
  addMoreButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.bgColor,
    borderRadius: 5,
  },
  addMoreButtonText: {
    color: colors.green,
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    textAlign: "center",
  },
  savedExerciseContainer: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
  },
  savedDayText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    marginBottom: 5,
    width: 50,
  },
  exerciseDisplay: {
    borderRadius: 5,
  },
  exerciseText: {
    fontSize: 14,
    fontFamily: "Poppins-medium",
  },
});

export default CreateProgram;

import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Platform,
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
import { FontSize } from "../../utils/font";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

const CreateProgram = () => {
  const modes = ["Strength", "Cardio", "Hill Climb", "Fat Burn", "Flexibility"];
  const equipment = [
    "Dumbbell",
    "Bench",
    "Pull Up Bar",
    "Barbell",
    "Treadmill",
    "Jump Rope",
  ];

  const [selectedMode, setSelectedMode] = useState("Strength");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("Beginner");
  const [selectedEquipment, setSelectedEquipment] = useState(modes[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [createdModalVisible, setCreatedModalVisible] = useState(false);
  const [titleImage, setTitleImage] = useState(null);
  const [exerciseMedia, setExerciseMedia] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(null);

  const [selectedDay, setSelectedDay] = useState(null);
  const [exercises, setExercises] = useState([
    { exercise: "", time: "", reps: "", media: null },
  ]);

  const [savedExercises, setSavedExercises] = useState([]);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const openCreatedModal = () => setCreatedModalVisible(true);
  const closeCreatedModal = () => {
    setCreatedModalVisible(false);
    // Reset form after successful creation
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      selectedMode: "Strength",
      selectedSkillLevel: "Beginner",
      selectedEquipment: equipment[0],
      price: "",
      calories: "",
      targetMuscle: "",
    });
    setStartDate(null);
    setEndDate(null);
    setSavedExercises([]);
    setTitleImage(null);
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      { exercise: "", time: "", reps: "", media: null },
    ]);
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
      setExercises([{ exercise: "", time: "", reps: "", media: null }]); // Reset exercises
      setSelectedDay(null); // Reset selected day
    } else {
      Alert.alert("Error", "Please select a day before saving!");
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
      Alert.alert("Error", "Start date cannot be earlier than today's date.");
      return;
    }

    setStartDate(date);
    hideStartDatePicker();
  };

  const handleEndDateConfirm = (date) => {
    if (!startDate) {
      Alert.alert("Error", "Please select the start date first.");
      return;
    }
    if (date <= startDate) {
      Alert.alert("Error", "End date must be after the start date.");
      return;
    }
    setEndDate(date);
    hideEndDatePicker();
  };

  const [formData, setFormData] = useState({
    title: "",
    selectedMode: "Strength",
    selectedSkillLevel: "Beginner",
    selectedEquipment: equipment[0],
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

  const pickTitleImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permission to upload images"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setTitleImage(result.assets[0].uri);
    }
  };

  const pickExerciseMedia = async (index) => {
    setCurrentExerciseIndex(index);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permission to upload images"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow both images and videos
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedExercises = [...exercises];
      updatedExercises[index].media = result.assets[0].uri;
      setExercises(updatedExercises);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter a program title");
      return false;
    }

    if (!startDate || !endDate) {
      Alert.alert("Error", "Please select both start and end dates");
      return false;
    }

    if (!formData.price.trim()) {
      Alert.alert("Error", "Please enter a price");
      return false;
    }

    if (savedExercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise");
      return false;
    }

    if (!formData.calories.trim()) {
      Alert.alert("Error", "Please enter calories");
      return false;
    }

    if (!formData.targetMuscle.trim()) {
      Alert.alert("Error", "Please enter target muscle");
      return false;
    }

    if (!titleImage) {
      Alert.alert("Error", "Please upload a title image");
      return false;
    }

    return true;
  };

  const handleCreateProgram = () => {
    if (validateForm()) {
      // Here you would typically send the data to your API
      console.log("Creating program with data:", {
        ...formData,
        startDate,
        endDate,
        exercises: savedExercises,
        titleImage,
      });

      openCreatedModal();
    }
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day} ${getMonthName(date.getMonth())} ${year}`;
      };

      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return "";
  };

  const getMonthName = (monthIndex) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  };

  return (
    <Container>
      <Header title={"Create New Program"} showBackButton={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
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
            editable={false}
          />
          <TouchableOpacity>
            <IconButton
              icon="calendar"
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
            editable={false}
          />
          <TouchableOpacity onPress={showEndDatePicker}>
            <IconButton
              icon="calendar"
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
          keyboardType="numeric"
        />

        <View style={styles.addExerciseContainer}>
          <Text style={styles.text}>Add Exercise</Text>
          <TouchableOpacity style={styles.addButton} onPress={openModal}>
            <Text style={styles.addButtonText}>Add + </Text>
          </TouchableOpacity>
        </View>

        {savedExercises.length > 0 ? (
          savedExercises.map((entry, index) => (
            <View key={index} style={styles.savedExerciseContainer}>
              <Text style={styles.savedDayText}>{entry.day}</Text>
              <View style={styles.exercisesWrapper}>
                {entry.exercises.map((exercise, idx) => (
                  <View key={idx} style={styles.exerciseDisplay}>
                    <Text style={styles.exerciseText}>
                      {exercise.exercise} x {exercise.reps} Reps (
                      {exercise.time} mins)
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noExercisesContainer}>
            <Text style={styles.noExercisesText}>No exercises added yet</Text>
          </View>
        )}

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
                    keyboardType="numeric"
                  />
                  <InputField
                    label={"Reps"}
                    value={exercise.reps}
                    onChangeText={(text) => updateExercise(index, "reps", text)}
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => pickExerciseMedia(index)}
                >
                  <MaterialIcons
                    name="file-upload"
                    size={20}
                    color="#fff"
                    style={styles.uploadIcon}
                  />
                  <Text style={styles.uploadButtonText}>
                    {exercise.media ? "Change Media" : "Upload Media"}
                  </Text>
                </TouchableOpacity>

                {exercise.media && (
                  <View style={styles.mediaPreviewContainer}>
                    <Image
                      source={{ uri: exercise.media }}
                      style={styles.mediaPreview}
                      resizeMode="cover"
                    />
                  </View>
                )}
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
            style={{ marginTop: 30, width: 200, alignSelf: "center" }}
          />
        </CustomModal>

        <InputField
          label={"Calories"}
          placeholder={"Enter calories (e.g. 129kcal)"}
          value={formData.calories}
          onChangeText={(text) => handleInputChange("calories", text)}
          keyboardType="numeric"
        />

        <InputField
          label={"Target Muscle"}
          placeholder={"Enter target muscle group"}
          value={formData.targetMuscle}
          onChangeText={(text) => handleInputChange("targetMuscle", text)}
        />

        <Text style={[styles.text, { width: "100%" }]}>
          Select Main Equipment
        </Text>
        <Selectable
          items={equipment}
          selectedItem={formData.selectedEquipment}
          setSelectedItem={(item) =>
            handleInputChange("selectedEquipment", item)
          }
          wrapOnLineChange={true}
        />

        {/* Title Image Section */}
        <Text style={styles.text}>Title Image</Text>
        <TouchableOpacity
          style={styles.titleImageContainer}
          onPress={pickTitleImage}
        >
          {titleImage ? (
            <Image
              source={{ uri: titleImage }}
              style={styles.titleImagePreview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.uploadTitleImageButton}>
              <MaterialIcons
                name="file-upload"
                size={24}
                color={colors.green}
              />
              <Text style={styles.uploadTitleImageText}>Upload Media</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>

      <CustomButton
        title={"Create"}
        style={{ marginTop: 20, marginBottom: 10 }}
        onPress={handleCreateProgram}
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
    fontSize: FontSize.regular,
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
    fontSize: FontSize.medium,
  },
  modalText: {
    color: "#f8f8f8",
    fontSize: FontSize.large,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIcon: {
    marginRight: 8,
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
    fontSize: FontSize.regular,
    textAlign: "center",
  },
  savedExerciseContainer: {
    backgroundColor: colors.bgColor,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
  },
  savedDayText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: FontSize.medium,
    marginBottom: 5,
    width: 50,
    color: "#fff",
  },
  exercisesWrapper: {
    flex: 1,
  },
  exerciseDisplay: {
    borderRadius: 5,
    marginBottom: 3,
  },
  exerciseText: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
    color: "#fff",
  },
  noExercisesContainer: {
    backgroundColor: colors.bgColor,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  noExercisesText: {
    color: "#AFAFAF",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  mediaPreviewContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  mediaPreview: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  titleImageContainer: {
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    height: 150,
    marginTop: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  titleImagePreview: {
    width: "100%",
    height: "100%",
  },
  uploadTitleImageButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadTitleImageText: {
    color: colors.green,
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
    marginTop: 8,
  },
});

export default CreateProgram;

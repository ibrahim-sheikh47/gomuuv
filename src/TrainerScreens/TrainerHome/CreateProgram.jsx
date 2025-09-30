import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  useWindowDimensions,
} from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import Selectable from "../../components/Selectable";
import { colors } from "../../constants/colors";
import CustomModal from "../../components/CustomModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { IconButton } from "react-native-paper";
import StrengthIcon from "../../assets/svgs/StrengthIcon";
import { FontSize } from "../../utils/font";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment/moment";
import Toast from "react-native-toast-message";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const CreateProgram = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const startDatePicker = useRef();
  const endDatePicker = useRef();
  const modes = ["Strength", "Cardio", "Hill Climb", "Fat Burn", "Flexibility"];
  const equipment = [
    "Dumbells",
    "Bench Press",
    "Pull Up Bar",
    "Barbell",
    "Treadmill",
    "Jump Rope",
  ];

  const { data: userData, token } = useSelector((state) => state.Auth);

  const [modalVisible, setModalVisible] = useState(false);
  const [createdModalVisible, setCreatedModalVisible] = useState(false);
  const [titleImage, setTitleImage] = useState(null);

  const [savedExercises, setSavedExercises] = useState([]);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [days, setDays] = useState([]); // Full days array from your schema
  const [savedDays, setSavedDays] = useState([]); // Full days array from your schema
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const openModal = () => {
    if (days.length > 0) {
      setModalVisible(true);
    } else {
      Alert.alert("Kindly select start and end date before adding exercises");
    }
  };
  const closeModal = () => setModalVisible(false);

  const openCreatedModal = () => setCreatedModalVisible(true);
  const closeCreatedModal = () => {
    setCreatedModalVisible(false);
    resetForm();
    navigation.goBack();
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

  const updateExercise = (index, field, value) => {
    const updatedDays = [...days];
    updatedDays[selectedDayIndex].exercises[index].exercise[field] = value;
    setDays(updatedDays);
  };

  const handleSave = () => {
    let errorMessage = "";

    for (let [day, dayIndex] in days.entries) {
      if (day.exercises.length === 0) {
        isValid = false;
        errorMessage = `Day ${dayIndex + 1} has no exercises.`;
        Toast.show({ text1: errorMessage, type: "error" });
        return;
      } else {
        day.exercises.forEach((exercise, exerciseIndex) => {
          // Replace these with your actual required fields
          if (!exercise.name || exercise.name.trim() === "") {
            errorMessage = `Exercise ${exerciseIndex + 1} on Day ${
              dayIndex + 1
            } is missing a name.`;
            Toast.show({ text1: errorMessage, type: "error" });
            return;
          }
          if (!exercise.sets || exercise.sets <= 0) {
            errorMessage = `Exercise ${exerciseIndex + 1} on Day ${
              dayIndex + 1
            } has invalid sets.`;
            Toast.show({ text1: errorMessage, type: "error" });
            return;
          }
          if (!exercise.reps || exercise.reps <= 0) {
            errorMessage = `Exercise ${exerciseIndex + 1} on Day ${
              dayIndex + 1
            } has invalid reps.`;
            Toast.show({ text1: errorMessage, type: "error" });
            return;
          }
        });
      }
    }

    setSavedDays([...days]);
    setDays([]);
    closeModal();
  };

  const showStartDatePicker = () => setStartDatePickerVisibility(true);
  const hideStartDatePicker = () => setStartDatePickerVisibility(false);

  const showEndDatePicker = () => setEndDatePickerVisibility(true);
  const hideEndDatePicker = () => setEndDatePickerVisibility(false);

  useEffect(() => {
    if (startDate && endDate) {
      generateDaysFromRange(startDate, endDate);
    }
  }, [startDate, endDate]);

  const handleStartDateConfirm = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      Alert.alert("Error", "Start date cannot be earlier than today's date.");
      return;
    }

    setStartDate(date.toISOString());
    setEndDate(null); // Reset end date when start date changes
    hideStartDatePicker();
  };

  const handleEndDateConfirm = (date) => {
    if (!startDate) {
      Alert.alert("Error", "Please select the start date first.");
      return;
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(0, 0, 0, 0);

    if (end <= start) {
      Alert.alert("Error", "End date must be after the start date.");
      return;
    }

    setEndDate(date.toISOString());
    hideEndDatePicker();
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    selectedMode: "Strength",
    selectedSkillLevel: "Beginner",
    selectedEquipment: equipment[0],
    time: "",
    price: "",
    calories: "",
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
      quality: 0.5,
    });

    if (!result.canceled) {
      setTitleImage(result.assets[0]);
    }
  };

  const pickExerciseMedia = async (index) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permission to upload images"
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false,
        videoQuality: 3,
      });

      if (!result.canceled) {
        let tempDays = [...days];
        tempDays[selectedDayIndex].exercises[index].exercise.media =
          result.assets[0];
        setDays([...tempDays]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter a program title");
      return false;
    }

    if (!formData.description.trim()) {
      Alert.alert("Error", "Please enter a program description");
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

    if (savedDays.length === 0) {
      Alert.alert("Error", "Please add at least one day");
      return false;
    }

    if (!formData.calories.trim()) {
      Alert.alert("Error", "Please enter calories");
      return false;
    }

    if (!formData.time.trim()) {
      Alert.alert("Error", "Please enter target muscle");
      return false;
    }

    if (!titleImage) {
      Alert.alert("Error", "Please upload a title image");
      return false;
    }

    return true;
  };

  function calculateDuration(startDate, endDate) {
    const ms = new Date(endDate) - new Date(startDate); // difference in milliseconds

    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay; // Approximate

    let value, unit;

    if (ms < oneHour) {
      value = Math.round(ms / oneMinute);
      unit = "minute";
    } else if (ms < oneDay) {
      value = Math.round(ms / oneHour);
      unit = "hour";
    } else if (ms < oneWeek) {
      value = Math.round(ms / oneDay);
      unit = "day";
    } else if (ms < oneMonth) {
      value = Math.round(ms / oneWeek);
      unit = "week";
    } else {
      value = Math.round(ms / oneMonth);
      unit = "month";
    }

    return { value, unit };
  }

  const getCleanUri = (uri) => {
    return Platform.OS === "android" ? uri : uri.replace("file://", "");
  };

  const uploadAttachment = (file) => {
    return new Promise(async (resolve, reject) => {
      const formData = new FormData();

      formData.append("media", {
        uri: getCleanUri(file.uri),
        name: file.fileName,
        type: file.mimeType,
      });

      try {
        const response = await API.post(
          END_POINTS.ATTACHMENT,
          formData,
          token,
          true
        );

        if (response?.data?.success) {
          resolve(response.data.url);
        } else {
          reject(response.data?.message);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleCreateProgram = async () => {
    if (validateForm()) {
      try {
        const programImage = await uploadAttachment(titleImage);
        if (!programImage) {
          Toast.show({ text1: "Failed to create program" });
          return;
        }

        const body = {
          creator: userData?._id,
          description: formData.description,
          image: programImage,
          name: formData.title,
          duration: calculateDuration(startDate, endDate),
          level: formData.selectedSkillLevel.toLowerCase(),
          calories: formData.calories,
          equipments: [
            formData.selectedEquipment.toLowerCase().replaceAll(" ", "_"),
          ],
          timePerWorkout: formData.time,
          workoutTime: parseInt(formData.time),
          price: formData.price,
        };

        let daysToUpload = [];
        for (let day of savedDays) {
          let tempDay = { ...day };
          tempDay.exercises = [];
          for (let exercise of day.exercises) {
            let tempExercise = { ...exercise.exercise };
            let videoUrl;
            if (exercise.media) {
              videoUrl = await uploadAttachment(exercise.media);
            }
            tempExercise.videoUrl = videoUrl;
            delete tempExercise.media;

            const res = await API.post(
              END_POINTS.EXERCISE,
              tempExercise,
              token
            );

            if (res.data.success) {
              tempDay.exercises.push({
                exercise: res.data.data._id,
                isCompleted: false,
              });
            }
          }
          daysToUpload.push(tempDay);
        }
        body.days = daysToUpload;

        const res = await API.post(END_POINTS.WORKOUTS, body, token);
        if (res.data.success) {
          openCreatedModal();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("not validated");
    }
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

  const generateDaysFromRange = (startDate, endDate) => {
    const result = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);

    while (current <= end) {
      const formattedDate = moment(current).format("DD/MM/yyyy");
      const weekDay = moment(current).format("dddd");
      const shortName = moment(current).format("ddd");

      result.push({
        name: `Day ${result.length + 1}`,
        shortName,
        date: formattedDate,
        weekDay,
        activities: [],
        exercises: [
          {
            exercise: {
              name: "",
              description: "",
              sets: "",
              reps: "",
              restTime: "",
              media: null,
            },
            isCompleted: false,
          },
        ],
        startWithWarmup: false,
        warmupExercises: [],
        stretchAfterWorkout: false,
        stretchExercises: [],
        isDayCompleted: false,
      });

      current.setDate(current.getDate() + 1);
    }

    setDays(result);
  };

  const addExerciseToDay = () => {
    setDays((prev) => {
      const updated = [...prev];
      updated[selectedDayIndex].exercises.push({
        exercise: {
          name: "",
          description: "",
          sets: "",
          reps: "",
          restTime: "",
          media: null,
        },
        isCompleted: false,
      });
      return updated;
    });
  };

  const removeExerciseFromDay = (exerciseIndex) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[selectedDayIndex].exercises.splice(exerciseIndex, 1);
      return updated;
    });
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

        <InputField
          isRichText
          label={"Description"}
          placeholder={"Add Your Program Description"}
          value={formData.description}
          onChangeText={(text) => handleInputChange("description", text)}
        />

        {/* <Text style={styles.text}>Workout Mode</Text>
        <Selectable
          items={modes}
          selectedItem={formData.selectedMode}
          setSelectedItem={(item) => handleInputChange("selectedMode", item)}
          wrapOnLineChange={true}
        /> */}

        <View style={styles.planDurationContainer}>
          <Text style={styles.text}>Plan Duration</Text>
        </View>

        <View style={{ flex: 1 }}>
          <InputField
            key={"startDate"}
            placeholder={"Select Start Date"}
            value={startDate ? moment(startDate).format("DD/MM/yyyy") : ""}
            onChangeText={null}
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
            ref={startDatePicker}
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
          />
        </View>
        <View style={{ flex: 1 }}>
          <InputField
            key={"endDate"}
            placeholder={"Select End Date"}
            value={endDate ? moment(endDate).format("DD/MM/yyyy") : ""}
            onChangeText={null}
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
            ref={endDatePicker}
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />
        </View>
        <Text style={styles.text}>Skill Level</Text>
        <Selectable
          items={["Beginner", "Intermediate", "Expert", "Pro"]}
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

        {savedDays.length > 0 ? (
          savedDays.map((day, index) => (
            <View key={index} style={styles.savedExerciseContainer}>
              <Text style={styles.savedDayText}>{day.name}</Text>
              <View style={styles.exercisesWrapper}>
                {day.exercises.map((exercise, idx) => (
                  <View key={idx} style={styles.exerciseDisplay}>
                    <Text style={styles.exerciseText}>
                      {exercise.exercise.name} x {exercise.exercise.reps} Reps (
                      {exercise.exercise.restTime} mins)
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
          <ScrollView
            contentContainerStyle={{
              width: width * 0.88,
              alignItems: "center", // Center children horizontally
              paddingBottom: 20,
            }}
          >
            <View style={{ width: "90%" }}>
              <Text style={styles.modalText}>Select Day</Text>
              <View style={styles.dayContainer}>
                {days.map((day, index) => (
                  <TouchableOpacity
                    key={`${index}`}
                    style={[
                      styles.dayButton,
                      selectedDayIndex === index && styles.selectedDayButton,
                    ]}
                    onPress={() => setSelectedDayIndex(index)}
                  >
                    <Text style={styles.dayText}>{day.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {(days[selectedDayIndex]?.exercises || []).map(
                (exercise, index) => (
                  <View key={index}>
                    <View style={styles.exerciseView}>
                      <View style={{ flex: 1 }}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={{
                              flex: 1,
                              fontSize: FontSize.large,
                              fontFamily: "Poppins-Bold",
                              color: "#fff",
                              marginVertical: 5,
                            }}
                          >
                            Exercise {index + 1}
                          </Text>

                          {index > 0 && (
                            <TouchableOpacity
                              onPress={() => {
                                let tempDays = [...days];
                                tempDays[selectedDayIndex].exercises = days[
                                  selectedDayIndex
                                ]?.exercises.filter((e, ind) => index !== ind);
                                setDays([...tempDays]);
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: FontSize.medium,
                                  fontFamily: "Poppins-Medium",
                                  color: "red",
                                  marginBottom: 5,
                                }}
                              >
                                Remove
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        <InputField
                          label={"Name"}
                          value={exercise.exercise.name}
                          onChangeText={(text) =>
                            updateExercise(index, "name", text)
                          }
                        />
                      </View>
                      <InputField
                        label={"Sets"}
                        value={exercise.exercise.sets}
                        onChangeText={(text) =>
                          updateExercise(index, "sets", text)
                        }
                        keyboardType="numeric"
                      />
                      <InputField
                        label={"Reps"}
                        value={exercise.exercise.reps}
                        onChangeText={(text) =>
                          updateExercise(index, "reps", text)
                        }
                        keyboardType="numeric"
                      />
                      <InputField
                        label={"Rest Time (mins)"}
                        value={exercise.exercise.restTime}
                        onChangeText={(text) =>
                          updateExercise(index, "restTime", text)
                        }
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
                        {exercise.exercise.media
                          ? exercise.exercise.media.fileName
                          : "Upload Media"}
                      </Text>
                    </TouchableOpacity>

                    {/* {exercise.media && (
                    <View style={styles.mediaPreviewContainer}>
                      <Image
                        source={{ uri: exercise.media }}
                        style={styles.mediaPreview}
                        resizeMode="cover"
                      />
                    </View>
                  )} */}
                  </View>
                )
              )}

              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={addExerciseToDay}
              >
                <Text style={styles.addMoreButtonText}>Add More</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <CustomButton
            title={"Save"}
            onPress={handleSave}
            style={{ marginTop: 30, width: 200, alignSelf: "center" }}
          />
        </CustomModal>

        <InputField
          label={"Workout Time"}
          placeholder={"Enter time (mins)"}
          value={formData.time}
          onChangeText={(text) => handleInputChange("time", text)}
          keyboardType="numeric"
        />

        <InputField
          label={"Calories"}
          placeholder={"Enter calories (e.g. 129kcal)"}
          value={formData.calories}
          onChangeText={(text) => handleInputChange("calories", text)}
          keyboardType="numeric"
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
              source={{ uri: titleImage.uri }}
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

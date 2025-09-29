import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { colors } from "../../constants/colors";
import images from "../../constants/images";
import { FontSize } from "../../utils/font";
import { duration } from "moment";

const StartWorkout = () => {
  const route = useRoute();
  const {
    level,
    calories,
    title,
    time,
    workoutTime,
    exercises,
    image,
    workoutSessionId,
    isChallenge,
  } = route.params;
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const [isRunning, setIsRunning] = useState(true);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const { token } = useSelector((state) => state.Auth);

  const [secondsRemaining, setSecondsRemaining] = useState(time);
  const secondsRemainingValue = useRef(time);
  const movingNext = useRef();

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getExerciseParam = (e) => {
    return e.exercise ? e.exercise : e;
  };

  useEffect(() => {
    return () => {
      if (!movingNext.current) {
        updateDayStats(
          false,
          getExerciseParam(exercises[currentExerciseIndex])?._id
        );
      }
    };
  }, []);

  const updateDayStats = async (isDayComplete = false, exercise = null) => {
    try {
      toggleTimer();
      const payload = {
        duration: time - secondsRemainingValue.current,
        exercise,
        isCompleted: isDayComplete,
      };

      const res = await API.patch(
        `${
          isChallenge
            ? END_POINTS.UPDATE_DAY_STATS
            : END_POINTS.WORKOUTS_UPDATE_DAY_STATS
        }/${workoutSessionId}`,
        payload,
        token
      );
      if (res.data.success) {
        const nextIndex = currentExerciseIndex + 1;

        // If nextIndex is still within the exercises list, just move forward
        if (nextIndex < exercises.length) {
          setCurrentExerciseIndex(nextIndex);
        } else {
          // Last exercise completed → navigate
          movingNext.current = true;
          navigation.reset({
            routes: [
              {
                name: "TabNavigator",
                params: {
                  screen: "Challenges",
                },
              },
              {
                name: "WorkoutCompleted",
                params: {
                  duration: time - secondsRemainingValue.current,
                  image,
                  title,
                  level,
                  calories,
                  lastExerciseId: exercise,
                  workoutSessionId,
                  isChallenge,
                },
              },
            ],
            index: 1,
          });
        }

        route?.params?.refresh();
      }
    } catch (error) {
      console.log("Workout exercises error", error);
    }
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      const interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
        secondsRemainingValue.current = secondsRemaining - 1;
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, secondsRemaining]);

  // Toggle play/pause functionality
  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  // Format seconds into minutes (without seconds)
  const formatMinutes = (seconds) => {
    const mins = Math.floor(seconds / 60); // Get total minutes
    return `${mins} min`; // Return in the format "X min"
  };

  const sessionCompleted = async (exerciseId) => {
    try {
      toggleTimer();
      const payload = {
        lastExerciseId: exerciseId,
        workoutSessionId,
        duration: time - secondsRemainingValue.current,
      };
      const res = await API.post(END_POINTS.SESSION_COMPLETED, payload, token);
      if (res.data.success) {
        const workoutDuration = time - secondsRemainingValue.current; // Total time - remaining time
        const formattedDuration = formatMinutes(workoutDuration); // Format to show only minutes

        // Navigate to the "Workout Completed" screen
        navigation.navigate("WorkoutCompleted", {
          duration: formattedDuration, // Pass the formatted duration
          image: image,
          title: title,
          level: level,
          calories: calories,
          lastExerciseId: getExerciseParam(exercises[currentExerciseIndex])._id,
          workoutSessionId: workoutSessionId,
          isChallenge,
        });
      }
    } catch (error) {
      console.log("Workout session error", error);
    }
  };

  // Handle button press
  const handleButtonPress = () => {
    if (isChallenge) {
      updateDayStats(
        true,
        getExerciseParam(exercises[currentExerciseIndex])._id
      );
    } else {
      if (currentExerciseIndex === exercises.length - 1) {
        sessionCompleted(getExerciseParam(exercises[currentExerciseIndex])._id);
      } else {
        updateDayStats(
          true,
          getExerciseParam(exercises[currentExerciseIndex])._id
        );
      }
    }
  };

  return (
    <Container cusStyles={{ paddingHorizontal: 0 }}>
      <Header title={title} showBackButton={true} />
      <View style={styles.imageContainer}>
        <ImageBackground source={{ uri: image }} style={styles.backgroundImage}>
          <View style={styles.overlayContent}>
            {/* Display the current exercise title at the top */}

            {exercises.length > 0 && (
              <TouchableOpacity
                style={styles.firstExerciseTitle}
                onPress={() => {
                  if (
                    getExerciseParam(exercises[currentExerciseIndex])
                      .videoUrl !== ""
                  ) {
                    navigation.navigate("VideoPlayerScreen", {
                      videoUrl: getExerciseParam(
                        exercises[currentExerciseIndex]
                      ).videoUrl, // Assuming each exercise has a videoUrl property
                    });
                  }
                }}
              >
                {getExerciseParam(exercises[currentExerciseIndex]).videoUrl !==
                  "" && (
                  <Icon name="play-circle" size={24} color={colors.green} />
                )}
                <Text style={[styles.title, { color: colors.green }]}>
                  {getExerciseParam(exercises[currentExerciseIndex]).name}
                </Text>
                <Text style={[styles.title]}>
                  {getExerciseParam(exercises[currentExerciseIndex]).reps}
                </Text>
              </TouchableOpacity>
            )}

            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={styles.timeContainer}>
                <Text style={styles.time}>Time</Text>
                <Text style={styles.time}> {workoutTime} mins</Text>
              </View>

              <Text style={styles.timerText}>
                {formatTime(secondsRemaining)}
              </Text>

              <TouchableOpacity
                onPress={toggleTimer}
                style={styles.playPauseButton}
              >
                <Icon
                  name={isRunning ? "pause" : "play"}
                  size={36}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

            {exercises.length > 1 &&
              currentExerciseIndex !== exercises.length - 1 && (
                <View style={{ marginTop: 20, maxHeight: height * 0.2 }}>
                  <Text style={styles.title}>Next Exercise</Text>
                  {/* Display the remaining exercises below the current one */}
                  <ScrollView>
                    {exercises
                      .slice(currentExerciseIndex + 1)
                      .map((exercise, index) => (
                        <View
                          key={index}
                          style={[
                            styles.exerciseContainer,
                            {
                              ...(index !== 0 && {
                                borderWidth: 0,
                                backgroundColor: colors.bgColorOpaque,
                              }),
                            },
                          ]}
                        >
                          <Image
                            source={images.chestWorkout}
                            style={styles.exerciseImage}
                          />
                          <Text style={styles.exerciseTitle}>
                            {getExerciseParam(exercise).name}
                          </Text>
                          <Text style={styles.exerciseReps}>
                            {getExerciseParam(exercise).reps}
                          </Text>
                        </View>
                      ))}
                  </ScrollView>
                </View>
              )}
          </View>

          {/* Button to mark as complete or end workout */}
          <View style={{ padding: 16, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <CustomButton
              title={
                exercises.length === 1
                  ? isChallenge
                    ? "Complete Day"
                    : "End Workout"
                  : isChallenge
                  ? currentExerciseIndex < exercises.length - 1
                    ? "Mark as Complete"
                    : "Complete Day"
                  : isWorkoutComplete
                  ? "End Workout"
                  : "Mark as Complete"
              }
              onPress={handleButtonPress}
            />
          </View>
        </ImageBackground>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    flex: 1,
    marginTop: 20,
  },
  overlayContent: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  firstExerciseTitle: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  title: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Medium",
    color: "#fff",
  },
  timeContainer: {
    backgroundColor: colors.bgColorOpaque,
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    alignSelf: "center",
  },
  time: {
    fontSize: FontSize.regular,
    color: "#fff",
  },
  timerText: {
    color: "white",
    fontSize: 64,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginTop: 30,
  },
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgColor,
    padding: 5,
    borderRadius: 10,
    borderColor: colors.green,
    borderWidth: 3,
    marginBottom: 10,
  },
  exerciseTitle: {
    fontSize: FontSize.regular,
    color: "#fff",
    flex: 1,
  },
  exerciseReps: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Medium",
    color: colors.green,
    marginRight: 10,
  },
  exerciseImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  playPauseButton: {
    alignSelf: "center",
    height: 90,
    width: 90,
    backgroundColor: colors.green,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartWorkout;

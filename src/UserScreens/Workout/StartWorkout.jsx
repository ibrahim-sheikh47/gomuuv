import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

const StartWorkout = () => {
  const {
    level,
    calories,
    title,
    time,
    exercises,
    image,
    workoutSessionId,
    isChallenge,
  } = useRoute().params;
  const navigation = useNavigation();
  const [secondsRemaining, setSecondsRemaining] = useState(time * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const { token } = useSelector((state) => ({
    token: state.Auth?.token,
  }));

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      const interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
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

  const exerciseCompleted = async (exerciseId) => {
    try {
      const payload = {
        exerciseId,
        workoutSessionId,
      };
      const res = await API.post(END_POINTS.EXERCISE_COMPLETED, payload, token);
      if (res.data.success) {
        console.log("Exercise Completed");
      }
    } catch (error) {
      console.log("Workout exercises error", error);
    }
  };

  const sessionCompleted = async (exerciseId) => {
    try {
      const payload = {
        lastExerciseId: exerciseId,
        workoutSessionId,
      };
      const res = await API.post(END_POINTS.SESSION_COMPLETED, payload, token);
      if (res.data.success) {
        console.log("Session Completed");
      }
    } catch (error) {
      console.log("Workout session error", error);
    }
  };

  // Handle button press
  const handleButtonPress = () => {
    if (isWorkoutComplete) {
      sessionCompleted(exercises[currentExerciseIndex]._id);
      // Calculate the total time spent
      const workoutDuration = time * 60 - secondsRemaining; // Total time - remaining time
      const formattedDuration = formatMinutes(workoutDuration); // Format to show only minutes

      // Navigate to the "Workout Completed" screen
      navigation.navigate("WorkoutCompleted", {
        duration: formattedDuration, // Pass the formatted duration
        image: image,
        title: title,
        level: level,
        calories: calories,
        lastExerciseId: exercises[currentExerciseIndex]._id,
        workoutSessionId: workoutSessionId,
      });
    } else {
      // Check if the current exercise is the last one
      if (currentExerciseIndex < exercises.length - 1) {
        // Move to the next exercise
        setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
        // Mark the current exercise as complete
        exerciseCompleted(exercises[currentExerciseIndex]._id);
      } else {
        // Mark workout as complete if all exercises are done
        setIsWorkoutComplete(true);
        // Mark the last exercise as complete
        exerciseCompleted(exercises[currentExerciseIndex]._id);
      }
    }
  };

  return (
    <Container cusStyles={{ paddingHorizontal: 0 }}>
      <Header title={title} showBackButton={true} />
      <View style={styles.imageContainer}>
        <ImageBackground source={{ uri: image }} style={styles.backgroundImage}>
          <ScrollView contentContainerStyle={styles.overlayContent}>
            {/* Display the current exercise title at the top */}
            {exercises.length > 0 && (
              <View style={styles.firstExerciseTitle}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("VideoPlayerScreen", {
                      videoUrl: exercises[currentExerciseIndex].videoUrl, // Assuming each exercise has a videoUrl property
                    })
                  }
                >
                  <Icon name="play-circle" size={24} color={colors.green} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.green }]}>
                  {exercises[currentExerciseIndex].name}
                </Text>
                <Text style={[styles.title]}>
                  {exercises[currentExerciseIndex].reps}
                </Text>
              </View>
            )}

            <View style={styles.timeContainer}>
              <Text style={styles.time}>Time</Text>
              <Text style={styles.time}> {time} mins</Text>
            </View>

            <Text style={styles.timerText}>{formatTime(secondsRemaining)}</Text>

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

            {!isWorkoutComplete && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.title}>Next Exercise</Text>
                {/* Display the remaining exercises below the current one */}
                {exercises
                  .slice(currentExerciseIndex + 1)
                  .map((exercise, index) => (
                    <View key={index} style={styles.exerciseContainer}>
                      <Image
                        source={images.chestWorkout}
                        style={styles.exerciseImage}
                      />
                      <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                      <Text style={styles.exerciseReps}>{exercise.reps}</Text>
                    </View>
                  ))}
              </View>
            )}
          </ScrollView>

          {/* Button to mark as complete or end workout */}
          <View style={{ padding: 16, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <CustomButton
              title={isWorkoutComplete ? "End Workout" : "Mark as Complete"}
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
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    flex: 1,
    marginTop: 20,
  },
  overlayContent: {
    flexGrow: 1,
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
    backgroundColor: colors.bgColor,
    width: 111,
    height: 87,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    alignSelf: "center",
    marginTop: 100,
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

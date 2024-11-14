import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import { colors } from "../../constants/colors";
import CustomButton from "../../components/CustomButton";
import Icon from "react-native-vector-icons/FontAwesome";

const StartWorkout = () => {
  const { level, calories, title, time, exercises, image } = useRoute().params;
  const navigation = useNavigation();
  const [secondsRemaining, setSecondsRemaining] = useState(time * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);

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

  // Handle button press
  // Format seconds into minutes (without seconds)
  const formatMinutes = (seconds) => {
    const mins = Math.floor(seconds / 60); // Get total minutes
    return `${mins} min`; // Return in the format "X min"
  };

  // Handle button press
  const handleButtonPress = () => {
    if (isWorkoutComplete) {
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
      });
    } else {
      // Mark workout as complete
      setIsWorkoutComplete(true);
    }
  };

  return (
    <Container cusStyles={{ paddingHorizontal: 0 }}>
      <Header title={title} showBackButton={true} />
      <View style={styles.imageContainer}>
        <ImageBackground source={image} style={styles.backgroundImage}>
          <ScrollView contentContainerStyle={styles.overlayContent}>
            {/* Display the first exercise title at the top */}
            {exercises.length > 0 && (
              <View style={styles.firstExerciseTitle}>
                <Text style={[styles.title, { color: colors.green }]}>
                  {exercises[0].title}
                </Text>
                <Text style={[styles.title]}>{exercises[0].reps}</Text>
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

                {/* Display the remaining exercises below the first title */}
                {exercises.slice(1).map((exercise, index) => (
                  <View key={index} style={styles.exerciseContainer}>
                    <Image
                      source={exercise.image}
                      style={styles.exerciseImage}
                    />
                    <Text style={styles.exerciseTitle}>{exercise.title}</Text>
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
    fontSize: 14,
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
    fontSize: 16,
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
    fontSize: 16,
    color: "#fff",
    flex: 1,
  },
  exerciseReps: {
    fontSize: 14,
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

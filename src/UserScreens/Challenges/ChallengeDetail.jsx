import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native"; // Get route params
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import { colors } from "../../constants/colors";
import Selectable from "../../components/Selectable";
import CustomButton from "../../components/CustomButton";
import SearchIcon from "../../assets/svgs/SearchIcon";
import { FontSize } from "../../utils/font";
import images from "../../constants/images";
import { useSelector } from "react-redux";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import CustomModal from "../../components/CustomModal";
import StrengthIcon from "../../assets/svgs/StrengthIcon";
import moment from "moment";

const ChallengeDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { challenge: item } = route.params; // Access challenge data from params
  const { token, userData } = useSelector((state) => ({
    token: state.Auth?.token,
    userData: state.Auth?.data,
  }));
  const [challenge, setChallenge] = useState(item);

  const date = moment().format("DD/MM/yyyy");
  const dayStat = challenge.dayStats.find((d) => d.date === date);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(
    challenge.workout.days[
      dayStat ? challenge.dayStats.indexOf(dayStat) : challenge.dayStats.length
    ].shortName
  );

  const openModal = (title) => {
    setSelectedTitle(title);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTitle("");
    // navigation.goBack();

    navigation.navigate("StartWorkout", {
      title: challenge.workout.name,
      image: challenge.workout?.image,
      time: dayStat
        ? challenge.workout.workoutTime * 60 - dayStat.duration
        : challenge.workout.workoutTime * 60,
      workoutTime: challenge.workout.workoutTime,
      exercises: selectedExercises,
      level: challenge.workout.level,
      calories: challenge.workout.calories,
      workoutSessionId: challenge._id,
      isChallenge: true,
      refreshChallenge: () => {
        fetchChallenge();
      },
    });
  };

  const fetchChallenge = async () => {
    try {
      const res = await API.get(
        `${END_POINTS.CHALLENGES}/${challenge._id}`,
        null,
        token
      );
      if (res.data.success) {
        console.log("challenge fetched");
        setChallenge(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching challenge:", error);
    }
  };

  const handleJoinChallenge = async () => {
    try {
      let payload = { challengeId: challenge._id };
      const res = await API.post(
        `${END_POINTS.CHALLENGES}/enroll-challenge`,
        payload,
        token
      );
      if (res.data.success) {
        openModal(challenge.workout.name);
        fetchChallenge();
      }
    } catch (error) {
      console.error("Error enrolling into challenge:", error);
    }
  };

  const renderDayExercise = (dayExercises) => {
    return dayExercises.map((exercise) => (
      <View key={exercise._id} style={styles.exerciseContainer}>
        <Image source={images.chestWorkout} style={styles.exerciseImage} />
        <Text style={styles.exerciseTitle}>{exercise.name}</Text>
        <Text style={styles.exerciseReps}>{exercise.reps}</Text>
      </View>
    ));
  };
  const getExercisesForDay = (day) => {
    const dayData = challenge.workout.days.find((d) => d.shortName === day);
    return dayData ? dayData.exercises : [];
  };

  const selectedExercises = getExercisesForDay(selectedPeriod).filter(
    (ex) =>
      !challenge.exercisesCompleted.some(
        (exx) => ex._id.toString() === exx.exercise.toString()
      )
  );
  console.log(challenge);
  console.log(selectedExercises);
  return (
    <Container>
      <Header title={"Challenge"} showBackButton={true} />
      <ScrollView>
        {/* <Image source={challenge.image} style={styles.challengeImage} /> */}
        <Image
          source={{ uri: challenge.workout.image }}
          style={styles.challengeImage}
        />
        <Text style={styles.title}>{challenge.workout.name}</Text>
        {/* <Text style={styles.cardSubtitle}>{challenge.workout.description}</Text> */}

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{challenge.workout.description}</Text>

        <View style={styles.infoBox}>
          <View style={styles.row}>
            {["Exercises", "Calories", "Time"].map((label, index) => (
              <View style={styles.detailItem} key={index}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>
                  {label === "Exercises"
                    ? challenge.workout.days.reduce((sum, day) => {
                        return sum + day.exercises.length;
                      }, 0) + " Exercises"
                    : label === "Calories"
                    ? challenge.workout.calories + " kcal"
                    : challenge.workout.timePerWorkout + ""}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.row}>
            {["Equipment", "Level"].map((label, index) => (
              <View style={styles.detailItem} key={index}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>
                  {label === "Equipment"
                    ? challenge.workout.equipments.length > 0
                      ? challenge.workout.equipments
                      : "None"
                    : challenge.workout.level}
                </Text>
              </View>
            ))}
            <View style={styles.detailItem}></View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Exercises</Text>
        <Selectable
          items={Array.from(
            { length: challenge.workout.days.length },
            (_, i) => `Day ${i + 1}`
          )}
          selectedItem={selectedPeriod}
          setSelectedItem={setSelectedPeriod}
        />

        {selectedExercises.length > 0 && renderDayExercise(selectedExercises)}
      </ScrollView>

      {challenge.participants.includes(userData._id) && (
        <CustomButton
          title={
            dayStat?.isDayCompleted ? "Day Completed" : "Continue Challenge"
          }
          disabled={dayStat?.isDayCompleted}
          style={{ marginTop: 20 }}
          onPress={closeModal}
        />
      )}

      {!challenge.participants.includes(userData._id) && (
        <CustomButton
          title={"Join Now"}
          style={{ marginTop: 20 }}
          onPress={handleJoinChallenge}
        />
      )}

      <CustomModal
        visible={modalVisible}
        onClose={closeModal}
        modalIcon={<StrengthIcon />}
        width={240}
      >
        <Text style={styles.modalText}>
          You have successfully Enrolled in {""}
          <Text style={styles.selectedTitle}>{selectedTitle} Challenge</Text>
        </Text>
      </CustomModal>
    </Container>
  );
};

const styles = StyleSheet.create({
  challengeImage: {
    width: "100%",
    height: 175,
    borderRadius: 10,
    marginTop: 20,
  },
  title: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    marginTop: 10,
  },
  cardSubtitle: {
    fontSize: FontSize.medium,
    color: "#F8F8F8",
    marginVertical: 5,
  },
  level: {
    fontSize: FontSize.large,
    color: "#F8F8F8",
    fontFamily: "Poppins-Regular",
  },
  sectionTitle: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: "white",
    marginTop: 20,
  },
  description: {
    color: "#AFAFAF",
    marginTop: 10,
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
  },
  infoBox: {
    backgroundColor: colors.bgColor,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
    color: "#F8F8F8",
  },
  value: {
    marginTop: 5,
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
    color: colors.green,
  },
  exerciseHeading: {
    color: "white",
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Medium",
    marginTop: 10,
  },
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 66,
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  exerciseImage: {
    width: 53,
    height: 53,
    borderRadius: 10,
  },
  exerciseTitle: {
    marginLeft: 16,
    color: "#F8F8F8",
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.regular,
  },
  exerciseReps: {
    marginLeft: "auto",
    color: colors.green,
    fontFamily: "Poppins-Medium",
    fontSize: FontSize.regular,
  },
  modalText: {
    fontSize: FontSize.medium,
    color: "white", // Style for the text that isn't the title
    textAlign: "center",
    marginTop: 20,
  },
  selectedTitle: {
    color: colors.green, // Style for the selected title
    fontFamily: "Poppins-SemiBold",
  },
});

export default ChallengeDetail;

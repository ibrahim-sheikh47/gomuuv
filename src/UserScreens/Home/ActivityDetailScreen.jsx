import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import Selectable from "../../components/Selectable";
import { colors } from "../../constants/colors";
import icons from "../../constants/icons";
import { CustomCard } from "../../components/CustomCard";
import images from "../../constants/images";

const ActivityDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { activityName, distance, time, distanceUnit } = route.params; // Get the additional params

  const duration = ["Today", "Weekly", "Monthly", "Quarterly", "Yearly"];
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  return (
    <Container>
      <Header title={`${activityName}`} showBackButton={true} />

      <View style={{ marginTop: 20, flex: 1 }}>
        <Selectable
          items={duration}
          selectedItem={selectedPeriod}
          setSelectedItem={setSelectedPeriod}
        />

        <View style={styles.content}>
          <Text style={styles.title}>Your Insights</Text>
          <TouchableOpacity style={styles.goalButton}>
            <Image source={icons.goal} style={styles.goalIcon} />
            <Text style={styles.goalText}>Set Goal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          <CustomCard
            label="Distance"
            icon={icons.distance}
            goal={"Goal: 2mi daily"}
            message={`${distance} ${distanceUnit}`}
          />
          <CustomCard
            label="Time"
            icon={icons.time}
            goal={"Goal: 45min"}
            message={time}
          />
        </View>

        <View style={styles.gridContainer}>
          <CustomCard
            label="Calories"
            icon={icons.calories}
            message="65 kcal"
          />
          <CustomCard
            label="Heart Rate"
            icon={icons.heartRate}
            message="96 bpm"
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("FinishActivity", {
            activityName: activityName,
            distance: distance, // Pass distance
            time: time, // Pass time
            distanceUnit: distanceUnit,
          })
        }
      >
        <Image source={images.locationBg} style={{ height: 48, width: 48 }} />
        <Text style={styles.buttonText}>Start {`${activityName}`}</Text>
        <Image
          source={icons.slideArrows}
          style={{ width: 35, height: 12, marginRight: 10 }}
        />
      </TouchableOpacity>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 30,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  goalButton: {
    backgroundColor: colors.green,
    width: 92,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 7,
  },
  goalIcon: {
    width: 17,
    height: 17,
  },
  goalText: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Poppins-SemiBold",
  },
  gridContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 16,
  },
  button: {
    backgroundColor: "#242425",
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "white",
  },
});

export default ActivityDetailScreen;

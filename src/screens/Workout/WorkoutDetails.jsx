import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import icons from "../../constants/icons";
import Container from "../../components/Container";
import { colors } from "../../constants/colors";
import Selectable from "../../components/Selectable";
import CustomButton from "../../components/CustomButton";

const WorkoutDetails = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Access the route to get the passed workout data
  const { workout } = route.params; // Destructure the workout data from route params
  const duration = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const [selectedPeriod, setSelectedPeriod] = useState("Week 1");

  return (
    <Container cusStyles={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ flex: 1, marginBottom: 20 }}>
        <View style={{ position: "relative" }}>
          {/* Back Button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 60, // Adjust according to your image top padding
              left: 20, // Aligning to the left
              zIndex: 1,
            }}
            onPress={() => navigation.goBack()} // Add back navigation logic
          >
            <Image
              source={icons.back}
              style={{ width: 20, height: 20, objectFit: "contain" }}
            />
          </TouchableOpacity>
          <View style={{ position: "relative" }}>
            <Image
              source={workout.image}
              style={{ width: "100%", height: 285 }}
            />
            <Text style={styles.absoluteTitle}>{workout.title}</Text>
          </View>
          <View style={{ padding: 16 }}>
            <View
              style={{
                backgroundColor: colors.bgColor,
                marginTop: 20,
                borderRadius: 15,
                padding: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 15, // Added space between rows
                }}
              >
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Exercises</Text>
                  <Text style={styles.value}>
                    {workout.exercises} Exercises
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Calories</Text>
                  <Text style={styles.value}>{workout.calories} kcal</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Time</Text>
                  <Text style={styles.value}>{workout.time} mins</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Equipment</Text>
                  <Text style={styles.value}>{workout.equipment}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Level</Text>
                  <Text style={styles.value}>{workout.level}</Text>
                </View>
                {/* Empty view for alignment */}
                <View style={styles.detailItem}></View>
              </View>
            </View>

            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-SemiBold",
                color: "white",
                marginTop: 20,
              }}
            >
              Description
            </Text>
            <Text style={[styles.value, { color: "#AFAFAF", marginTop: 10 }]}>
              {workout.description}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-SemiBold",
                color: "white",
                marginTop: 20,
              }}
            >
              Exercises
            </Text>
            <Selectable
              items={duration}
              selectedItem={selectedPeriod}
              setSelectedItem={setSelectedPeriod}
            />
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: 16 }}>
        <CustomButton title={"Start Workout"} />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  detailItem: {
    flex: 1,
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#F8F8F8", // Change to your text color if needed
  },
  value: {
    marginTop: 5, // Add space between label and value
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: colors.green, // Change to your text color if needed
  },
  absoluteTitle: {
    color: colors.green,
    position: "absolute",
    bottom: 10,
    left: 20,
    fontSize: 28,
    fontFamily: "Poppins-Bold",
  },
});

export default WorkoutDetails;

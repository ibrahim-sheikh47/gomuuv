// components/WorkoutCard.js
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import icons from "../constants/icons"; // Adjust the path according to your project structure

const WorkoutCard = ({ title, calories, time, category, image, onPress }) => (
  <TouchableOpacity style={styles.sessionContainer} onPress={onPress}>
    <Image source={image} style={styles.sessionImage} />
    <Text style={styles.sessionTitleText}>{title}</Text>
    <View style={styles.sessionDetailsContainer}>
      <View style={styles.sessionDetail}>
        <Image style={styles.detailIcon} source={icons.calories} />
        <Text style={styles.detailText}>{calories} kcal</Text>
      </View>
      <View style={styles.sessionDetail}>
        <Image style={styles.detailIcon} source={icons.time} />
        <Text style={styles.detailText}>{time} mins</Text>
      </View>
      <View style={styles.sessionDetail}>
        <Image style={styles.detailIcon} source={icons.quadriceps} />
        <Text style={styles.detailText}>{category}</Text>
      </View>
      <Image source={icons.nextBg} style={styles.nextIcon} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  sessionContainer: {
    position: "relative",
    height: 200,
  },
  sessionImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
  },
  sessionTitleText: {
    color: "white",
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    position: "absolute",
    bottom: 60,
    left: 10,
    width: 103,
  },
  sessionDetailsContainer: {
    position: "absolute",
    bottom: 15,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  sessionDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  detailIcon: {
    width: 15,
    height: 15,
  },
  detailText: {
    color: "#F8F8F8",
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    marginTop: 2,
  },
  nextIcon: {
    width: 30,
    height: 30,
  },
});

export default WorkoutCard;

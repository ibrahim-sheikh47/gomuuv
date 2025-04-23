// components/WorkoutCard.js
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CaloriesIcon from "../assets/svgs/CaloriesIcon";
import TimeIcon from "../assets/svgs/TimeIcon";
import StrengthIcon from "../assets/svgs/StrengthIcon";
import { IconButton } from "react-native-paper";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";

const WorkoutCard = ({ title, calories, time, category, image, onPress }) => (
  <TouchableOpacity style={styles.sessionContainer} onPress={onPress}>
    <Image source={{ uri: image }} style={styles.sessionImage} />
    <Text style={styles.sessionTitleText} numberOfLines={2}>
      {title}
    </Text>
    <View style={styles.sessionDetailsContainer}>
      <View style={styles.sessionDetail}>
        <CaloriesIcon width={15} height={15} />
        <Text style={styles.detailText}>{calories}</Text>
      </View>
      <View style={styles.sessionDetail}>
        <TimeIcon />
        <Text style={styles.detailText}>{time} mins</Text>
      </View>
      {/* <View style={styles.sessionDetail}>
        <StrengthIcon />
        <Text style={styles.detailText}>{category}</Text>
      </View> */}
      <IconButton
        icon="chevron-right"
        size={20} // Adjust the size as needed
        color="#aaa" // Adjust the color as needed
        style={styles.nextIcon}
      />
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
    fontSize: FontSize.xxlarge,
    fontFamily: "Poppins-Bold",
    position: "absolute",
    bottom: 60,
    left: 10,
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
    fontSize: FontSize.small,
    marginTop: 2,
    marginRight: 10,
  },
  nextIcon: {
    marginLeft: "auto",
    marginTop: "auto",
    marginBottom: 10,
    backgroundColor: colors.green,
  },
});

export default WorkoutCard;

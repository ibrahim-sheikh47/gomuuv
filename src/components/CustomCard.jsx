import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";
import { ProgressBar } from "./ProgressBar";

export const CustomCard = ({
  label,
  icon: CardIcon,
  goal,
  current,
  target,
  hideGoal,
  showProgress,
  iconImage,
  children,
  message = "",
  onPress,
}) => {
  const [showGoal, setShowGoal] = useState(hideGoal);
  const {height} = useWindowDimensions();

  // useEffect(() => {
  //   // Check if the message does not start with "Please start" to determine if the goal should be shown
  //   setShowGoal(!/^Please start/.test(message));
  // }, [message]);

  return (
    <TouchableOpacity style={[styles.activityCard, {height: height * 0.16}]} onPress={onPress}>
      <View style={styles.activityCardContent}>
        <Text
          style={{
            color: "#fff",
            fontSize: FontSize.small,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          {label}
        </Text>
        {iconImage ? (
          <Image source={iconImage} style={{ width: 20, height: 20 }} />
        ) : CardIcon ? (
          <CardIcon />
        ) : null}
      </View>
      <Text
        style={{
          color: "#F8F8F8",
          textAlign: "center",
          fontSize: FontSize.large,
          fontFamily: "Poppins-Bold",
          marginTop: 10,
          paddingHorizontal: 20,
        }}
      >
        {message}
      </Text>
      <View style={{ flex: 1, paddingHorizontal: 10 }}>{children}</View>

      {target != 0 && showProgress && (
        <View style={{ alignSelf: "center", width: 150, marginBottom: 10 }}>
          <ProgressBar
            progress={(current / target) * 100}
            style={{ height: 15 }}
          />
        </View>
      )}

      {/* Conditionally render goal text based on showGoal state */}
      {showGoal && (
        <View>
          <Text
            style={{
              color: "#F8F8F8",
              fontSize: FontSize.xxsmall,
              paddingHorizontal: 14,
              marginBottom: 10,
              fontFamily: "Poppins-Regular",
            }}
          >
            <Text>{goal}</Text>
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activityCard: {
    flex: 1,
    backgroundColor: colors.bgColor,
    height: 162,
    borderRadius: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  cardSubtitle: {
    color: "#F8F8F8",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  activityCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  cardMessage: {
    color: "#F8F8F8",
    textAlign: "center",
    marginTop: 10,
    fontSize: FontSize.small,
    marginHorizontal: 20,
  },
});

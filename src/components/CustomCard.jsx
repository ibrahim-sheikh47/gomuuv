import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";

export const CustomCard = ({
  label,
  icon: CardIcon,
  goal,
  iconImage,
  children,
  message = "",
  onPress,
}) => {
  const [showGoal, setShowGoal] = useState(false);

  useEffect(() => {
    // Check if the message does not start with "Please start" to determine if the goal should be shown
    setShowGoal(!/^Please start/.test(message));
  }, [message]);

  return (
    <TouchableOpacity style={styles.activityCard} onPress={onPress}>
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
          fontSize:
            message === `Please start ${label} to see data`
              ? FontSize.small
              : FontSize.xxlarge,
          fontFamily: "Poppins-Bold",
          marginTop: 10,
          paddingHorizontal: 20,
        }}
      >
        {message}
      </Text>
      <View style={{ flex: 1, paddingHorizontal: 10 }}>{children}</View>

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

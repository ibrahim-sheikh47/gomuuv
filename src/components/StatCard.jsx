import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";

export const StatCard = ({ label, value, unit }) => (
  <View style={styles.statContainer}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>
      {value} {unit}
    </Text>
  </View>
);

export default StatCard;

const styles = StyleSheet.create({
  statContainer: {
    backgroundColor: "#242425",
    width: "30%",
    height: 69,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  statLabel: {
    color: "#fff",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  statValue: {
    color: colors.green,
    fontSize: FontSize.small,
    fontFamily: "Poppins-SemiBold",
  },
});

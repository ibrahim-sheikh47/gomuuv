import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../constants/colors";

export const StatCard = ({ label, value }) => (
  <View style={styles.statContainer}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
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
  },
  statValue: {
    color: colors.green,
  },
});

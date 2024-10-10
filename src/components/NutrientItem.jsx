import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ProgressBar } from "./ProgressBar";

const calculateProgress = (current, total) => (current / total) * 100;
export const NutrientItem = ({ title, current, total }) => (
  <View style={styles.nutrientItem}>
    <Text style={styles.nutrientHeading}>{title}</Text>
    <ProgressBar progress={calculateProgress(current, total)} />
    <Text style={styles.nutrientText}>{`${current}/${total}g`}</Text>
  </View>
);

export default NutrientItem;

const styles = StyleSheet.create({
  nutrientItem: {
    width: 65,
    gap: 5,
  },
  nutrientText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#A4A4A4",
    marginTop: 4,
  },

  nutrientHeading: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "white",
  },
});

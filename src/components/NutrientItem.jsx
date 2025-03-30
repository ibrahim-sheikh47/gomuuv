import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ProgressBar } from "./ProgressBar";
import { FontSize } from "../utils/font";

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
    fontSize: FontSize.small,
    color: "#A4A4A4",
    marginTop: 4,
  },

  nutrientHeading: {
    fontFamily: "Poppins-Medium",
    fontSize: FontSize.small,
    color: "white",
  },
});

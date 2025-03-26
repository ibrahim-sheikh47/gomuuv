// components/WaterIntake.js

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { ProgressBar } from "./ProgressBar";
import { colors } from "../constants/colors";
import GlassIcon from "../assets/svgs/GlassIcon";
import { FontSize } from "../utils/font";

const WaterIntake = ({ consumedGlasses, totalGlasses, onAddWater }) => {
  const waterProgress = Math.min((consumedGlasses / totalGlasses) * 100, 100);

  return (
    <TouchableOpacity style={styles.waterIntakeContainer} onPress={onAddWater}>
      <View style={styles.waterIntakeHeader}>
        <Text style={styles.waterIntakeText}>Mark Water Intake</Text>
        <GlassIcon />
      </View>
      <Text style={styles.waterConsumptionText}>
        {`${consumedGlasses} of ${totalGlasses} glasses consumed`}
      </Text>
      <ProgressBar style={styles.waterProgressBar} progress={waterProgress} />
      <Text
        style={{ textAlign: "right", color: "#A4A4A4", marginVertical: 10 }}
      >
        1250 ml{" "}
      </Text>
    </TouchableOpacity>
  );
};

export default WaterIntake;

const styles = StyleSheet.create({
  waterIntakeContainer: {
    height: 130,
    backgroundColor: "#252525",
    borderRadius: 15,
    marginTop: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  waterIntakeHeader: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  waterIntakeText: {
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    fontSize: FontSize.small,
  },
  glassIcon: {
    width: 50,
    height: 50,
  },
  waterConsumptionText: {
    fontFamily: "Poppins-SemiBold",
    color: "white",
    fontSize: FontSize.small,
  },
  waterProgressBar: {
    marginTop: 10,
    height: 12,
  },
});

// components/WaterIntake.js

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { ProgressBar } from "./ProgressBar";
import icons from "../constants/icons";
import { colors } from "../constants/colors";

const WaterIntake = ({ consumedGlasses, totalGlasses, onAddWater }) => {
  const waterProgress = (consumedGlasses / totalGlasses) * 100;

  return (
    <TouchableOpacity style={styles.waterIntakeContainer}>
      <View style={styles.waterIntakeHeader}>
        <Text style={styles.waterIntakeText}>Mark Water Intake</Text>
        <Image source={icons.glass} style={styles.glassIcon} />
      </View>
      <Text style={styles.waterConsumptionText}>
        {`${consumedGlasses} of ${totalGlasses} glasses consumed`}
      </Text>
      <ProgressBar style={styles.waterProgressBar} progress={waterProgress} />
    </TouchableOpacity>
  );
};

export default WaterIntake;

const styles = StyleSheet.create({
  waterIntakeContainer: {
    height: 117,
    backgroundColor: "#252525",
    borderRadius: 15,
    marginTop: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  waterIntakeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  waterIntakeText: {
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    fontSize: 12,
  },
  glassIcon: {
    width: 24,
    height: 24,
  },
  waterConsumptionText: {
    fontFamily: "Poppins-SemiBold",
    color: "white",
    fontSize: 12,
    marginTop: 10,
  },
  waterProgressBar: {
    marginTop: 10,
    height: 12,
  },
  addWaterText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: colors.green,
    textAlign: "center",
    marginTop: 10,
  },
});

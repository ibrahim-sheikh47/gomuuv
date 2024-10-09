import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "../constants/colors";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const DailyReport = ({ completionPercentage, reportText }) => {
  return (
    <View style={styles.reportContainer}>
      <View>
        <Text style={styles.reportText}>{reportText}</Text>
        <Text style={styles.reportCompletion}>
          {completionPercentage} % tasks completed
        </Text>
      </View>

      {/* Circular Progress */}
      <AnimatedCircularProgress
        size={90} // Maintain size based on your existing styles
        width={10} // Border width (matching the existing style)
        fill={completionPercentage} // Dynamic percentage fill
        tintColor={colors.green} // Progress color (same as your theme)
        backgroundColor="#454545" // Background color of the circle
        style={styles.reportPercentageContainer}
        rotation={0}
      >
        {() => (
          <Text style={styles.reportPercentage}>{completionPercentage} %</Text>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

const styles = StyleSheet.create({
  reportContainer: {
    height: 134,
    backgroundColor: "#242425",
    borderRadius: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  reportText: {
    color: colors.green,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  reportCompletion: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    width: 105,
  },
  reportPercentageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  reportPercentage: {
    color: colors.green,
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
  },
});

export default DailyReport;

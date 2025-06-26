import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";

export const ProgressBar = ({ progress, style }) => {
  return (
    <>
      <View style={styles.progressBarWrapper}>
        <View style={[styles.progressBarContainer, style]}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  progressBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  progressBarContainer: {
    flexDirection: "row", // Align the progress bar and dot horizontally
    flex: 1, // This ensures the progress bar takes the available space
    height: 6,
    width: 65,
    overflow: 'hidden',
    backgroundColor: "#BDBDBD",
    borderRadius: 10,
    marginRight: 8, // Add space between the bar and the text
    position: "relative", // Position relative for the dot
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.green,
  },
  progressText: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
    color: "white",
  },
});

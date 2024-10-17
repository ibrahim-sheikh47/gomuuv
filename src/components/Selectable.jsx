import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors } from "../constants/colors";

const Selectable = ({
  items, // Renamed prop to make it more general
  selectedItem,
  setSelectedItem,
  style, // Optional prop for additional styles
  wrapOnLineChange = false, // New prop to control wrapping behavior
}) => {
  const content = (
    <View style={styles.timeRow}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.timePeriodButton,
            selectedItem === item ? styles.activeButton : styles.inactiveButton, // Apply active or inactive styles
          ]}
          onPress={() => setSelectedItem(item)} // Update selected item on press
        >
          <Text
            style={[
              styles.timePeriodText,
              selectedItem === item ? styles.activeText : styles.inactiveText, // Apply active or inactive text styles
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {wrapOnLineChange ? (
        content // Render normally if wrapping is enabled
      ) : (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {content}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Added default styles for the container
  },
  timeRow: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line
    marginTop: 10,
    alignItems: "center",
  },
  timePeriodButton: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10, // Added margin to space out buttons
    marginBottom: 10, // Added margin to space out buttons vertically
  },
  activeButton: {
    backgroundColor: colors.green, // Active button background
  },
  inactiveButton: {
    backgroundColor: "#242425", // Inactive button background
  },
  timePeriodText: {
    fontSize: 12, // Set font size for text
    fontFamily: "Poppins-SemiBold",
  },
  activeText: {
    color: "#000", // Active text color
  },
  inactiveText: {
    color: "#fff", // Inactive text color
  },
});

export default Selectable;

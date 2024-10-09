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
}) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timeRow}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.timePeriodButton,
              selectedItem === item
                ? styles.activeButton
                : styles.inactiveButton, // Apply active or inactive styles
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  amountLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    marginBottom: 4,
  },
  walletBalance: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    marginBottom: 20,
    color: "#696969",
  },
  timeRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  timePeriodButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 10, // Added margin to space out buttons
  },
  activeButton: {
    backgroundColor: colors.green, // Active button background
  },
  inactiveButton: {
    backgroundColor: "#242425", // Inactive button background
  },
  timePeriodText: {
    fontSize: 14, // Set font size for text
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

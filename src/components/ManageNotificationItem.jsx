import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Switch } from "react-native-paper";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";

const ManageNotificationItem = ({ label, value, onToggle }) => {
  return (
    <View style={styles.notificationContainer}>
      <Text style={styles.notificationText}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        color={colors.green}
        style={{ transform: [{ scale: 1.1 }] }}
      />
    </View>
  );
};

export default ManageNotificationItem;

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: "#242425",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginVertical: 10, // Add margin for spacing
  },
  notificationText: {
    color: "#AFAFAF",
    fontFamily: "Poppins-Medium",
    fontSize: FontSize.medium,
  },
});

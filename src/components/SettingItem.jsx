import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FontSize } from "../utils/font";

const SettingItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.settingContainer} onPress={onPress}>
    {icon}
    <Text style={styles.settingText}>{text}</Text>
  </TouchableOpacity>
);

export default SettingItem;

const styles = StyleSheet.create({
  settingContainer: {
    backgroundColor: "#242425",
    height: 45,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  settingIcon: {
    width: 24,
    height: 24,
  },
  settingText: {
    marginLeft: 16,
    marginTop: 2,
    color: "#F8F8F8",
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
  },
});

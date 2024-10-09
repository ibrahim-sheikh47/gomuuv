import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const SettingItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.settingContainer} onPress={onPress}>
    <Image source={icon} style={styles.settingIcon} />
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
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
});

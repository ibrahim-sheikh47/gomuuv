import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Expo Icons

const CustomCheckbox = ({
  checked,
  onChange,
  size = 24,
  color = "#007AFF",
}) => {
  return (
    <TouchableOpacity
      onPress={onChange}
      activeOpacity={0.7}
      style={[
        styles.checkbox,
        {
          width: size,
          height: size,
          borderColor: color,
          borderRadius: size / 6,
        },
        checked && { backgroundColor: color },
      ]}
    >
      {checked && <Ionicons name="checkmark" size={size * 0.8} color="#fff" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomCheckbox;

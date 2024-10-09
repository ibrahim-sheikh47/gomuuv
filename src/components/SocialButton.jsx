// Reusable component for social buttons

import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";

export const SocialButton = ({ icon }) => (
  <TouchableOpacity style={styles.socialButton}>
    <Image source={icon} style={styles.socialIcon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  socialButton: {
    backgroundColor: "#191919",
    width: 71,
    height: 52,
    borderColor: "#F8F8F8",
    borderWidth: 0.5,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    width: 26,
    height: 26,
    objectFit: "contain",
  },
});

// Loader.js
import React from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { colors } from "../constants/colors";

const Loader = ({ isLoading, message }) => {
  if (!isLoading) {
    return null; // If not loading, don't show anything
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={80} color={colors.green} />
      <Text style={styles.loaderText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Ensure the background is white
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure the loader is above everything else
  },
  loaderText: {
    marginTop: 20,
    fontSize: 16,
    width: 350,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
});

export default Loader;

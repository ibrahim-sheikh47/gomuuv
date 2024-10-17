import Constants from "expo-constants";
import { Platform, StyleSheet, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";

export default function Container({
  children,
  cusStyles,
  modal = false,
  bgclr = colors.black,
  pd = 18,
}) {
  const height = Constants.statusBarHeight;
  return (
    <>
      <StatusBar style="light" backgroundColor={colors.black} />
      <View
        style={[
          containerStyles.container,
          {
            backgroundColor: bgclr,
            padding: pd,
          },
          modal
            ? { paddingTop: Platform.OS === "ios" ? 10 : height }
            : {
                paddingTop: cusStyles?.padding !== undefined ? 0 : height, // Exclude status bar height if padding is overridden
              },
          cusStyles,
        ]}
      >
        {children}
      </View>
    </>
  );
}

export const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
});

// CustomButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { colors } from "../constants/colors";

const CustomButton = ({
  onPress,
  title,
  style,
  textStyle,
  btnIcon,
  iconStyle,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Image style={iconStyle} source={btnIcon} />
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    marginTop: 2,
  },
});

export default CustomButton;

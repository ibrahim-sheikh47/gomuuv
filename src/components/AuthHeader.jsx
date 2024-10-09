import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import icons from "../constants/icons";

const AuthHeader = ({ header, description, customStyles = {} }) => {
  return (
    <>
      <View style={styles.headerContainer}>
        <Image source={icons.logo} style={styles.logo} />
        <Text style={[styles.headerText, customStyles.headerText]}>
          {header}
        </Text>
      </View>
      <Text style={[styles.descriptionText, customStyles.descriptionText]}>
        {description}
      </Text>
    </>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
  logo: {
    width: 32,
    height: 32,
  },
  headerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#fff",
  },
  descriptionText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginTop: 30,
  },
});

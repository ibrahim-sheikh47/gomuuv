import React from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import images from "../../constants/images";
import icons from "../../constants/icons";
import { colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";

const Splash = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.statusBar} />
      <View style={styles.content}>
        <Image source={images.splashBg} style={styles.image} />

        {/* Overlay View */}
        <View style={styles.overlay} />

        <View style={styles.centeredView}>
          <Image source={icons.logoWtext} style={styles.logo} />
          <Text style={styles.tagline}>
            Your Path to Peak Health & Wellness starts here.
          </Text>
        </View>

        {/* Bottom Container */}
        <View style={styles.bottomContainer}>
          <CustomButton
            title="Join Now As User"
            onPress={() => {
              navigation.navigate("Signup");
            }}
          />
          <CustomButton title="Join Now As Trainer" onPress={() => {}} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              marginTop: 5,
            }}
          >
            <Text style={styles.signInText}>Already a member?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: Constants.statusBarHeight,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the rgba values for color and opacity
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Position it absolutely to center it
    left: 0,
    right: 0,
  },
  logo: {
    marginBottom: 20,
    width: 300,
    height: 42,
  },
  tagline: {
    color: colors.green,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    width: 300,
    fontSize: 17,
    marginBottom: 30,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: colors.green,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 16,
    width: "85%",
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
  },
  signInText: {
    color: "white",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  signInLink: {
    color: colors.green,
    fontFamily: "Poppins-SemiBold",
  },
});

export default Splash;

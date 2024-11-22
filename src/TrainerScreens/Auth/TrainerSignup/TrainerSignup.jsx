import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Container from "../../../components/Container";
import AuthHeader from "../../../components/AuthHeader";
import InputField from "../../../components/InputField";
import { colors } from "../../../constants/colors";
import icons from "../../../constants/icons";
import { SocialButton } from "../../../components/SocialButton";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";

const TrainerSignup = () => {
  const navigation = useNavigation();

  // Single state for all form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field, value) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSignup = () => {
    // Add your signup logic here
    console.log("Name:", form.name);
    console.log("Email:", form.email);
    console.log("Password:", form.password);
    navigation.navigate("TrainerHome");
  };

  return (
    <Container>
      <StatusBar style="light" backgroundColor="#121212" />
      <AuthHeader
        header={"Signup"}
        description={"Heyy! please enter your details to get started."}
      />
      <ScrollView>
        <View style={styles.inputContainer}>
          <InputField
            label="First Name"
            value={form.name}
            onChangeText={(value) => handleInputChange("name", value)}
            placeholder="Enter your name"
          />
          <InputField
            label="Email"
            value={form.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            placeholder="Enter your email"
          />
          <InputField
            label="Password"
            value={form.password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry={true}
            placeholder="Enter password"
          />
          <InputField
            label="Confirm Password"
            value={form.confirmPassword}
            onChangeText={(value) =>
              handleInputChange("confirmPassword", value)
            }
            secureTextEntry={true}
            placeholder="Confirm password"
          />
        </View>

        <CustomButton
          style={{ marginTop: 50 }}
          title="Join now"
          onPress={handleSignup}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine}></View>
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine}></View>
        </View>

        <View style={styles.socialButtonContainer}>
          <SocialButton icon={icons.google} />
          <SocialButton icon={icons.facebook} />
          <SocialButton icon={icons.apple} />
        </View>
        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Already a member?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    gap: 10,
    marginTop: 40,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  dividerLine: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#f8f8f8",
  },
  dividerText: {
    marginHorizontal: 20,
    color: "#fff",
  },
  socialButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    marginTop: 40,
  },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    gap: 3,
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

export default TrainerSignup;

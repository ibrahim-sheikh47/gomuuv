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
import { Picker } from "@react-native-picker/picker"; // Import Picker

const Signup = () => {
  const navigation = useNavigation();

  // Single state for all form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    height: "",
    heightUnit: "cm", // Default unit
    weight: "",
    age: "",
    weightUnit: "kg", // Default unit
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
    console.log("Name:", form.firstName, form.lastName);
    console.log("Height:", form.height, form.heightUnit);
    console.log("Weight:", form.weight, form.weightUnit);
    console.log("Email:", form.email);
    console.log("Password:", form.password);
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
            value={form.firstName}
            onChangeText={(value) => handleInputChange("firstName", value)}
            placeholder="Enter your first name"
          />
          <InputField
            label="Last Name"
            value={form.lastName}
            onChangeText={(value) => handleInputChange("lastName", value)}
            placeholder="Enter your last name"
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField
                label="Height"
                value={form.height}
                onChangeText={(value) => handleInputChange("height", value)}
                placeholder="Enter your height"
                keyboardType="numeric" // Ensure only numbers are entered
              />
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.heightUnit}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  handleInputChange("heightUnit", itemValue)
                }
              >
                <Picker.Item label="cm" value="cm" />
                <Picker.Item label="ft" value="ft" />
              </Picker>
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField
                label="Weight"
                value={form.weight}
                onChangeText={(value) => handleInputChange("weight", value)}
                placeholder="Enter your weight"
                keyboardType="numeric" // Ensure only numbers are entered
              />
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.weightUnit}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  handleInputChange("weightUnit", itemValue)
                }
              >
                <Picker.Item label="kg" value="kg" />
                <Picker.Item label="lb" value="lb" />
              </Picker>
            </View>
          </View>

          <InputField
            label="Age"
            value={form.age}
            onChangeText={(value) => handleInputChange("age", value)}
            placeholder="Enter your age"
            keyboardType="numeric" // Ensure only numbers are entered
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  pickerContainer: {
    height: 50,
    width: 100,
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: "#1A1919", // Match the input field background
  },
  picker: {
    height: "100%",
    width: "100%",
    color: "#fff",
  },
  loginButton: {
    backgroundColor: colors.green,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 50,
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

export default Signup;

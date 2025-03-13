import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import AppleLogo from "../../../assets/svgs/AppleLogo";
import FacebookLogo from "../../../assets/svgs/FacebookLogo";
import GoogleLogo from "../../../assets/svgs/GoogleLogo";
import AuthHeader from "../../../components/AuthHeader";
import Container from "../../../components/Container";
import CustomButton from "../../../components/CustomButton";
import InputField from "../../../components/InputField";
import Loader from "../../../components/Loader";
import { SocialButton } from "../../../components/SocialButton";
import { API } from "../../../config/apiClient";
import { END_POINTS } from "../../../config/routes";
import { colors } from "../../../constants/colors";
import { setAuthData } from "../../../redux/reducers/AuthSlice";

const Signup = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Single state for all form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    height: "",
    heightUnit: "cm", // Default unit
    weight: "",
    weightUnit: "kg", // Default unit
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (
      !form.firstName ||
      !form.lastName ||
      !form.height ||
      !form.weight ||
      !form.age ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
        text2: "Please fill in all fields.",
      });
      return false;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address.",
      });
      return false;
    }

    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match.",
      });
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return; // Stop if validation fails

    setLoading(true);

    try {
      const response = await API.post(END_POINTS.SIGNUP, form);
      setLoading(false);
      if (response?.data?.success) {
        dispatch(
          setAuthData({
            token: response?.data?.token,
            data: response?.data?.data,
          })
        );

        setForm({
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

        Toast.show({
          type: "success",
          text1: "Signup Successful",
          text2: "Welcome! Redirecting to dashboard.",
        });
        navigation.reset({
          index: 0, // Ensures TabNavigator is at the top
          routes: [
            {
              name: "UserApp", // Parent navigator (UserApp)
              state: {
                routes: [{ name: "TabNavigator" }], // Navigate to TabNavigator within UserApp
              },
            },
          ],
        });
        // navigation.replace("UserApp", { screen: "TabNavigator" });
      } else {
        Toast.show({
          type: "error",
          text1: "Signup Failed",
          text2:
            response.data?.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          error ||
          "Failed to complete signup. Please try again.",
      });
    }
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
                dropdownIconColor={colors.green}
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
                dropdownIconColor={colors.green}
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
          disabled={loading}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine}></View>
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine}></View>
        </View>

        <View style={styles.socialButtonContainer}>
          <SocialButton icon={GoogleLogo} />
          <SocialButton icon={FacebookLogo} />
          <SocialButton icon={AppleLogo} />
        </View>
        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Already a member?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Loader isLoading={loading} message="Processing your request..." />
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

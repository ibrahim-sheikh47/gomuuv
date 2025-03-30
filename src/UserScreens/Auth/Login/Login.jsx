import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import AppleLogo from "../../../assets/svgs/AppleLogo";
import FacebookLogo from "../../../assets/svgs/FacebookLogo";
import GoogleLogo from "../../../assets/svgs/GoogleLogo";
import AuthHeader from "../../../components/AuthHeader";
import Container from "../../../components/Container";
import CustomButton from "../../../components/CustomButton";
import InputField from "../../../components/InputField";
import Loader from "../../../components/Loader";
import { SocialButton } from "../../../components/SocialButton";
import { colors } from "../../../constants/colors";
import { END_POINTS } from "../../../config/routes";
import { API } from "../../../config/apiClient";
import { setAuthData } from "../../../redux/reducers/AuthSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontSize } from "../../../utils/font";

const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "ahmadmuzaffar6228@gmail.com",
    password: "abcd1234",
    rememberMe: false,
  });

  const validateForm = () => {
    if (!formData.email) {
      return "Email is required.";
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    if (!formData.password) {
      return "Password is required.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null; // No errors
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    // Validate the form
    const validationError = validateForm();
    if (validationError) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: validationError,
      });
      return; // Stop further execution
    }

    setLoading(true);
    try {
      const response = await API.post(END_POINTS.LOGIN, {
        email: formData.email,
        password: formData.password,
      });
      console.log("response", response?.status);
      console.log("response", response?.data);
      if (response?.data?.success) {
        dispatch(
          setAuthData({
            token: response?.data?.token,
            data: response?.data?.data,
          })
        );
        // Successful login
        Toast.show({
          type: "success",
          text1: "Login Successful!",
          text2: "Welcome back 👋",
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
      }
    } catch (error) {
      // Handle error response
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2:
          error.response?.data?.message ||
          error ||
          "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StatusBar style="light" backgroundColor="#121212" />
      <AuthHeader
        header={"Login"}
        description={"Welcome back! Please enter your details"}
      />
      <ScrollView>
        <View style={styles.inputContainer}>
          <InputField
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            placeholder="Enter your email"
          />
          <InputField
            label="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry={true}
            placeholder="Enter your password"
          />
        </View>

        <TouchableOpacity
          onPress={() => handleInputChange("rememberMe", !formData.rememberMe)}
          style={styles.rememberMeContainer}
        >
          <View
            style={[
              styles.checkbox,
              formData.rememberMe && styles.checkboxChecked,
            ]}
          >
            {formData.rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </TouchableOpacity>

        <CustomButton
          style={{ marginTop: 50 }}
          title="Login"
          onPress={handleLogin}
        />
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine}></View>
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine}></View>
        </View>

        <View style={styles.socialButtonContainer}>
          {/** Repeated styles are now combined */}
          <SocialButton icon={GoogleLogo} />
          <SocialButton icon={FacebookLogo} />
          <SocialButton icon={AppleLogo} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            marginTop: 50,
          }}
        >
          <Text style={styles.signInText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signInLink}> Sign up</Text>
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
  loginButton: {
    backgroundColor: colors.green,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 50,
  },
  loginButtonText: {
    color: "#000",
    fontSize: FontSize.regular,
    fontWeight: "bold",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.green, // Change color for checked state
    borderWidth: 0,
  },
  checkmark: {
    color: "#fff",
    fontSize: FontSize.small,
  },
  rememberMeText: {
    fontSize: FontSize.regular,
    color: "#fff",
  },
  forgotPasswordText: {
    textAlign: "center",
    marginTop: 30,
    color: "#fff",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
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
  signInText: {
    color: "white",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.medium,
  },
  signInLink: {
    color: colors.green,
    fontFamily: "Poppins-SemiBold",
  },
});

export default Login;

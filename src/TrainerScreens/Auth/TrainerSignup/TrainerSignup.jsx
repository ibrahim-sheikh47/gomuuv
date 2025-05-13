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
import AppleLogo from "../../../assets/svgs/AppleLogo";
import FacebookLogo from "../../../assets/svgs/FacebookLogo";
import GoogleLogo from "../../../assets/svgs/GoogleLogo";
import AuthHeader from "../../../components/AuthHeader";
import Container from "../../../components/Container";
import CustomButton from "../../../components/CustomButton";
import InputField from "../../../components/InputField";
import { SocialButton } from "../../../components/SocialButton";
import { colors } from "../../../constants/colors";
import { FontSize } from "../../../utils/font";
import { API } from "../../../config/apiClient";
import { END_POINTS } from "../../../config/routes";
import { setAuthData } from "../../../redux/reducers/AuthSlice";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

const TrainerSignup = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

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

  const validateForm = () => {
    // Check if all fields are filled
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
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
    if (!validateForm()) return;
    let body = {
      ...form,
      firstName: form.name,
      role: "trainer",
    };

    try {
      const response = await API.post(END_POINTS.SIGNUP, body);
      if (response?.data?.success) {
        dispatch(
          setAuthData({
            token: response?.data?.token,
            data: response?.data?.data,
          })
        );

        setForm({
          name: "",
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
          index: 0,
          routes: [
            {
              name: "TrainerHome",
            },
          ],
        });
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
            type={"first_name"}
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
    fontSize: FontSize.medium,
  },
  signInLink: {
    color: colors.green,
    fontFamily: "Poppins-SemiBold",
  },
});

export default TrainerSignup;

import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import AuthHeader from "../../../components/AuthHeader";
import Container from "../../../components/Container";
import CustomButton from "../../../components/CustomButton";
import InputField from "../../../components/InputField";
import Loader from "../../../components/Loader";
import { API } from "../../../config/apiClient";
import { END_POINTS } from "../../../config/routes";
import { colors } from "../../../constants/colors";
import { FontSize } from "../../../utils/font";

const ForgotPass = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("ahmadmuzaffar6228@gmail.com");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Email field cannot be empty",
      });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await API.post(END_POINTS.FORGOT_PASSWORD, { email });
      setLoading(false);

      if (response?.data?.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2:
            response?.data?.message ||
            "A 8-digit verification code has been sent to your email",
        });
        navigation.navigate("Verify", {
          email: email,
          code: response?.data?.code,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data?.message || "Something went wrong",
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
          "Login failed. Please try again.",
      });
    }
  };

  return (
    <Container>
      <AuthHeader
        header="Forgot Password"
        description="Enter your Email to Reset Password"
        customStyles={{
          headerText: { fontSize: FontSize.regular },
          descriptionText: { color: colors.green },
        }}
      />
      <View style={{ marginTop: 30, flex: 1 }}>
        <InputField
          label="Email"
          keyboardType="email-address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <CustomButton
        title="Continue"
        onPress={handleResetPassword}
        disabled={loading}
      />
      <Loader isLoading={loading} message="Processing your request..." />
    </Container>
  );
};

export default ForgotPass;

const styles = StyleSheet.create({});

import { StyleSheet, Text, View, Platform, ToastAndroid } from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import BackHeader from "../../components/BackHeader";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { END_POINTS } from "../../config/routes";
import { API } from "../../config/apiClient";
import { useSelector } from "react-redux";

const TrainerChangePass = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { token } = useSelector((state) => ({
    token: state.Auth?.token,
  }));

  // Single state object to manage inputs
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const showToast = (message, type = "success") => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Toast.show({
        type,
        text1: type === "success" ? "Success" : "Error",
        text2: message,
        position: "top",
      });
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*)";
    }
    return null;
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSaveChange = () => {
    const { currentPassword, newPassword, confirmPassword } = formData;
    const newErrors = {};

    // Validate new password
    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    // Validate new password
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // If there are any errors, display them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Show specific toast message based on validation errors
      if (newErrors.newPassword) {
        showToast(newErrors.newPassword, "error");
      } else if (newErrors.confirmPassword) {
        showToast(newErrors.confirmPassword, "error");
      }
      return;
    }

    // If all validations pass, proceed with password change
    performChangePassword(currentPassword, newPassword);
  };

  const performChangePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      const response = await API.post(
        END_POINTS.CHANGE_PASSWORD,
        {
          currentPassword,
          newPassword,
        },
        token
      );
      console.log(response.data);
      if (response?.data?.success) {
        Toast.show({
          type: "success",
          text1: "Password changed!",
          text2: "",
        });
        navigation.goBack();
      }
    } catch (error) {
      // Handle error response
      Toast.show({
        type: "error",
        text1: "Could not changed password!",
        text2: error.response?.data?.message || error || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BackHeader title="Change Password" showBackButton={true} />
      <View style={{ marginTop: 30, flex: 1 }}>
        <InputField
          label={"Current Password"}
          value={formData.currentPassword}
          secureTextEntry={true}
          placeholder="Enter current password"
          onChangeText={(value) => handleInputChange("currentPassword", value)}
          error={errors.currentPassword}
        />
        <InputField
          label={"New Password"}
          value={formData.newPassword}
          onChangeText={(value) => handleInputChange("newPassword", value)}
          secureTextEntry={true}
          placeholder="Enter new password"
          error={errors.newPassword}
        />
        <InputField
          value={formData.confirmPassword}
          label={"Confirm Password"}
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
          secureTextEntry={true}
          placeholder="Confirm new password"
          error={errors.confirmPassword}
        />
      </View>

      <CustomButton title="Save Changes" onPress={handleSaveChange} />
      <Loader isLoading={loading} />
      <Toast />
    </Container>
  );
};

export default TrainerChangePass;

const styles = StyleSheet.create({});

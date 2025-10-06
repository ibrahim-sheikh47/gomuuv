import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import AppleLogo from "../../../assets/svgs/AppleLogo";
import GoogleLogo from "../../../assets/svgs/GoogleLogo";
import AuthHeader from "../../../components/AuthHeader";
import Container from "../../../components/Container";
import CustomButton from "../../../components/CustomButton";
import InputField from "../../../components/InputField";
import { SocialButton } from "../../../components/SocialButton";
import { colors } from "../../../constants/colors";
import { END_POINTS } from "../../../config/routes";
import { API } from "../../../config/apiClient";
import { setAuthData } from "../../../redux/reducers/AuthSlice";
import { useDispatch } from "react-redux";
import { appleSignIn, googleSignIn } from "../../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: validationError,
      });
      return; // Stop further execution
    }

    try {
      let deviceId = await AsyncStorage.getItem("fcmToken");
      const response = await API.post(END_POINTS.LOGIN, {
        email: formData.email,
        password: formData.password,
        deviceId,
      });
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

        if (response.data.data.role === "user") {
          navigation.reset({
            index: 0, // Ensures TabNavigator is at the top
            routes: [
              {
                name: "UserApp",
              },
            ],
          });
        } else {
          navigation.reset({
            index: 0, // Ensures TabNavigator is at the top
            routes: [
              {
                name: "TrainerApp",
              },
            ],
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      let deviceId = await AsyncStorage.getItem("fcmToken");
      const res = await googleSignIn();

      const response = await API.post(END_POINTS.SOCIAL_LOGIN, {
        firstName: res.data.user.givenName,
        lastName: res.data.user.familyName,
        email: res.data.user.email,
        image: res.data.user.photo,
        socialAccessToken: res.data.idToken,
        deviceId,
        authType: "google",
      });
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

        if (response.data.data.role === "user") {
          navigation.reset({
            index: 0, // Ensures TabNavigator is at the top
            routes: [
              {
                name: "UserApp",
              },
            ],
          });
        } else {
          navigation.reset({
            index: 0, // Ensures TabNavigator is at the top
            routes: [
              {
                name: "TrainerApp",
              },
            ],
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithApple = async () => {
    try {
      let deviceId = await AsyncStorage.getItem("fcmToken");
      const res = await appleSignIn();
      const response = await API.post(END_POINTS.SOCIAL_LOGIN, {
        email: res.email,
        firstName: res.fullName?.givenName || "",
        lastName: res.fullName?.familyName || "",
        socialAccessToken: res.identityToken,
        deviceId,
        authType: "apple",
      });
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

        if (response.data.data.role === "user") {
          navigation.reset({
            index: 0, // Ensures TabNavigator is at the top
            routes: [
              {
                name: "UserApp",
              },
            ],
          });
        } else {
          navigation.reset({
            index: 0, // Ensures TabNavigator is at the top
            routes: [
              {
                name: "TrainerApp",
              },
            ],
          });
        }
      }
    } catch (err) {
      console.error(err);
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

        {/* <TouchableOpacity
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
        </TouchableOpacity> */}

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
          <SocialButton icon={GoogleLogo} onPress={signInWithGoogle} />
          {/* <SocialButton icon={FacebookLogo} /> */}
          {Platform.OS === "ios" && (
            <SocialButton icon={AppleLogo} onPress={signInWithApple} />
          )}
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
          <TouchableOpacity
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Splash",
                  },
                ],
              });
            }}
          >
            <Text style={styles.signInLink}> Sign up</Text>
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
    fontSize: 16,
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
    fontSize: 12,
  },
  rememberMeText: {
    fontSize: 16,
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
    fontSize: 14,
  },
  signInLink: {
    color: colors.green,
    fontFamily: "Poppins-SemiBold",
  },
});

export default Login;

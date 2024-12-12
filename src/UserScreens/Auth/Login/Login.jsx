import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
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
import Loader from "../../../components/Loader";
import CustomButton from "../../../components/CustomButton";
import GoogleLogo from "../../../assets/svgs/GoogleLogo";
import FacebookLogo from "../../../assets/svgs/FacebookLogo";
import AppleLogo from "../../../assets/svgs/AppleLogo";

const Login = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      alert("Login Successfully!");
      navigation.navigate("TabNavigator");
    }, 2000);
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
      <Loader isLoading={loading} />
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

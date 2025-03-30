import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
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
import { FontSize } from "../../../utils/font";

const Signup = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Single state for all form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    height: "",
    heightUnit: "ft", // Default unit
    weight: "",
    weightUnit: "kg", // Default unit
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // States for modal visibility
  const [heightModalVisible, setHeightModalVisible] = useState(false);
  const [weightModalVisible, setWeightModalVisible] = useState(false);

  // Options for the dropdowns
  const heightUnitOptions = ["cm", "ft"];
  const weightUnitOptions = ["kg", "lb"];

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

  // Custom modal selection component
  const SelectionModal = ({ visible, onClose, options, onSelect, title }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
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
            <TouchableOpacity
              style={styles.unitSelector}
              onPress={() => setHeightModalVisible(true)}
            >
              <Text style={styles.unitSelectorText}>{form.heightUnit}</Text>
            </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.unitSelector}
              onPress={() => setWeightModalVisible(true)}
            >
              <Text style={styles.unitSelectorText}>{form.weightUnit}</Text>
            </TouchableOpacity>
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

      {/* Height Unit Selection Modal */}
      <SelectionModal
        visible={heightModalVisible}
        onClose={() => setHeightModalVisible(false)}
        options={heightUnitOptions}
        onSelect={(value) => handleInputChange("heightUnit", value)}
        title="Select Height Unit"
      />

      {/* Weight Unit Selection Modal */}
      <SelectionModal
        visible={weightModalVisible}
        onClose={() => setWeightModalVisible(false)}
        options={weightUnitOptions}
        onSelect={(value) => handleInputChange("weightUnit", value)}
        title="Select Weight Unit"
      />

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
  unitSelector: {
    height: 50,
    width: 100,
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: "#1A1919",
    justifyContent: "center",
    alignItems: "center",
  },
  unitSelectorText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
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
    fontSize: FontSize.medium,
  },
  signInLink: {
    color: colors.green,
    fontFamily: "Poppins-SemiBold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#212121",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    marginBottom: 15,
  },
  modalItem: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#fff",
    textAlign: "center",
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.green,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#fff",
  },
});

export default Signup;

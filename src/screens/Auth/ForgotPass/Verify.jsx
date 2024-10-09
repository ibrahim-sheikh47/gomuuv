import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Container from "../../../components/Container";
import AuthHeader from "../../../components/AuthHeader";
import { colors } from "../../../constants/colors";
import Loader from "../../../components/Loader";

const Verify = () => {
  const navigation = useNavigation();
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false); // Loader state
  const inputRefs = useRef([]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Automatically focus on next input
      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      } else if (value && index === inputRefs.current.length - 1) {
        // Dismiss the keyboard after the last input
        Keyboard.dismiss();
      }
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  const handleVerify = () => {
    if (isCodeComplete) {
      setLoading(true); // Show the loader
      setTimeout(() => {
        setLoading(false); // Hide the loader after verification
      }, 2000); // Simulate a network request delay
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View>
          <AuthHeader
            header="Forgot Password"
            description="Enter Verification Code"
            customStyles={{
              headerText: { fontSize: 16 },
              descriptionText: { color: colors.green },
            }}
          />
          <Text
            style={{
              color: "white",
              fontFamily: "Poppins-Medium",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            We have sent a code to your email@gmail.com
          </Text>
        </View>
        <View>
          {/* Input fields for the verification code */}
          <View style={styles.inputContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChangeText={(value) => handleCodeChange(index, value)}
                style={styles.input}
                keyboardType="numeric"
                maxLength={1}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Buttons for Resend and Verify */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <Text style={styles.signInText}>Didn't received the OTP?</Text>
            <TouchableOpacity>
              <Text style={styles.signInLink}>click here to resend</Text>
            </TouchableOpacity>
          </View>
        </View>
        <CustomButton
          title="Continue"
          onPress={() => {
            navigation.navigate("NewPass");
          }}
        />

        {/* Loader while verifying */}
        <Loader isLoading={loading} />
      </ScrollView>
    </Container>
  );
};

export default Verify;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    padding: 16,
  },
  input: {
    width: "25%",
    height: 67,
    borderBottomColor: "#696969",
    borderBottomWidth: 2,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 5,
    color: colors.green,
  },
  btnContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 16,
    marginBottom: 20,
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

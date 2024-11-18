import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Container from "../../../components/Container";
import AuthHeader from "../../../components/AuthHeader";
import { colors } from "../../../constants/colors";
import InputField from "../../../components/InputField";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";

const ForgotPass = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  return (
    <Container>
      <AuthHeader
        header="Forgot Password"
        description="Enter your Email to Reset Password"
        customStyles={{
          headerText: { fontSize: 16 },
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
        onPress={() => navigation.navigate("NewPass")}
      />
    </Container>
  );
};

export default ForgotPass;

const styles = StyleSheet.create({});

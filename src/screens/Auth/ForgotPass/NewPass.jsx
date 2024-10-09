import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Container from "../../../components/Container";
import BackHeader from "../../../components/BackHeader";
import InputField from "../../../components/InputField";
import CustomButton from "../../../components/CustomButton";
import Loader from "../../../components/Loader";
import { useNavigation } from "@react-navigation/native";

const NewPass = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Single state object to manage inputs
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSaveChange = () => {
    const { password, confirmPassword } = formData;

    if (password === confirmPassword) {
      // Proceed to the next step, such as navigation to Verify
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert("Password changed successfully!");
      }, 2000);
    } else {
      // Handle the case when passwords do not match
      alert("Passwords do not match!");
    }
  };

  return (
    <Container>
      <BackHeader title="New Password" showBackButton={true} />
      <View style={{ marginTop: 30, flex: 1 }}>
        <InputField
          label="New Password"
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry={true}
          placeholder="Enter new password"
        />
        <InputField
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
          secureTextEntry={true}
          placeholder="Confirm new password"
        />
      </View>
      <CustomButton title="Save Changes" onPress={handleSaveChange} />
      <Loader isLoading={loading} />
    </Container>
  );
};

export default NewPass;

const styles = StyleSheet.create({});

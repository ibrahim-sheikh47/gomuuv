import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import InputField from "../../components/InputField";
import { colors } from "../../constants/colors";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import { useNavigation } from "@react-navigation/native";

const Checkout = () => {
  const navigation = useNavigation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Consolidate all input values into a single state object
  const [formData, setFormData] = useState({
    contact: "",
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    shippingMethod: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
  });

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodSelect = (index) => {
    setSelectedPaymentMethod(selectedPaymentMethod === index ? null : index);
  };

  const handleOrder = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate("CompletedOrder");
    }, 2000);
  };

  return (
    <Container>
      <Header
        title={"Checkout"}
        showBackButton={true}
        rightIcon1={icons.cart}
        rightIcon2={icons.cart2}
      />
      <ScrollView style={{ marginBottom: 30 }}>
        <Text style={[styles.paymentMethodTitle, { marginTop: 10 }]}>
          Show Order Summary
        </Text>
        <InputField
          label={"Contact"}
          placeholder={"Email"}
          value={formData.contact}
          onChangeText={(value) => handleInputChange("contact", value)}
        />
        <InputField
          label={"Delivery"}
          placeholder={"Country/Region"}
          value={formData.country}
          onChangeText={(value) => handleInputChange("country", value)}
        />
        <InputField
          placeholder={"First Name"}
          value={formData.firstName}
          onChangeText={(value) => handleInputChange("firstName", value)}
        />
        <InputField
          placeholder={"Last Name"}
          value={formData.lastName}
          onChangeText={(value) => handleInputChange("lastName", value)}
        />
        <InputField
          placeholder={"Address"}
          value={formData.address}
          onChangeText={(value) => handleInputChange("address", value)}
        />
        <InputField
          placeholder={"City"}
          value={formData.city}
          onChangeText={(value) => handleInputChange("city", value)}
        />
        <InputField
          placeholder={"Postal Code"}
          value={formData.postalCode}
          onChangeText={(value) => handleInputChange("postalCode", value)}
        />
        <InputField
          label={"Shipping Method"}
          placeholder={"Shipping Across US"}
          value={formData.shippingMethod}
          onChangeText={(value) => handleInputChange("shippingMethod", value)}
        />
        <Text style={styles.paymentMethodTitle}>Payment Method</Text>
        <Text style={styles.secureTransactionText}>
          All Transactions are Secure and Encrypted
        </Text>
        <View style={styles.paymentOptionsContainer}>
          {paymentMethods.map((method, index) => (
            <View key={index}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedPaymentMethod === index &&
                    styles.selectedPaymentOption,
                ]}
                onPress={() => handlePaymentMethodSelect(index)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <View
                    style={[
                      styles.circleIndicator,
                      selectedPaymentMethod === index &&
                        styles.selectedIndicator,
                    ]}
                  ></View>
                  <Text style={styles.paymentOptionText}>{method.name}</Text>
                </View>
                <Text style={styles.arrowIcon}>
                  {selectedPaymentMethod === index ? "▼" : "▲"}{" "}
                </Text>
              </TouchableOpacity>
              {selectedPaymentMethod === index && method.component && (
                <View style={styles.extendedInfoContainer}>
                  {React.cloneElement(method.component, {
                    formData,
                    handleInputChange,
                  })}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <CustomModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        modalIcon={icons.cart}
        modalText={"Your order has been placed!"}
      />
      <CustomButton title={"Complete Order"} onPress={handleOrder} />
    </Container>
  );
};

const CreditCardPayment = ({ formData, handleInputChange }) => (
  <>
    <InputField
      placeholder={"Card Number"}
      value={formData.cardNumber}
      onChangeText={(value) => handleInputChange("cardNumber", value)}
    />
    <InputField
      placeholder={"Card Name"}
      value={formData.cardName}
      onChangeText={(value) => handleInputChange("cardName", value)}
    />
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        gap: 20,
      }}
    >
      <View style={{ flex: 1 }}>
        <InputField
          placeholder={"Expiry Date"}
          value={formData.expiryDate}
          onChangeText={(value) => handleInputChange("expiryDate", value)}
        />
      </View>
      <View style={{ flex: 1 }}>
        <InputField
          placeholder={"CVV"}
          value={formData.cvv}
          onChangeText={(value) => handleInputChange("cvv", value)}
        />
      </View>
    </View>
  </>
);

const BankTransfer = ({ formData, handleInputChange }) => (
  <>
    <InputField
      placeholder={"Bank Name"}
      value={formData.bankName}
      onChangeText={(value) => handleInputChange("bankName", value)}
    />
    <InputField
      placeholder={"Account Holder Name"}
      value={formData.accountHolder}
      onChangeText={(value) => handleInputChange("accountHolder", value)}
    />
    <InputField
      placeholder={"Account Number"}
      value={formData.accountNumber}
      onChangeText={(value) => handleInputChange("accountNumber", value)}
    />
  </>
);

const paymentMethods = [
  { name: "Cash On Delivery (COD)" },
  { name: "Credit / Debit Card", component: <CreditCardPayment /> },
  { name: "Bank Deposit / Transfer", component: <BankTransfer /> },
];

const styles = StyleSheet.create({
  paymentMethodTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    marginVertical: 5,
  },
  secureTransactionText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#AFAFAF",
  },
  paymentOptionsContainer: {
    marginTop: 20,
    gap: 10,
  },
  paymentOption: {
    height: 38,
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  circleIndicator: {
    width: 6,
    height: 6,
    backgroundColor: "#AFAFAF",
    borderRadius: 3,
  },
  selectedIndicator: {
    backgroundColor: colors.green,
  },
  paymentOptionText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#f8f8f8",
  },
  arrowIcon: {
    fontSize: 16,
    color: "#f8f8f8",
  },
  extendedInfoContainer: {
    padding: 10,
    marginTop: -6,
    backgroundColor: colors.bgColor,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  paymentInfoContainer: {
    padding: 10,
    backgroundColor: colors.bgColor,
  },
  extendedInfoText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#AFAFAF",
  },
});

export default Checkout;

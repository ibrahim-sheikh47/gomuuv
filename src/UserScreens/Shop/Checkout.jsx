import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import CartIcon from "../../assets/svgs/CartIcon";
import ShopIcon from "../../assets/svgs/ShopIcon";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import { colors } from "../../constants/colors";
import images from "../../constants/images";
import { setCartData } from "../../redux/reducers/CartSlice";
import { END_POINTS } from "../../config/routes";
import { API } from "../../config/apiClient";
import Toast from "react-native-toast-message";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { cartItems, token } = useSelector((state) => ({
    token: state.Auth?.token,
    cartItems: state.Cart?.data,
  }));
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (selectedPaymentMethod === null) handlePaymentMethodSelect(0);
  }, []);

  // Handle increment and decrement for quantity based on item id
  const incrementQuantity = (itemId) => {
    const updatedCartItems = cartItems.map((item) =>
      item?.product?._id === itemId
        ? {
            ...item,
            quantity:
              item?.quantity < item?.product?.stock
                ? item?.quantity + 1
                : item?.quantity, // Prevent incrementing beyond stock
          }
        : item
    );
    // Only update the Redux state and call the API if the quantity has actually changed
    const updatedItem = updatedCartItems.find(
      (item) => item?.product?._id === itemId
    );
    if (updatedItem && updatedItem?.quantity < updatedItem?.product?.stock) {
      dispatch(setCartData(updatedCartItems));
      // Call the debounced API function
      debouncedUpdateProductQuantity(updatedCartItems, itemId);
    } else {
      dispatch(setCartData(updatedCartItems)); // Still update Redux without calling API
    }
  };

  // Define debounced API call using useCallback to ensure it's created only once
  const debouncedUpdateProductQuantity = useCallback(
    debounce((updatedCartItems, itemId) => {
      // Find the updated item to make the API call
      const updatedItem = updatedCartItems.find(
        (item) => item?.product?._id === itemId
      );
      if (updatedItem) {
        // Call the API to update the product on the server
        callProductUpdateApi(updatedItem?.product?._id, updatedItem?.quantity);
      }
    }, 1000), // Wait for 2 seconds before making the API call
    [] // Empty dependency array ensures that the debounced function is created only once
  );

  const decrementQuantity = (itemId) => {
    // Find the item in the cart
    const updatedCartItems = cartItems.map((item) =>
      item?.product?._id === itemId && item?.quantity > 1
        ? { ...item, quantity: item?.quantity - 1 }
        : item
    );
    // Only update the Redux state and call the API if the quantity has actually changed
    const updatedItem = updatedCartItems.find(
      (item) => item?.product?._id === itemId
    );
    if (updatedItem && updatedItem?.quantity > 1) {
      dispatch(setCartData(updatedCartItems));
      // Call the debounced API function
      debouncedUpdateProductQuantity(updatedCartItems, itemId);
    } else {
      dispatch(setCartData(updatedCartItems)); // Still update Redux without calling API
    }
  };

  const callProductUpdateApi = async (productId, newQuantity) => {
    try {
      const payload = {
        products: [
          {
            id: productId,
            quantity: newQuantity,
          },
        ],
      };
      // Make your API request here to update the product quantity
      await API.post(END_POINTS.ADD_TO_CART, payload, token);
      console.log("Product quantity updated successfully");
    } catch (error) {
      console.error("Error updating product quantity", error);
    }
  };

  const callProductRemoveApi = async (productId) => {
    try {
      const payload = {
        products: [
          {
            id: productId,
            quantity: 0,
          },
        ],
      };
      // Make your API request here to update the product quantity
      const response = await API.post(
        END_POINTS.REMOVE_FROM_CART,
        payload,
        token
      );
      if (response?.data?.success) {
        dispatch(setCartData(response.data?.data?.items));
        console.log("Product removed successfully");
      }
    } catch (error) {
      console.error("Error removing product", error);
    }
  };

  const paymentMethods = [
    { name: "Cash On Delivery (COD)" },
    { name: "Credit / Debit Card", component: <CreditCardPayment /> },
    { name: "Bank Deposit / Transfer", component: <BankTransfer /> },
  ];

  // Consolidate all input values into a single state object
  const [formData, setFormData] = useState({
    contact: "Test@gmail.com",
    country: "",
    firstName: "",
    lastName: "",
    address: "House# 232, Model Town, Lahore",
    city: "",
    postalCode: "",
    paymentMethod: "",
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
    setSelectedPaymentMethod((prev) => {
      if (prev === index) {
        // If the same payment method is clicked again, unselect it
        resetPaymentMethodFields();
        return null;
      } else {
        // Otherwise, select the new payment method
        updatePaymentMethodFields(index);
        return index;
      }
    });
  };

  const updatePaymentMethodFields = (index) => {
    const paymentMethod = paymentMethods[index];
    if (paymentMethod.name === "Credit / Debit Card") {
      // Set form data related to Credit Card payment
      setFormData((prev) => ({
        ...prev,
        paymentMethod: "card",
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
      }));
    } else if (paymentMethod.name === "Bank Deposit / Transfer") {
      // Set form data related to Bank Transfer
      setFormData((prev) => ({
        ...prev,
        paymentMethod: "online",
        bankName: "",
        accountHolder: "",
        accountNumber: "",
      }));
    } else {
      // Set form data for Cash On Delivery (COD)
      setFormData((prev) => ({
        ...prev,
        paymentMethod: "cash-on-delivery",
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        bankName: "",
        accountHolder: "",
        accountNumber: "",
      }));
    }
  };

  const resetPaymentMethodFields = () => {
    // Reset payment-related fields when unselected
    setFormData((prev) => ({
      ...prev,
      paymentMethod: "",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      bankName: "",
      accountHolder: "",
      accountNumber: "",
    }));
  };

  const handleOrder = () => {
    // setTimeout(() => {
    //   setModalVisible(false);
    //   navigation.navigate("CompletedOrder");
    // }, 2000);
  };

  // Calculate subtotal for a single item
  const getSubtotal = (price, quantity) => {
    return price * quantity;
  };

  const handlePlaceOrder = async () => {
    try {
      const payload = {
        contact: {
          email: formData.contact,
          address: formData.address,
          phone: formData.phone || "0332-3232322",
        },
        shipping: {
          charges: 0, // Shipping charges can be dynamically calculated
        },
        payment: {
          method: formData.paymentMethod, // 'cash-on-delivery', 'online', or 'card'
        },
      };
      console.log(JSON.stringify(payload, null, 2));
      // Send API request to place the order
      const response = await API.post(END_POINTS.PLACE_ORDER, payload, token);

      if (response?.data?.success) {
        setModalVisible(true);
        setTimeout(() => {
          dispatch(setCartData([])); // Clear the cart after placing the order
          setModalVisible(false);
          navigation.replace("CompletedOrder");
        }, 2000);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to place order. Please try again.",
      });
    }
  };

  return (
    <Container>
      <Header
        title={"Checkout"}
        showBackButton={true}
        rightIcon1={<CartIcon />}
        rightIcon2={<ShopIcon fill="white" />}
      />
      <ScrollView
        style={{ marginBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.paymentMethodTitle, { marginTop: 10 }]}>
          Show Order Summary
        </Text>
        {/* Iterate over cartItems to show each item */}
        {cartItems.map((item, index) => (
          <View key={index} style={styles.productContainer}>
            <Image
              source={item?.product?.image || images.product1}
              style={styles.image}
            />
            <View style={styles.productDetails}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <View>
                  <Text
                    style={styles.productTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item?.product?.name}
                  </Text>
                  <Text style={styles.productQuantity}>
                    Weight: {item?.product?.weight}
                  </Text>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => decrementQuantity(item?.product?._id)} // Pass item id
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item?.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => incrementQuantity(item?.product?._id)} // Pass item id
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.summaryText}>
                  Price: $
                  {getSubtotal(item?.product?.price, item?.quantity).toFixed(2)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const updateCartItems = cartItems.filter(
                      (item) => item?.product?._id !== item?.product?._id
                    );
                    dispatch(setCartData(updateCartItems));
                    callProductRemoveApi(item?.product?._id);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
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
        modalIcon={<CartIcon width={50} height={50} />}
        modalText={"Your order has been placed!"}
      />
      <CustomButton title={"Complete Order"} onPress={handlePlaceOrder} />
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
  productContainer: {
    flexDirection: "row",
    marginVertical: 10,
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 170,
    height: "100%",
    borderRadius: 10,
  },
  productDetails: {
    marginLeft: 10,
    flex: 1,
  },
  productTitle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-Bold",
  },
  productQuantity: {
    color: "#AFAFAF",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  quantityContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: 24,
  },
  quantityButton: {
    backgroundColor: "#2D2D2F",
    borderRadius: 100,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  quantity: {
    color: colors.green,
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  productPrice: {
    color: colors.green,
    fontSize: 14,
    fontFamily: "Poppins-Bold",
  },
  summaryText: {
    color: "#f8f8f8",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  removeText: {
    color: "#AFAFAF",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
});

export default Checkout;

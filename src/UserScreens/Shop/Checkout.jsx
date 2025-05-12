import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Platform,
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
import { FontSize } from "../../utils/font";
import CustomCheckbox from "../../components/CustomCheckbox";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { cartItems, token } = useSelector((state) => ({
    token: state.Auth?.token,
    cartItems: state.Cart?.data,
  }));
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [bankReceiptImage, setBankReceiptImage] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [saveInfoForNextTime, setSaveInfoForNextTime] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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
    contact: "",
    country: "",
    firstName: "",
    lastName: "",
    address: "",
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
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
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

  // Calculate subtotal for a single item
  const getSubtotal = (price, quantity) => {
    return price * quantity;
  };

  // Calculate order totals
  const calculateOrderTotals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (total, item) =>
        total + getSubtotal(item?.product?.price, item?.quantity),
      0
    );

    const shippingCost = 5.99;
    const discountAmount = discountApplied ? subtotal * 0.1 : 0; // 10% discount if applied
    const total = subtotal + shippingCost - discountAmount;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shippingCost.toFixed(2),
      discount: discountAmount.toFixed(2),
      total: total.toFixed(2),
    };
  }, [cartItems, discountApplied]);

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    const requiredFields = [
      "firstName",
      "lastName",
      "address",
      "city",
      "postalCode",
      "country",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "This field is required";
      }
    });

    // Payment method specific validation
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber) errors.cardNumber = "Card number is required";
      if (!formData.cardName) errors.cardName = "Card name is required";
      if (!formData.expiryDate) errors.expiryDate = "Expiry date is required";
      if (!formData.cvv) errors.cvv = "CVV is required";
    } else if (formData.paymentMethod === "online") {
      if (!formData.bankName) errors.bankName = "Bank name is required";
      if (!formData.accountHolder)
        errors.accountHolder = "Account holder name is required";
      if (!formData.accountNumber)
        errors.accountNumber = "Account number is required";
      if (!bankReceiptImage)
        errors.bankReceipt = "Bank receipt image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill all required fields",
      });
      return;
    }

    if (!cartItems.length) {
      Toast.show({
        type: "error",
        text1: "Cart is empty",
        text2: "Please add products to your cart before placing an order",
      });
      return;
    }

    try {
      const payload = {
        contact: {
          email: formData.contact,
          address: formData.address,
          phone: formData.phone || "0332-3232322",
        },
        shipping: {
          charges: parseFloat(calculateOrderTotals.shipping),
        },
        payment: {
          method: formData.paymentMethod, // 'cash-on-delivery', 'online', or 'card'
        },
        saveInfo: saveInfoForNextTime,
        discount: discountApplied ? discountCode : null,
      };
      // Send API request to place the order
      const response = await API.post(END_POINTS.PLACE_ORDER, payload, token);

      if (response?.data?.success) {
        setModalVisible(true);
        setTimeout(() => {
          dispatch(setCartData([])); // Clear the cart after placing the order
          setModalVisible(false);
          navigation.replace("CompletedOrder", { order: response?.data?.data });
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

  const pickBankReceiptImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "We need camera roll permission to upload images",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setBankReceiptImage(result.assets[0].uri);
      // Clear any error for bank receipt
      if (formErrors.bankReceipt) {
        setFormErrors((prev) => ({ ...prev, bankReceipt: null }));
      }
    }
  };

  const applyDiscountCode = () => {
    if (discountCode.trim()) {
      // In a real app, you would validate the discount code with an API
      setDiscountApplied(true);
      Toast.show({
        type: "success",
        text1: "Discount Applied",
        text2: "10% discount has been applied to your order",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid discount code",
      });
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  return (
    <Container>
      <Header title={"Checkout"} showBackButton={true} />
      <ScrollView
        style={{ marginBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary Toggle */}
        <TouchableOpacity
          style={styles.orderSummaryToggle}
          onPress={() => setShowOrderSummary(!showOrderSummary)}
        >
          <Text style={styles.paymentMethodTitle}>
            {showOrderSummary ? "Hide Order Summary" : "Show Order Summary"}
          </Text>
          <Text style={styles.arrowIcon}>{showOrderSummary ? "▼" : "▲"}</Text>
        </TouchableOpacity>

        {/* Order Summary Items */}
        {showOrderSummary &&
          cartItems.map((item, index) => (
            <View key={index} style={styles.productContainer}>
              <Image
                source={
                  item?.product?.image
                    ? { uri: item.product.image }
                    : images.product1
                }
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
                    {getSubtotal(item?.product?.price, item?.quantity).toFixed(
                      2
                    )}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const updateCartItems = cartItems.filter(
                        (cartItem) =>
                          cartItem?.product?._id !== item?.product?._id
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
          error={formErrors.contact}
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <CustomCheckbox
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            size={30} // Customize size
            color={colors.bgColor} // Customize color
          />
          <Text style={{ color: "white", fontSize: FontSize.xxsmall }}>
            Email me with news and offers
          </Text>
        </View>

        {/* Country/Region as Input Field (original implementation) */}
        <InputField
          label={"Delivery"}
          placeholder={"Country/Region"}
          value={formData.country}
          onChangeText={(value) => handleInputChange("country", value)}
          error={formErrors.country}
        />

        <InputField
          placeholder={"First Name"}
          value={formData.firstName}
          onChangeText={(value) => handleInputChange("firstName", value)}
          error={formErrors.firstName}
        />
        <InputField
          placeholder={"Last Name"}
          value={formData.lastName}
          onChangeText={(value) => handleInputChange("lastName", value)}
          error={formErrors.lastName}
        />
        <InputField
          placeholder={"Address"}
          value={formData.address}
          onChangeText={(value) => handleInputChange("address", value)}
          error={formErrors.address}
        />

        {/* Save Info Checkbox */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginBottom: 10,
          }}
        >
          <CustomCheckbox
            checked={saveInfoForNextTime}
            onChange={() => setSaveInfoForNextTime(!saveInfoForNextTime)}
            size={30}
            color={colors.bgColor}
          />
          <Text style={{ color: "white", fontSize: FontSize.xxsmall }}>
            Save this information for next time
          </Text>
        </View>

        <InputField
          placeholder={"City"}
          value={formData.city}
          onChangeText={(value) => handleInputChange("city", value)}
          error={formErrors.city}
        />
        <InputField
          placeholder={"Postal Code"}
          value={formData.postalCode}
          onChangeText={(value) => handleInputChange("postalCode", value)}
          error={formErrors.postalCode}
        />
        <InputField
          label={"Shipping Method"}
          placeholder={"Shipping Across US"}
          value={formData.shippingMethod}
          onChangeText={(value) => handleInputChange("shippingMethod", value)}
          error={formErrors.shippingMethod}
        />

        {/* Discount Code Section */}
        <View style={styles.discountContainer}>
          <Text style={styles.discountLabel}>Discount Code</Text>
          <View style={styles.discountInputContainer}>
            <InputField
              type="discount"
              placeholder={"Enter discount code"}
              value={discountCode}
              onChangeText={setDiscountCode}
              containerStyle={{ width: 1, marginBottom: 0 }}
            />
            <TouchableOpacity
              style={[
                styles.applyButton,
                { width: "25%", alignItems: "center" },
              ]}
              onPress={applyDiscountCode}
              disabled={discountApplied}
            >
              <Text style={styles.applyButtonText}>
                {discountApplied ? "Applied" : "Apply"}
              </Text>
            </TouchableOpacity>
          </View>
          {discountApplied && (
            <Text style={styles.discountAppliedText}>
              10% discount applied!
            </Text>
          )}
        </View>

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
                    formErrors,
                    bankReceiptImage,
                    pickBankReceiptImage,
                  })}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Order Summary Section at Bottom */}
        <View style={styles.orderSummarySection}>
          <Text style={styles.orderSummaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${calculateOrderTotals.subtotal}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              ${calculateOrderTotals.shipping}
            </Text>
          </View>

          {discountApplied && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, styles.discountText]}>
                -${calculateOrderTotals.discount}
              </Text>
            </View>
          )}

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${calculateOrderTotals.total}</Text>
          </View>
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

const CreditCardPayment = ({ formData, handleInputChange, formErrors }) => (
  <>
    <InputField
      placeholder={"Card Number"}
      value={formData.cardNumber}
      onChangeText={(value) => handleInputChange("cardNumber", value)}
      error={formErrors?.cardNumber}
    />
    <InputField
      placeholder={"Card Name"}
      value={formData.cardName}
      onChangeText={(value) => handleInputChange("cardName", value)}
      error={formErrors?.cardName}
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
          error={formErrors?.expiryDate}
        />
      </View>
      <View style={{ flex: 1 }}>
        <InputField
          placeholder={"CVV"}
          value={formData.cvv}
          onChangeText={(value) => handleInputChange("cvv", value)}
          error={formErrors?.cvv}
        />
      </View>
    </View>
  </>
);

const BankTransfer = ({
  formData,
  handleInputChange,
  formErrors,
  bankReceiptImage,
  pickBankReceiptImage,
}) => (
  <>
    <InputField
      placeholder={"Bank Name"}
      value={formData.bankName}
      onChangeText={(value) => handleInputChange("bankName", value)}
      error={formErrors?.bankName}
    />
    <InputField
      placeholder={"Account Holder Name"}
      value={formData.accountHolder}
      onChangeText={(value) => handleInputChange("accountHolder", value)}
      error={formErrors?.accountHolder}
    />
    <InputField
      placeholder={"Account Number"}
      value={formData.accountNumber}
      onChangeText={(value) => handleInputChange("accountNumber", value)}
      error={formErrors?.accountNumber}
    />

    {/* Bank Receipt Upload */}
    <View style={styles.receiptUploadContainer}>
      <Text style={styles.receiptLabel}>Upload Payment Receipt</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickBankReceiptImage}
      >
        <MaterialIcons name="file-upload" size={24} color="#fff" />
        <Text style={styles.uploadButtonText}>
          {bankReceiptImage ? "Change Image" : "Upload Image"}
        </Text>
      </TouchableOpacity>

      {bankReceiptImage && (
        <View style={styles.receiptImageContainer}>
          <Image
            source={{ uri: bankReceiptImage }}
            style={styles.receiptImage}
            resizeMode="cover"
          />
        </View>
      )}

      {formErrors?.bankReceipt && (
        <Text style={styles.errorText}>{formErrors.bankReceipt}</Text>
      )}
    </View>
  </>
);

const styles = StyleSheet.create({
  paymentMethodTitle: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    marginVertical: 5,
  },
  secureTransactionText: {
    fontSize: FontSize.small,
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
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
    color: "#f8f8f8",
  },
  arrowIcon: {
    fontSize: FontSize.regular,
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
    fontSize: FontSize.small,
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
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Bold",
  },
  productQuantity: {
    color: "#AFAFAF",
    fontSize: FontSize.small,
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
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
  },
  quantity: {
    color: colors.green,
    fontSize: FontSize.small,
    fontFamily: "Poppins-Bold",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  productPrice: {
    color: colors.green,
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Bold",
  },
  summaryText: {
    color: "#f8f8f8",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  removeText: {
    color: "#AFAFAF",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  // New styles for the revisions
  orderSummaryToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: FontSize.xxsmall,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
    marginLeft: 5,
  },
  discountContainer: {
    marginVertical: 15,
  },
  discountLabel: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    marginBottom: 5,
  },
  discountInputContainer: {
    gap: 10,
  },
  applyButton: {
    backgroundColor: colors.green,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#000",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
  },
  discountAppliedText: {
    color: colors.green,
    fontSize: FontSize.xxsmall,
    fontFamily: "Poppins-Regular",
    marginTop: 5,
  },
  orderSummarySection: {
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  orderSummaryTitle: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
    color: "#AFAFAF",
  },
  summaryValue: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
    color: "#fff",
  },
  discountText: {
    color: colors.green,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#2D2D2F",
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  totalValue: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Bold",
    color: colors.green,
  },
  receiptUploadContainer: {
    marginTop: 10,
  },
  receiptLabel: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#2D2D2F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
  },
  receiptImageContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  receiptImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
});

export default Checkout;

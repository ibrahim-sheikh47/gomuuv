import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CartIcon from "../../assets/svgs/CartIcon";
import ShopIcon from "../../assets/svgs/ShopIcon";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import { colors } from "../../constants/colors";
import images from "../../constants/images";
import { debounce } from "lodash";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { setCartData } from "../../redux/reducers/CartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { token, cartItems } = useSelector((state) => ({
    token: state.Auth?.token,
    cartItems: state.Cart?.data,
  }));

  // Calculate subtotal dynamically
  const getSubtotal = (price, quantity) => {
    return price * quantity;
  };

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
    // Only call API if quantity is less than stock
    const updatedItem = updatedCartItems.find(
      (item) => item?.product?._id === itemId
    );
    if (updatedItem?.quantity < updatedItem?.product?.stock) {
      dispatch(setCartData(updatedCartItems));
      debouncedUpdateProductQuantity(updatedCartItems, itemId); // Call the debounced API function
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
    // Only call API if quantity is greater than 1
    const updatedItem = updatedCartItems.find(
      (item) => item?.product?._id === itemId
    );
    if (updatedItem?.quantity > 0) {
      dispatch(setCartData(updatedCartItems));
      debouncedUpdateProductQuantity(updatedCartItems, itemId); // Call the debounced API function
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

  const handleCheckout = (product) => {
    navigation.navigate("Checkout");
  };

  // If no items in cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <Container>
        <Header
          title={"Cart"}
          showBackButton={true}
          rightIcon1={<CartIcon />}
          rightIcon2={<ShopIcon fill="white" />}
        />
        <Text
          style={{
            color: "#FFF",
            textAlign: "center",
            top: "42%",
            right: 0,
            bottom: 0,
            width: "100%",
          }}
        >
          No items in the cart.
        </Text>
      </Container>
    );
  }

  return (
    <Container>
      <Header
        title={"Cart"}
        showBackButton={true}
        rightIcon1={<CartIcon />}
        rightIcon2={<ShopIcon fill="white" />}
      />
      <ScrollView>
        <View>
          <Text style={styles.sectionTitle}>Items</Text>
          {cartItems.map((product, index) => {
            const subtotal = getSubtotal(
              product?.product?.price,
              product?.quantity
            );
            const shippingCharges = 0;

            return (
              <View key={index} style={styles.productContainer}>
                <Image
                  source={product?.product?.image || images.product1}
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
                      <Text style={styles.productTitle}>
                        {product?.product?.name}
                      </Text>
                      <Text style={styles.productQuantity}>
                        Weight: {product?.product?.weight}
                      </Text>
                    </View>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => decrementQuantity(product?.product?._id)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{product?.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => incrementQuantity(product?.product?._id)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>
                      ${subtotal.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const updateCartItems = cartItems.filter(
                          (item) => item?.product?._id !== product?.product?._id
                        );
                        dispatch(setCartData(updateCartItems));
                        callProductRemoveApi(product?.product?._id);
                      }}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
          {/* Order Summary Section */}
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Sub Total</Text>
              <Text style={styles.summaryText}>
                $
                {getSubtotal(
                  cartItems.reduce(
                    (acc, item) => acc + item?.product?.price,
                    0
                  ),
                  cartItems.length
                ).toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Shipping Charges</Text>
              <Text style={styles.summaryText}>$0.00</Text>
            </View>
            <View style={styles.separator}></View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>
                $
                {cartItems.reduce(
                  (acc, item) =>
                    acc + getSubtotal(item?.product?.price, item?.quantity),
                  0
                ) + 0}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomButton
        title={"Proceed to Checkout"}
        onPress={() => handleCheckout()}
      />

      <CustomButton
        title={"Continue Shopping"}
        style={{
          backgroundColor: "transparent",
          borderColor: colors.green,
          borderWidth: 2,
        }}
        textStyle={{ color: colors.green }}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#f8f8f8",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginTop: 20,
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
  removeText: {
    color: "#AFAFAF",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  orderSummary: {
    backgroundColor: colors.bgColor,
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryText: {
    color: "#f8f8f8",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "#343232",
    marginVertical: 10,
  },
  totalText: {
    color: "#f8f8f8",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
});

export default Cart;

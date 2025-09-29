import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  useWindowDimensions,
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
import { FontSize } from "../../utils/font";

const Cart = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions(); // Get screen width for responsive design
  const { token } = useSelector((state) => state.Auth);
  const { data: cartItems } = useSelector((state) => state.Cart);

  // Responsive values based on screen width
  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 480;
  const isLargeScreen = width >= 480;

  // Calculate image width based on screen size
  const getImageWidth = () => {
    if (isSmallScreen) return width * 0.35; // 35% of screen width on small screens
    if (isMediumScreen) return width * 0.4; // 40% of screen width on medium screens
    return width * 0.45; // 45% of screen width on large screens
  };

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
    }, 1000), // Wait for 1 second before making the API call
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

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  const handleContinueShopping = () => {
    navigation.navigate("Shop");
  };

  // If no items in cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <Container>
        <Header title={"Cart"} showBackButton={true} />
        <View style={[styles.emptyCartContainer]}>
          <Text style={styles.emptyCartText}>No items in the cart.</Text>
          <CustomButton
            title={"Start Shopping"}
            onPress={handleContinueShopping}
            style={{ marginTop: 20, width: width * 0.8 }}
          />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header title={"Cart"} showBackButton={true} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Items</Text>
          {cartItems.map((product, index) => {
            const subtotal = getSubtotal(
              product?.product?.price,
              product?.quantity
            );
            const imageWidth = getImageWidth();
            const imageHeight = imageWidth * 0.8; // Maintain aspect ratio

            return (
              <View key={index} style={styles.productContainer}>
                <Image
                  source={
                    product?.product?.image
                      ? { uri: product?.product?.image }
                      : images.product1
                  }
                  style={[
                    styles.image,
                    { width: imageWidth, height: imageHeight },
                  ]}
                  resizeMode="cover"
                />
                <View style={styles.productDetails}>
                  <View style={styles.productHeader}>
                    <View style={styles.productTitleContainer}>
                      <Text
                        style={[
                          styles.productTitle,
                          isSmallScreen && { fontSize: FontSize.small },
                        ]}
                        numberOfLines={2}
                      >
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
                {cartItems
                  .reduce(
                    (acc, item) =>
                      acc + getSubtotal(item?.product?.price, item?.quantity),
                    0
                  )
                  .toFixed(2)}
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
                {cartItems
                  .reduce(
                    (acc, item) =>
                      acc + getSubtotal(item?.product?.price, item?.quantity),
                    0
                  )
                  .toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton title={"Proceed to Checkout"} onPress={handleCheckout} />

        <CustomButton
          title={"Continue Shopping"}
          onPress={handleContinueShopping}
          style={{
            backgroundColor: "transparent",
            borderColor: colors.green,
            borderWidth: 2,
            marginTop: 10,
          }}
          textStyle={{ color: colors.green }}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyCartText: {
    color: "#FFF",
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  sectionTitle: {
    color: "#f8f8f8",
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    marginTop: 20,
    marginBottom: 10,
  },
  productContainer: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    padding: 10,
    width: "100%",
  },
  image: {
    borderRadius: 10,
    alignSelf: "center",
  },
  productDetails: {
    marginLeft: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productTitleContainer: {
    flex: 1,
    marginRight: 5,
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
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 5,
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
    lineHeight: 24,
    textAlign: "center",
  },
  quantity: {
    color: colors.green,
    fontSize: FontSize.small,
    fontFamily: "Poppins-Bold",
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  productPrice: {
    color: colors.green,
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Bold",
  },
  removeText: {
    color: "#AFAFAF",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  orderSummary: {
    backgroundColor: colors.bgColor,
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  summaryText: {
    color: "#f8f8f8",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "#343232",
    marginVertical: 10,
  },
  totalText: {
    color: "#f8f8f8",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Bold",
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
});

export default Cart;

// ShopItem.js
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { useDispatch, useSelector } from "react-redux";
import { setCartData } from "../redux/reducers/CartSlice";
import { API } from "../config/apiClient";
import { END_POINTS } from "../config/routes";
import { FontSize } from "../utils/font";

const ShopItem = ({ productImage, title, amount, onPress, product }) => {
  const dispatch = useDispatch(); // Initialize dispatch
  const navigation = useNavigation(); // Initialize navigation
  const [itemAddedToCart, setItemAddedToCart] = useState(false);

  const { token, cartItems } = useSelector((state) => ({
    token: state.Auth?.token,
    cartItems: state.Cart?.data,
  }));

  useEffect(() => {
    // Check if product exists and cartItems is not empty
    if (cartItems.length > 0) {
      checkItemInCart(product._id);
    }
  }, [cartItems]); // Dependency on cartItems and product

  // Function to check if item is in cart
  const checkItemInCart = (itemId) => {
    const itemInCart = cartItems.some(
      (cartItem) => cartItem?.product?._id === itemId
    );
    setItemAddedToCart(itemInCart);
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
      const updateCartItems = cartItems.filter(
        (item) => item.product._id !== productId
      );
      dispatch(setCartData(updateCartItems));
      // Make your API request here to update the product quantity
      await API.post(END_POINTS.REMOVE_FROM_CART, payload, token);
      console.log("Product removed successfully");
    } catch (error) {
      console.error("Error removing product", error);
    }
  };

  const handleAddToCartPress = () => {
    if (itemAddedToCart) {
      callProductRemoveApi(product._id); // Call API to remove item if already added to cart
    } else {
      onPress(); // Add to cart if not added
    }
  };

  const handlePress = () => {
    // onPress(); // Call the passed onPress function
    navigation.navigate("ProductDetail", { product }); // Navigate to ProductDetail screen
  };

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <TouchableOpacity onPress={handlePress}>
        <Image source={productImage} style={styles.productImage} />
      </TouchableOpacity>

      {/* Product Details */}
      <TouchableOpacity style={styles.detailsContainer} onPress={handlePress}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.amount}>{`$${amount}`}</Text>
      </TouchableOpacity>

      {/* Add to Cart Button */}
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={handleAddToCartPress}
      >
        <Text style={styles.buttonText}>
          {itemAddedToCart ? "Remove" : "Add to Cart"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShopItem;

const styles = StyleSheet.create({
  container: {
    borderColor: "#2D2D2F",
    borderWidth: 1,
    borderRadius: 10,
    width: 178,
    height: 178,
    marginBottom: 20,
    flexDirection: "column",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    padding: 8,
    gap: 10,
    marginRight: 12,
  },
  productImage: {
    width: 160,
    height: 80,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
    color: "#F8F8F8",
  },
  amount: {
    fontSize: FontSize.regular,
    color: colors.green,
    fontFamily: "Poppins-Bold",
  },
  addToCartButton: {
    backgroundColor: colors.green,
    borderRadius: 8,
    width: 76,
    height: 24,
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#121212",
    fontSize: FontSize.xxsmall,
    fontFamily: "Poppins-Bold",
  },
});

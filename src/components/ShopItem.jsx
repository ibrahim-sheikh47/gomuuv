// ShopItem.js
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const ShopItem = ({ productImage, title, amount, onPress, product }) => {
  const navigation = useNavigation(); // Initialize navigation

  const handlePress = () => {
    onPress(); // Call the passed onPress function
    navigation.navigate("ProductDetail", { product }); // Navigate to ProductDetail screen
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {/* Product Image */}
      <Image source={productImage} style={styles.productImage} />

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.amount}>{`$${amount}`}</Text>
      </View>

      {/* Add to Cart Button */}
      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#F8F8F8",
  },
  amount: {
    fontSize: 16,
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
    fontSize: 10,
    fontFamily: "Poppins-Bold",
  },
});

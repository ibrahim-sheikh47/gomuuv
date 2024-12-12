import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../../constants/colors";
import CustomButton from "../../components/CustomButton";
import CartIcon from "../../assets/svgs/CartIcon";
import ShopIcon from "../../assets/svgs/ShopIcon";

const Cart = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params || {};
  const [quantity, setQuantity] = useState(route.params?.quantity || 1);

  // Calculate the subtotal based on the quantity
  const subtotal = product.amount * quantity;
  const shippingCharges = 10;
  const total = subtotal + shippingCharges;

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleCheckout = () => {
    navigation.navigate("Checkout", {
      productImage: product.productImage,
      title: product.title,
      quantity: quantity,
      weight: product.weight,
      price: prices,
    });
  };

  const prices = subtotal.toFixed(2);

  if (!product) {
    return (
      <Container>
        <Header
          title={"Cart"}
          showBackButton={true}
          rightIcon1={<CartIcon />}
          rightIcon2={<ShopIcon fill="white" />}
        />
        <Text
          style={{ color: colors.white, textAlign: "center", marginTop: 20 }}
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
          <View style={styles.productContainer}>
            <Image source={product.productImage} style={styles.image} />
            <View style={styles.productDetails}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <View>
                  <Text style={styles.productTitle}>{product.title}</Text>
                  <Text style={styles.productQuantity}>
                    Weight: {product.weight}
                  </Text>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={decrementQuantity}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{quantity}</Text>
                  <TouchableOpacity
                    onPress={incrementQuantity}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>${subtotal.toFixed(2)}</Text>
                <Text style={styles.removeText}>Remove</Text>
              </View>
            </View>
          </View>
          {/* Order Summary Section */}
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Sub Total</Text>
              <Text style={styles.summaryText}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Shipping Charges</Text>
              <Text style={styles.summaryText}>$10.00</Text>
            </View>
            <View style={styles.separator}></View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomButton title={"Proceed to Checkout"} onPress={handleCheckout} />

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

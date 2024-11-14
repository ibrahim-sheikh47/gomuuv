import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../../constants/colors";
import CustomButton from "../../components/CustomButton";

const Cart = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product, quantity } = route.params || {};

  const subtotal = product.amount * quantity;
  const shippingCharges = 10;
  const total = subtotal + shippingCharges;

  // example shipping charges

  if (!product) {
    return (
      <Container>
        <Header
          title={"Cart"}
          showBackButton={true}
          rightIcon1={icons.cart}
          rightIcon2={icons.cart2}
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
        rightIcon1={icons.cart}
        rightIcon2={icons.cart2}
      />
      <ScrollView>
        <View>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.productContainer}>
            <Image source={product.productImage} style={styles.image} />
            <View style={styles.productDetails}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productQuantity}>
                Weight: {product.weight}
              </Text>
              <Text style={styles.productQuantity}>Quantity: {quantity}</Text>
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
      <CustomButton
        title={"Proceed to Checkout"}
        onPress={() => navigation.navigate("Checkout", { product, quantity })}
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

import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import { useRoute } from "@react-navigation/native";
import { colors } from "../../constants/colors";
import CustomButton from "../../components/CustomButton";

const Cart = () => {
  const route = useRoute();
  const { product, quantity } = route.params || { product: null, quantity: 1 };
  return (
    <Container>
      <Header
        title={"Cart"}
        showBackButton={true}
        rightIcon1={icons.cart}
        rightIcon2={icons.shop2}
      />
      <ScrollView>
        <View>
          <Text
            style={{
              color: "#f8f8f8",
              fontSize: 16,
              fontFamily: "Poppins-SemiBold",
              marginTop: 20,
            }}
          >
            Items
          </Text>
          <View style={styles.productContainer}>
            <Image source={product.productImage} style={styles.image} />
            <View style={styles.productDetails}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text
                style={styles.productQuantity}
              >{`Weight: ${product.weight}`}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 20,
                  flex: 1,
                }}
              >
                <Text style={styles.productPrice}>{`$${product.amount}`}</Text>
                <Text style={[styles.productQuantity, { marginLeft: 30 }]}>
                  Remove
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              color: "#f8f8f8",
              fontSize: 16,
              fontFamily: "Poppins-SemiBold",
              marginTop: 20,
            }}
          >
            Order Summary
          </Text>
        </View>
      </ScrollView>
      <CustomButton title={"Proceed to Checkout"} />
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

export default Cart;

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: "row",
    alignItems: "start",
    backgroundColor: "#2D2D2F",
    padding: 10,
    height: 132,
    marginVertical: 10,
    borderRadius: 10,
  },
  image: {
    width: 170,
    height: 112,
    borderRadius: 10,
  },
  productDetails: {
    marginLeft: 15,
  },
  productTitle: {
    fontSize: 14,
    width: 100,
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  productPrice: {
    fontSize: 14,
    color: colors.green,
    fontFamily: "Poppins-Bold",
  },
  productQuantity: {
    fontSize: 12,
    color: "#AFAFAF",
    fontFamily: "Poppins-Regular",
  },
  emptyCartText: {
    color: "#AFAFAF",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginVertical: 20,
  },
});

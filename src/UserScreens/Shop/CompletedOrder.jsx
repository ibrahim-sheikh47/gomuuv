import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import { colors } from "../../constants/colors";
import CartIcon from "../../assets/svgs/CartIcon";
import ShopIcon from "../../assets/svgs/ShopIcon";
import { FontSize } from "../../utils/font";
import images from "../../constants/images";

const CompletedOrder = () => {
  const [showOrderSummary, setShowOrderSummary] = useState(true);

  // Sample order data
  const orderItems = [
    {
      id: 1,
      name: "Whey Protein",
      image: images.product1,
      quantity: "01",
      price: 25.3,
      weight: "02 Lbs",
    },
    {
      id: 2,
      name: "Adjustable Dumbbells",
      image: images.product1,
      quantity: "01",
      price: 25.3,
      weight: "02 Lbs",
    },
  ];

  // Calculate total
  const totalPrice = orderItems.reduce((total, item) => total + item.price, 0);

  // Order timeline data
  const steps = [
    { label: "Ordered On 8 Sept 2024", status: "completed" },
    { label: "Ready To Ship", status: "current" },
    { label: "Estimate Delivery 28 Sept 2024", status: "pending" },
  ];

  return (
    <Container>
      <Header
        title={"Confirmed"}
        showBackButton={true}
        rightIcon1={<CartIcon />}
        rightIcon2={<ShopIcon fill="white" />}
      />

      <View style={styles.container}>
        <Text style={styles.mainText}>Thanks You For Your Order</Text>

        {/* Order Summary Section */}
        <TouchableOpacity
          style={styles.orderSummaryHeader}
          onPress={() => setShowOrderSummary(!showOrderSummary)}
        >
          <Text style={styles.orderSummaryTitle}> Order Summary</Text>
          <Text style={styles.totalPrice}>$ {totalPrice.toFixed(2)}</Text>
        </TouchableOpacity>

        {showOrderSummary && (
          <View style={styles.orderSummaryContent}>
            {orderItems.map((item, index) => (
              <View key={index} style={styles.orderItemContainer}>
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemInfo}>Weight: {item.weight}</Text>
                  <Text style={styles.itemInfo}>Quantity: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Delivery Timeline Section */}
        <View style={styles.deliverySection}>
          <Text style={styles.sectionTitle}>Estimated Delivery</Text>

          <View style={styles.timelineContainer}>
            {steps.map((step, index) => (
              <View key={index} style={styles.timelineStep}>
                <View style={styles.timelineDotContainer}>
                  <View
                    style={[
                      styles.timelineDot,
                      step.status === "completed" && styles.completedDot,
                      step.status === "current" && styles.currentDot,
                      step.status === "pending" && styles.pendingDot,
                    ]}
                  />
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        step.status === "completed" && styles.completedLine,
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.timelineText,
                    step.status === "completed" && styles.completedText,
                    step.status === "current" && styles.currentText,
                    step.status === "pending" && styles.pendingText,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Container>
  );
};

export default CompletedOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  mainText: {
    color: "#f8f8f8",
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 20,
  },
  orderSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  orderSummaryTitle: {
    color: "#f8f8f8",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
  },
  totalPrice: {
    color: colors.green,
    fontSize: FontSize.small,
    fontFamily: "Poppins-Bold",
  },
  orderSummaryContent: {
    backgroundColor: "#1E1E1E",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
  },
  orderItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#000",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    color: "#f8f8f8",
    fontSize: FontSize.small,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 3,
  },
  itemInfo: {
    color: "#AFAFAF",
    fontSize: FontSize.xxsmall,
    fontFamily: "Poppins-Regular",
    marginBottom: 2,
  },
  itemPrice: {
    color: colors.green,
    fontSize: FontSize.small,
    fontFamily: "Poppins-Bold",
    marginLeft: 10,
  },
  deliverySection: {
    marginTop: 30,
  },
  sectionTitle: {
    color: "#f8f8f8",
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 20,
  },
  timelineContainer: {
    marginLeft: 10,
  },
  timelineStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  timelineDotContainer: {
    alignItems: "center",
    marginRight: 15,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  completedDot: {
    backgroundColor: colors.green,
  },
  currentDot: {
    backgroundColor: "#f8f8f8",
  },
  pendingDot: {
    backgroundColor: "#666",
  },
  timelineLine: {
    width: 1,
    height: 40,
    backgroundColor: "#666",
    marginTop: 5,
  },
  completedLine: {
    backgroundColor: colors.green,
  },
  timelineText: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Medium",
    marginTop: -2,
  },
  completedText: {
    color: "#f8f8f8",
  },
  currentText: {
    color: "#f8f8f8",
  },
  pendingText: {
    color: "#AFAFAF",
  },
});

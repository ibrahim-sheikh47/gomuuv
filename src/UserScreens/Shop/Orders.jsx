import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";
import Container from "../../components/Container";
import Header from "../../components/Header";
import images from "../../constants/images";
import { colors } from "../../constants/colors";
import { FontSize } from "../../utils/font";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import moment from "moment";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Orders = () => {
  const { token } = useSelector((state) => state.Auth);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const fetchOrders = async () => {
    try {
      const response = await API.get(END_POINTS.ORDERS, null, token);
      if (response?.data?.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedOrder(orderId === expandedOrder ? null : orderId);
  };

  const getSubtotal = (price, quantity) => price * quantity;

  return (
    <Container>
      <Header title="My Orders" showBackButton />
      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>No ongoing orders available.</Text>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            return (
              <View key={order._id} style={styles.orderContainer}>
                <TouchableOpacity
                  onPress={() => toggleExpand(order._id)}
                  style={styles.orderHeader}
                >
                  <View>
                    <Text style={styles.orderId}>
                      Order #{order._id.substring(0, 8)}
                    </Text>
                    <Text style={styles.status}>Status: {order.status}</Text>
                  </View>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.expandToggle}>
                      {isExpanded ? "▲" : "▼"}
                    </Text>
                    <Text style={[styles.status, {color: "#c2c2c2"}]}>{moment(order.createdAt).format("DD/MM/yy - h:ss A")}</Text>
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.orderDetails}>
                    {Array.isArray(order.cartItems) &&
                      order.cartItems.map((item, idx) => {
                        const subtotal = getSubtotal(
                          item.product.price,
                          item.quantity
                        );
                        return (
                          <View
                            key={idx}
                            style={[
                              styles.itemContainer,
                              idx == order.cartItems.length - 1 && {
                                borderBottomWidth: 0,
                              },
                            ]}
                          >
                            <Image
                              source={
                                item?.product?.image
                                  ? { uri: item.product.image }
                                  : images.product1
                              }
                              style={[
                                styles.image,
                                { width: width * 0.25, height: width * 0.2 },
                              ]}
                              resizeMode="cover"
                            />
                            <View style={styles.itemInfo}>
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.itemName,
                                  isSmallScreen && { fontSize: FontSize.small },
                                ]}
                              >
                                {item.product.name}
                              </Text>
                              <Text style={styles.itemDetails}>
                                Qty: {item.quantity}
                              </Text>
                              <Text style={styles.itemDetails}>
                                Price: ${subtotal.toFixed(2)}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    <Text
                      style={[
                        styles.totalLabel,
                        styles.totalRow,
                        { fontSize: FontSize.medium },
                      ]}
                    >
                      Contact Information:
                    </Text>

                    <View style={styles.totalRow}>
                      <Text
                        style={[
                          styles.totalLabel,
                          { fontSize: FontSize.small },
                        ]}
                      >
                        Email:
                      </Text>
                      <Text style={styles.totalValue}>
                        {order.contact.email}
                      </Text>
                    </View>

                    <View style={styles.totalRowBorderless}>
                      <Text
                        style={[
                          styles.totalLabel,
                          { fontSize: FontSize.small },
                        ]}
                      >
                        Address:
                      </Text>
                      <Text style={styles.totalValue}>
                        {order.contact.address}
                      </Text>
                    </View>

                    <View style={styles.totalRowBorderless}>
                      <Text style={styles.totalLabel}>Phone:</Text>
                      <Text style={styles.totalValue}>
                        {order.contact.phone}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.totalLabel,
                        styles.totalRow,
                        { fontSize: FontSize.medium },
                      ]}
                    >
                      Payment Information:
                    </Text>

                    <View style={styles.totalRow}>
                      <Text
                        style={[
                          styles.totalLabel,
                          { fontSize: FontSize.small },
                        ]}
                      >
                        Payment Method:
                      </Text>
                      <Text style={styles.totalValue}>
                        {order.payment.method}
                      </Text>
                    </View>

                    <View style={styles.totalRowBorderless}>
                      <Text
                        style={[
                          styles.totalLabel,
                          { fontSize: FontSize.small },
                        ]}
                      >
                        Shipping Charges:
                      </Text>
                      <Text style={styles.totalValue}>
                        ${order.shipping.charges}
                      </Text>
                    </View>

                    <View style={styles.totalRowBorderless}>
                      <Text style={styles.totalLabel}>Sub Total:</Text>
                      <Text style={styles.totalValue}>
                        ${order.payment.amount}
                      </Text>
                    </View>

                    <View style={styles.totalRowBorderless}>
                      <Text
                        style={[
                          styles.totalLabel,
                          { fontSize: FontSize.large },
                        ]}
                      >
                        Gross Total:
                      </Text>
                      <Text style={styles.totalValue}>
                        ${order.payment.amount + order.shipping.charges}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    color: "#fff",
    fontSize: FontSize.medium,
    marginTop: 50,
  },
  orderContainer: {
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    marginBottom: 15,
    padding: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderId: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: FontSize.medium,
  },
  status: {
    color: colors.green,
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
    marginTop: 2,
  },
  expandToggle: {
    fontSize: FontSize.medium,
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  orderDetails: {
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#333",
    paddingBottom: 10,
  },
  image: {
    borderRadius: 10,
  },
  itemInfo: {
    marginLeft: 10,
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: FontSize.regular,
  },
  itemDetails: {
    color: "#aaa",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  totalRowBorderless: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#444",
  },
  totalLabel: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  totalValue: {
    color: colors.green,
    fontFamily: "Poppins-Bold",
  },
});

export default Orders;

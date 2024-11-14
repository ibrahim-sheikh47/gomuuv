import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors } from "../../constants/colors";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import { MaterialIcons } from "@expo/vector-icons"; // Importing Chevron icon (expo icons)
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import { useNavigation } from "@react-navigation/native";

const ProductDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { product } = route.params;

  // State to manage quantity
  const [quantity, setQuantity] = useState(1);

  // State to toggle detailed specifications visibility
  const [showSpecifications, setShowSpecifications] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);

  // Function to increment quantity
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Function to decrement quantity
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // Function to toggle the Detailed Specifications section
  const toggleSpecifications = () => {
    setShowSpecifications((prevState) => !prevState);
  };
  const handleAddToCart = () => {
    setModalVisible(true); // Show the modal
    setTimeout(() => {
      navigation.navigate("Cart", { product, quantity });
    }, 3000);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate("Cart", { product, quantity });
  };

  const handleCheckout = () => {
    navigation.navigate("Checkout", {
      productImage: product.productImage,
      title: product.title,
      quantity: quantity,
      weight: product.weight,
      price: product.amount,
    });
  };
  return (
    <Container>
      <Header
        title={"Shop"}
        showBackButton={true}
        rightIcon1={icons.cart}
        rightIcon2={icons.cart2}
      />

      <ScrollView style={{ marginBottom: 30 }}>
        <Image source={product.productImage} style={styles.image} />

        <View style={styles.productInfo}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={[styles.title, { color: colors.green }]}>
            {`$${product.amount}`}
          </Text>
        </View>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.quantityContainer}>
          <Text style={styles.title}>Quantity</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity onPress={decreaseQuantity} style={styles.button}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={increaseQuantity} style={styles.button}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.title, { marginBottom: 0 }]}>Features</Text>
        <View style={styles.featuresList}>
          {product.features.map((feature, index) => (
            <Text key={index} style={styles.detailText}>
              • {feature}
            </Text>
          ))}
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Dimensions:</Text>
          <Text style={styles.detailText}>{product.dimensions}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Weight:</Text>
          <Text style={styles.detailText}>{product.weight}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Materials:</Text>
          <Text style={styles.detailText}>{product.materials}</Text>
        </View>

        {/* Collapsible Detailed Specifications */}
        <View>
          <TouchableOpacity
            onPress={toggleSpecifications}
            style={styles.chevronContainer}
          >
            <Text style={styles.title}>Detailed Specifications</Text>
            <MaterialIcons
              name={
                showSpecifications ? "keyboard-arrow-up" : "keyboard-arrow-down"
              }
              size={24}
              color="white"
            />
          </TouchableOpacity>

          {showSpecifications && (
            <View
              style={{
                backgroundColor: "#171717",
                padding: 16,
                borderRadius: 10,
              }}
            >
              <View style={styles.detailRow}>
                <Text style={styles.detailHeading}>Weight Range:</Text>
                <Text style={styles.detailText}>{product.weightRange}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailHeading}>Audience:</Text>
                <Text style={styles.detailText}>{product.audience}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailHeading}>Warranty:</Text>
                <Text style={styles.detailText}>{product.warranty}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailHeading}>Manufacturer:</Text>
                <Text style={styles.detailText}>{product.manufacturer}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <CustomButton title={"Add to Cart"} onPress={handleAddToCart} />
      <CustomButton
        onPress={handleCheckout}
        title={"Proceed to Checkout"}
        style={{
          backgroundColor: "transparent",
          borderColor: colors.green,
          borderWidth: 2,
        }}
        textStyle={{ color: colors.green }}
      />
      <CustomModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        modalIcon={icons.addedToCart}
        modalText={"Item added to cart!"}
      />
    </Container>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins-Bold",
    marginVertical: 10,
  },
  description: {
    fontSize: 12,
    color: "#AFAFAF",
    fontFamily: "Poppins-Regular",
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
  },
  button: {
    backgroundColor: "#2D2D2F",
    borderRadius: 100,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  quantityText: {
    fontSize: 14,
    color: colors.green,
    fontFamily: "Poppins-Bold",
    marginHorizontal: 16,
  },
  chevronContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  detailHeading: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  detailText: {
    fontSize: 12,
    width: 150,
    color: "#AFAFAF",
    fontFamily: "Poppins-Regular",
  },
  featuresList: {
    flexDirection: "column",
    marginLeft: 10,
    marginVertical: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
});

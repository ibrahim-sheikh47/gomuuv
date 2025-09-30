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
import { AntDesign, MaterialIcons } from "@expo/vector-icons"; // Importing Chevron icon (expo icons)
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import { useNavigation } from "@react-navigation/native";
import CartIcon from "../../assets/svgs/CartIcon";
import ShopIcon from "../../assets/svgs/ShopIcon";
import images from "../../constants/images";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { useDispatch, useSelector } from "react-redux";
import { setCartData } from "../../redux/reducers/CartSlice";
import Toast from "react-native-toast-message";
import { FontSize } from "../../utils/font";

const ProductDetailScreen = ({ route }) => {
  const dispatch = useDispatch(); // Initialize dispatch
  const navigation = useNavigation();
  const { product } = route.params;

  const { token } = useSelector((state) => state.Auth);
  const { data: cartItems } = useSelector((state) => state.Cart);
  let items = Array.isArray(cartItems) ? [...cartItems] : [];

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
    items.push({ product: product });
    dispatch(setCartData(items));
    addToCart(product);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const addToCart = async (item) => {
    const payload = {
      products: [
        {
          id: item?._id,
          quantity: quantity,
        },
      ],
    };

    try {
      const response = await API.post(END_POINTS.ADD_TO_CART, payload, token);

      if (response?.data?.success) {
        setModalVisible(true);
        const cartItems = response?.data?.data?.items;
        dispatch(setCartData(cartItems));
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate("Cart");
        }, 1000);
      } else {
        // Show error toast if success is false
        Toast.show({
          type: "error",
          text1: "Add to Cart Failed",
          text2: response?.data?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = () => {
    navigation.navigate("Checkout", {
      productImage: product?.image || images.product1,
      title: product?.name,
      quantity: quantity,
      weight: product?.weight,
      price: product?.price,
    });
  };
  return (
    <Container>
      <Header title={"Shop"} showBackButton={true} rightIcon1={<CartIcon />} />

      <ScrollView
        style={{ marginBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={product?.image ? { uri: product?.image } : images.product1}
          style={styles.image}
        />

        <View style={styles.productInfo}>
          <Text style={styles.title}>{product?.name}</Text>
          <Text style={[styles.title, { color: colors.green }]}>
            {`$${product?.price}`}
          </Text>
        </View>
        <Text style={styles.description}>{product?.description}</Text>

        <View style={styles.quantityContainer}>
          <Text style={styles.title}>Quantity</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity onPress={decreaseQuantity} style={styles.button}>
              <AntDesign name="minus" size={16} color={"white"} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={increaseQuantity} style={styles.button}>
              <AntDesign name="plus" size={16} color={"white"} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.title, { marginBottom: 0 }]}>Features</Text>
        <View style={styles.featuresList}>
          {product?.features.map((feature, index) => (
            <Text key={index} style={styles.detailText}>
              • {feature}
            </Text>
          ))}
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Dimensions:</Text>
          <Text style={styles.detailText}>{product?.dimensions}</Text>
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
                <Text style={styles.detailText}>
                  {product?.detailedSpecifications?.weightRange}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailHeading}>Audience:</Text>
                <Text style={styles.detailText}>
                  {product?.detailedSpecifications?.audience}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailHeading}>Warranty:</Text>
                <Text style={styles.detailText}>
                  {product?.detailedSpecifications?.warranty}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailHeading}>Manufacturer:</Text>
                <Text style={styles.detailText}>
                  {product?.detailedSpecifications?.manufacturer}
                </Text>
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
        modalIcon={<CartIcon width={50} height={50} />}
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
    fontSize: FontSize.medium,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    marginVertical: 10,
  },
  description: {
    fontSize: FontSize.small,
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
    fontSize: FontSize.large,
  },
  quantityText: {
    fontSize: FontSize.regular,
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
    fontSize: FontSize.small,
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
  detailText: {
    fontSize: FontSize.small,
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
    fontSize: FontSize.medium,
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
});

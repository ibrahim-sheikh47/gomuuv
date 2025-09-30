// ProductSection.js
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ShopItem from "./ShopItem";
import images from "../constants/images";
import CustomModal from "./CustomModal";
import CartIcon from "../assets/svgs/CartIcon";
import { API } from "../config/apiClient";
import { END_POINTS } from "../config/routes";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { setCartData } from "../redux/reducers/CartSlice";
import { FontSize } from "../utils/font";

const ProductSection = ({ title, products }) => {
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  // Combine all useSelector Hooks
  const { token, cartItems } = useSelector((state) => ({
    token: state.Auth?.token,
    cartItems: state.Cart?.data,
  }));

  let items = Array.isArray(cartItems) ? [...cartItems] : [];

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const addToCart = async (item) => {
    const payload = {
      products: [
        {
          id: item?._id,
          quantity: 1,
        },
      ],
    };

    try {
      const response = await API.post(END_POINTS.ADD_TO_CART, payload, token);

      if (response?.data?.success) {
        const cartItems = response?.data?.data?.items;
        dispatch(setCartData(cartItems));
        setModalVisible(true);
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

  const renderItem = ({ item }) => (
    <ShopItem
      productImage={item?.image}
      title={item.name}
      amount={item?.price}
      onPress={() => {
        // items.push({ product: item });
        // dispatch(setCartData(items));
        addToCart(item);
      }} // Optional, can be removed
      product={item} // Pass the entire product object
    />
  );

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.horizontalList}>
        <FlatList
          data={products || []}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item?._id?.toString() || index.toString()
          }
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <CustomModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        modalIcon={<CartIcon width={50} height={50} />}
        modalText={"Item added to cart!"}
      />
    </View>
  );
};

export default ProductSection;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
    color: "white",
    marginTop: 20,
  },
  horizontalList: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
});

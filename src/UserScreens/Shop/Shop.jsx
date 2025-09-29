import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CartIcon from "../../assets/svgs/CartIcon";
import ShopIcon from "../../assets/svgs/ShopIcon";
import Container from "../../components/Container";
import CustomModal from "../../components/CustomModal";
import Header from "../../components/Header";
import ProductSection from "../../components/ProductSection";
import Selectable from "../../components/Selectable";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import {
  setCategoriesData,
  setProductsData,
} from "../../redux/reducers/ShopSlice";

const ShopScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.Auth);

  const { categories: categoriesArr, products: productsArr } = useSelector(
    (state) => state.Shop
  );
  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  const [categories, setCategories] = useState(categoriesArr || []);
  const [products, setProducts] = useState(productsArr || []);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isModalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category.name === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

  const fetchData = async () => {
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        API.get(END_POINTS.GET_CATEGORIES, undefined, token),
        API.get(END_POINTS.GET_ALL_PRODUCTS, undefined, token),
      ]);

      if (categoriesResponse?.data?.success) {
        dispatch(setCategoriesData(categoriesResponse?.data?.data));
        setCategories(categoriesResponse?.data?.data);
      }

      if (productsResponse?.data?.success) {
        dispatch(setProductsData(productsResponse?.data?.data));
        setProducts(productsResponse?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // navigation.navigate("Cart", { product, quantity });
  };

  return (
    <Container>
      <Header
        showBackButton
        title="Shop"
        rightIcon1={<CartIcon />}
        rightIcon1Press={() => {
          navigation.navigate("Orders");
        }}
        rightIcon2Press={() => {
          navigation.navigate("Cart");
        }}
        rightIcon2={<ShopIcon fill="#fff" />}
      />

      {/* Use ScrollView to enable scrolling for the entire screen */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Search Bar */}
        {/* <SearchBar searchQuery={searchQuery} onChangeSearch={onChangeSearch} /> */}
        {/* Categories Filter */}
        <Selectable
          items={["All", ...categories.map((cat) => cat.name)]}
          selectedItem={selectedCategory}
          setSelectedItem={setSelectedCategory}
          label="Categories"
          description="Filter by category"
        />
        {/* Render Product Sections */}
        {categories
          .filter(
            (category) =>
              selectedCategory === "All" || category?.name === selectedCategory
          )
          .filter((category) =>
            products.some((product) => product?.category?._id === category?._id)
          )
          .map((category) => (
            <ProductSection
              key={category?._id}
              title={category?.name}
              products={products.filter(
                (product) =>
                  product?.category?._id === category?._id &&
                  (selectedCategory === "All" ||
                    product?.category?.name === selectedCategory)
              )}
            />
          ))}

        {categories
          .filter(
            (category) =>
              selectedCategory === "All" || category?.name === selectedCategory
          )
          .filter((category) =>
            products.some((product) => product?.category?._id === category?._id)
          ).length === 0 && (
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              justifyContent: "center",
              marginTop: 30,
            }}
          >
            No products available.
          </Text>
        )}
      </ScrollView>
      <CustomModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        modalIcon={<CartIcon width={50} height={50} />}
        modalText={"Item added to cart!"}
      />
    </Container>
  );
};

export default ShopScreen;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1, // Ensures ScrollView can expand and accommodate all content
    paddingBottom: 20, // Optional: Adds some padding at the bottom
  },
});

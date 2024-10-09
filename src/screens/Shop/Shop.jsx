import { StyleSheet, View, ScrollView } from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import Selectable from "../../components/Selectable";
import ProductSection from "../../components/ProductSection";
import images from "../../constants/images";
import icons from "../../constants/icons";
import { shopProducts } from "../../utils/data";
const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  const duration = ["All", "Fitness Gear", "Supplements"];
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const filterProductsByType = (type) =>
    shopProducts.filter((shopProduct) => shopProduct.type === type);

  return (
    <Container>
      <Header
        title="Shop"
        showBackButton={true}
        rightIcon1={icons.cart}
        rightIcon2={icons.cart2}
      />

      {/* Use ScrollView to enable scrolling for the entire screen */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} onChangeSearch={onChangeSearch} />

        <Selectable
          items={duration}
          selectedItem={selectedPeriod}
          setSelectedItem={setSelectedPeriod}
          label="Discount Offer"
          description="Choose discount on your portfolio"
        />

        {/* Recommended Products Section */}
        <ProductSection
          title="Recommended for You"
          products={filterProductsByType("recommended")}
        />

        {/* Fitness Gear Section */}
        <ProductSection
          title="Fitness Gear"
          products={filterProductsByType("fitness")}
        />

        {/* Supplements Section */}
        <ProductSection
          title="Supplements"
          products={filterProductsByType("supplements")}
        />
      </ScrollView>
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

// ProductSection.js
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ShopItem from "./ShopItem";

const ProductSection = ({ title, products }) => {
  const renderItem = ({ item }) => (
    <ShopItem
      productImage={item.productImage}
      title={item.title}
      amount={item.amount}
      onPress={() => console.log(`${item.title} pressed`)} // Optional, can be removed
      product={item} // Pass the entire product object
    />
  );

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.horizontalList}>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default ProductSection;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
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

// MealCategorySelector.js

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";

const MealCategorySelector = ({ categories, selectedCategory, onSelect }) => {
  return (
    <View style={styles.cardContainer}>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.card]}
          onPress={() => onSelect(index)}
        >
          <View style={styles.iconContainer}>{category.icon}</View>
          <Text style={[styles.cardText]}>{category.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#242425",
  },
  cardText: {
    fontSize: 12,
    marginBottom: 5,
    color: "#fff",
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default MealCategorySelector;

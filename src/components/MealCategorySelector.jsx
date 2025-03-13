// MealCategorySelector.js

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MealCategorySelector = ({ categories, selectedCategory, onSelect }) => {
  return (
    <View style={styles.cardContainer}>
      {categories.map((category, index) => {
        const isSelected = selectedCategory === index;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={() => onSelect(index)}
          >
            <View style={styles.iconContainer}>{category.icon}</View>
            <Text style={[styles.cardText, isSelected && styles.selectedText]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
  selectedCard: {
    backgroundColor: "#F5F5F5", // Highlight selected card
  },
  cardText: {
    fontSize: 12,
    marginBottom: 5,
    color: "#fff",
  },
  selectedText: {
    color: "#242425",
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

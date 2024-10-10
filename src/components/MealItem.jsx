import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import icons from "../constants/icons";

export const MealItem = ({
  title,
  mealName,
  mealImage,
  calories,
  time,
  onPress,
  style,
  showDelIcon,
}) => {
  return (
    <TouchableOpacity style={[styles.mealContainer, style]} onPress={onPress}>
      <Image source={mealImage} style={styles.mealImage} />
      <View style={styles.mealDetails}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.mealTitle}>{title}</Text>
          {showDelIcon && (
            <TouchableOpacity>
              <Ionicons name="trash-outline" size={15} color="#AFAFAF" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.mealName}>{mealName}</Text>
        <View style={styles.mealStats}>
          <View style={styles.statItem}>
            <Image style={styles.statIcon} source={icons.burned} />
            <Text style={styles.statText}>{calories} kcal</Text>
          </View>
          <View style={styles.statItem}>
            <Image style={styles.statIcon} source={icons.time} />
            <Text style={styles.statText}>{time} mins</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mealContainer: {
    marginTop: 10,
    backgroundColor: "#242425",
    height: 100,
    width: 260,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  mealImage: {
    width: 75,
    height: 75,
    borderRadius: 15,
  },
  mealDetails: {
    flex: 1,
    gap: 5,
  },
  mealTitle: {
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    fontSize: 12,
  },
  mealName: {
    fontFamily: "Poppins-Regular",
    color: "#F8F8F8",
    fontSize: 12,
  },
  mealStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  statText: {
    fontFamily: "Poppins-Regular",
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
});

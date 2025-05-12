import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import CaloriesIcon from "../assets/svgs/CaloriesIcon";
import TimeIcon from "../assets/svgs/TimeIcon";
import images from "../constants/images";
import { FontSize } from "../utils/font";

export const MealItem = ({
  title,
  mealId,
  mealName,
  mealImage,
  calories,
  time,
  onPress,
  style,
  iconType, // New prop for icon type
  forFinalizePlan, // New prop to check if used for Finalize Plan
  isAdded,
  handleAddRemove,
  onDelete,
  mealItemOrientation,
}) => {
  // Check if the mealImage is a valid URL or an object with a URI
  const imageSource =
    mealImage && (typeof mealImage === "string" || mealImage?.uri)
      ? { uri: mealImage?.uri || mealImage }
      : images.lunch;

  return (
    <TouchableOpacity style={[styles.mealContainer, style]} onPress={onPress}>
      <Image source={imageSource} style={styles.mealImage} />
      <View style={styles.mealDetails}>
        <View style={styles.row}>
          <Text
            style={[
              styles.mealTitle,
              {
                maxWidth: mealItemOrientation === "Horizontal" ? "100%" : "80%",
              },
            ]}
            numberOfLines={2}
          >
            {mealName}
          </Text>
          {!forFinalizePlan && iconType === "delete" && (
            <TouchableOpacity onPress={() => onDelete(mealId)}>
              <Ionicons name="trash-outline" size={15} color="#AFAFAF" />
            </TouchableOpacity>
          )}
          {!forFinalizePlan && iconType === "next" && (
            <TouchableOpacity>
              <View style={styles.nextIcon}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={15}
                  color="#121212"
                />
              </View>
            </TouchableOpacity>
          )}
          {forFinalizePlan && (
            <TouchableOpacity
              style={[
                styles.addRemoveButton,
                isAdded ? styles.removeButton : styles.addButton,
              ]}
              onPress={handleAddRemove}
            >
              <Text style={styles.buttonText}>
                {isAdded ? "Remove" : "Add"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.mealName}>{title || ""}</Text>
        <View style={styles.mealStats}>
          <View style={styles.statItem}>
            <CaloriesIcon width={16} height={16} />
            <Text style={styles.statText}>{calories} kcal</Text>
          </View>
          <View style={styles.statItem}>
            <TimeIcon />
            <Text style={styles.statText}>{time}</Text>
          </View>
          {forFinalizePlan && (
            <TouchableOpacity>
              <View style={styles.nextIcon}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={15}
                  color="#121212"
                />
              </View>
            </TouchableOpacity>
          )}
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mealTitle: {
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    fontSize: FontSize.small,
    maxWidth: "80%",
  },
  mealName: {
    fontFamily: "Poppins-Regular",
    color: "#F8F8F8",
    fontSize: FontSize.small,
  },
  mealStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    gap: 3,
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
    fontSize: FontSize.small,
    marginTop: 2,
  },
  nextIcon: {
    backgroundColor: colors.green,
    borderRadius: 50,
    padding: 5,
  },
  addRemoveButton: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addButton: {
    backgroundColor: colors.green,
  },
  removeButton: {
    backgroundColor: "red",
  },
  buttonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: FontSize.small,
  },
});

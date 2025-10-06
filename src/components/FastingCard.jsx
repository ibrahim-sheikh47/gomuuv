import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import { colors } from "../constants/colors";
import { useEffect } from "react";
import { FontSize } from "../utils/font";

export const FastingCard = ({ plan, currentPlan }) => {
  const navigation = useNavigation();
  const handlePlanSelect = (event) => {
    event.persist();
    navigation.navigate("FastingPlanDetail", {
      selectedPlan: plan,
      currentPlan,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePlanSelect}>
      <View style={styles.cardDurationContainer}>
        <Text style={styles.cardDuration}>{plan?.type}</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {plan?.name}
        </Text>
        <Text style={styles.cardDescription}>{plan?.description}</Text>
      </View>
      <IconButton
        icon="chevron-right"
        size={20} // Adjust the size as needed
        color="#aaa" // Adjust the color as needed
        style={styles.nextIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 102,
    backgroundColor: colors.bgColor,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16, // Add margin for spacing between cards
  },
  cardDurationContainer: {
    height: 80,
    width: 80,
    backgroundColor: "#1D1D1D",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  cardDuration: {
    color: colors.green,
    fontSize: FontSize.xxlarge,
    fontFamily: "Poppins-Bold",
  },
  cardDetails: {
    width: 160,
    marginLeft: 20,
  },
  cardTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: FontSize.medium,
    color: "#f8f8f8",
  },
  cardDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.xxsmall,
    color: "#A4A4A4",
    marginTop: 10,
  },
  cardIcon: {
    width: 23,
    height: 23,
    marginTop: "auto",
    marginLeft: "auto",
    marginBottom: 20,
  },
  nextIcon: {
    marginLeft: "auto",
    marginTop: "auto",
    marginBottom: 10,
    backgroundColor: colors.green,
  },
});

import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import { colors } from "../constants/colors";
import { useEffect } from "react";
import { FontSize } from "../utils/font";
import moment from "moment";
import { getResponsiveFontSize } from "../utils/utilities";
import icons from "../constants/icons";

export const FastingCard = ({ plan, currentPlan, scheduledDate }) => {
  const navigation = useNavigation();
  const handlePlanSelect = (event) => {
    event.persist();
    navigation.navigate("FastingPlanDetail", {
      selectedPlan: plan,
      currentPlan,
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={!scheduledDate ? handlePlanSelect : null}
      activeOpacity={!scheduledDate ? 0.7 : 1}
    >
      <View style={styles.cardDurationContainer}>
        <Text style={styles.cardDuration}>{plan?.type}</Text>
      </View>
      <View style={[styles.cardDetails, { flex: 1 }]}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {plan?.name}
        </Text>
        <Text style={styles.cardDescription}>{plan?.description}</Text>
      </View>
      {!scheduledDate && (
        <IconButton
          icon="chevron-right"
          size={20} // Adjust the size as needed
          color="#aaa" // Adjust the color as needed
          style={styles.nextIcon}
        />
      )}

      {scheduledDate && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexShrink: 1,
            alignSelf: "flex-end",
            gap: getResponsiveFontSize(5),
          }}
        >
          <Image
            source={icons.iconCalendar}
            style={{ width: 14, height: 14, resizeMode: "contain" }}
          />

          <Text style={styles.scheduledDate}>
            {moment(scheduledDate).format("DD MMM, YYYY")}
            {"\n"}
            {moment(scheduledDate).format("h:mm A")}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: getResponsiveFontSize(15),
    backgroundColor: colors.bgColor,
    borderRadius: getResponsiveFontSize(15),
    flexDirection: "row",
    gap: getResponsiveFontSize(5),
    alignItems: "center",
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
    alignSelf: "flex-end",
    backgroundColor: colors.green,
  },
  scheduledDate: {
    flexShrink: 1,
    color: "gray",
    fontSize: FontSize.small,
    flexWrap: "wrap", // enables line wrapping
    textAlign: "center",
  },
});

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import icons from "../constants/icons";
import { colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";

export const FastingCard = ({ plan, selectedPlan }) => {
  const navigation = useNavigation();
  const handlePlanSelect = (event) => {
    event.persist();
    navigation.navigate("FastingPlanDetail", {
      selectedPlan: plan,
      title: plan.title,
      duration: plan.duration,
      remain: plan.remain,
      description: plan.description,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePlanSelect}>
      <View style={styles.cardDurationContainer}>
        <Text style={styles.cardDuration}>
          {plan.duration}:{plan.remain}
        </Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{plan.title}</Text>
        <Text style={styles.cardDescription}>{plan.description}</Text>
      </View>
      <Image source={icons.nextBg} style={styles.cardIcon} />
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
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  cardDetails: {
    width: 160,
    marginLeft: 20,
  },
  cardTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#f8f8f8",
  },
  cardDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
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
});

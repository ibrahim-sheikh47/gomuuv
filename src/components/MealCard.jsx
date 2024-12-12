import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

const MealCard = ({ icon: MealIcon, label, type, style, textStyle }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => navigation.navigate("AddMealDetails", { label, type })}
    >
      <MealIcon width={46} height={46} />
      <Text style={[styles.cardText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};
export default MealCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#242425",
    height: 163,
    width: "48%", // Ensures two cards fit per row
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    fontFamily: "Poppins-Bold",
  },
});

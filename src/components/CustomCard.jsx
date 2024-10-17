import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

export const CustomCard = ({
  label,
  icon,
  goal,
  children,
  message,
  onPress,
}) => (
  <TouchableOpacity style={styles.activityCard} onPress={onPress}>
    <View style={styles.activityCardContent}>
      <Text
        style={{ color: "#fff", fontSize: 12, fontFamily: "Poppins-SemiBold" }}
      >
        {label}
      </Text>
      <Image style={styles.iconImage} source={icon} />
    </View>

    <View style={{ flex: 1, paddingHorizontal: 10 }}>{children}</View>
    <View>
      <Text
        style={{
          color: "#F8F8F8",
          fontSize: 9,
          paddingHorizontal: 14,
          marginBottom: 10,
          fontFamily: "Poppins-Regular",
        }}
      >
        <Text>{goal}</Text>
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  activityCard: {
    flex: 1,
    backgroundColor: colors.bgColor,
    height: 170,
    borderRadius: 14,
  },
  activityCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  cardMessage: {
    color: "#F8F8F8",
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
    marginHorizontal: 20,
  },
});

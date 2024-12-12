import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

export const StatsHistoryCard = ({
  label,
  icon: StatsIcon,
  value,
  onPress,
}) => (
  <TouchableOpacity style={styles.activityCard} onPress={onPress}>
    <View style={styles.activityCardContent}>
      <Text
        style={{ color: "#F8F8F8", fontSize: 12, fontFamily: "Poppins-Bold" }}
      >
        {label}
      </Text>
      <StatsIcon width={20} height={20} />
    </View>

    <View>
      <Text
        style={{
          color: colors.green,
          fontSize: 24,
          paddingHorizontal: 14,
          marginBottom: 10,
          fontFamily: "Poppins-SemiBold",
        }}
      >
        <Text>{value}</Text>
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  activityCard: {
    flex: 1,
    backgroundColor: colors.bgColor,
    height: 98,
    borderRadius: 14,
  },
  activityCardContent: {
    flexDirection: "row",
    alignItems: "start",
    justifyContent: "space-between",
    padding: 14,
  },
  iconImage: {
    width: 16,
    height: 16,
  },
});

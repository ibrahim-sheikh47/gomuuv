import { Image, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";

export const ActivityCard = ({
  icon: ActivityIconComponent,
  label,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flex: 1,
      backgroundColor: colors.bgColor,
      height: 101,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    }}
  >
    <ActivityIconComponent />
    <Text style={{ color: "white", fontSize: FontSize.small }}>{label}</Text>
  </TouchableOpacity>
);

import { Image, Text, TouchableOpacity, View } from "react-native";

export const ActivityCard = ({ iconSource, label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flex: 1,
      backgroundColor: "#242425",
      height: 101,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    }}
  >
    <Image style={{ width: 30, height: 30 }} source={iconSource} />
    <Text style={{ color: "#fff" }}>{label}</Text>
  </TouchableOpacity>
);

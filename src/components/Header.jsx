import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have Ionicons installed
import IconButton from "./IconButton";
import icons from "../constants/icons";

const Header = ({ title, showBackButton, rightIcon1, rightIcon2 }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 20,
      }}
    >
      {/* Back Button */}
      <View style={{ flex: 1 }}>
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Centered Title */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontFamily: "Poppins-Bold",
          }}
        >
          {title}
        </Text>
      </View>

      {/* Right Icons */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 5,
        }}
      >
        {rightIcon1 && <IconButton iconSource={rightIcon1} />}
        {rightIcon2 && <IconButton iconSource={rightIcon2} />}
      </View>
    </View>
  );
};

export default Header;

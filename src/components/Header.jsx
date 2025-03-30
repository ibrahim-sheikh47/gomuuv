import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have Ionicons installed
import IconButton from "./IconButton";
import { FontSize } from "../utils/font";

const Header = ({
  title,
  showBackButton,
  rightIcon1,
  rightIcon2,
  rightIcon1Press,
  rightIcon2Press,
  cusStyle,
}) => {
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
          alignItems: "center",
          justifyContent: "center",
          width: 205,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: FontSize.regular,
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
        {rightIcon1 && (
          <IconButton
            cusStyle={cusStyle}
            icon={rightIcon1}
            onPress={rightIcon1Press}
          />
        )}
        {rightIcon2 && (
          <IconButton
            cusStyle={cusStyle}
            icon={rightIcon2}
            onPress={rightIcon2Press}
          />
        )}
      </View>
    </View>
  );
};

export default Header;

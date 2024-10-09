import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have Ionicons installed
import { colors } from "../constants/colors";
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
      {showBackButton && (
        <TouchableOpacity // Add padding for better touch area
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Centered Title */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            marginLeft: 30,
          }}
        >
          {title}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <IconButton iconSource={rightIcon1} />
        <IconButton iconSource={rightIcon2} />
      </View>
    </View>
  );
};

export default Header;

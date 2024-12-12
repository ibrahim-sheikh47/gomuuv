import { TouchableOpacity, Image } from "react-native";

const IconButton = ({ icon, onPress, cusStyle }) => {
  return <TouchableOpacity onPress={onPress}>{icon}</TouchableOpacity>;
};

export default IconButton;

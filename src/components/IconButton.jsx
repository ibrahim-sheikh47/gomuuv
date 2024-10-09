import { TouchableOpacity, Image } from "react-native";

const IconButton = ({ iconSource, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        style={{
          width: 24,
          height: 24,
        }}
        source={iconSource}
      />
    </TouchableOpacity>
  );
};

export default IconButton;

import { TouchableOpacity, Image } from "react-native";

const IconButton = ({ iconSource, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        style={{
          width: 20,
          height: 20,
        }}
        source={iconSource}
      />
    </TouchableOpacity>
  );
};

export default IconButton;

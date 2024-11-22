import { TouchableOpacity, Image } from "react-native";

const IconButton = ({ iconSource, onPress, cusStyle }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        style={[
          {
            width: 20,
            height: 20,
          },
          cusStyle,
        ]}
        source={iconSource}
      />
    </TouchableOpacity>
  );
};

export default IconButton;

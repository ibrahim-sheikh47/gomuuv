// ProfileSection.js
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";

const ProfileSection = ({ userName, imageSource, onPress }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
      onPress={onPress}
    >
      <Image
        source={imageSource}
        style={{
          width: 40,
          height: 40,
          borderColor: colors.green,
          borderRadius: 20,
          borderWidth: 2,
        }}
        onError={(e) => console.log(e.nativeEvent.error)}
      />
      <View>
        <Text
          style={{
            color: "#fff",
            fontSize: FontSize.medium,
            fontFamily: "Poppins-Medium",
          }}
        >
          Hello,
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: FontSize.medium,
            fontFamily: "Poppins-Bold",
          }}
        >
          {userName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileSection;

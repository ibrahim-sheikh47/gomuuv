// ProfileSection.js
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

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
      />
      <View>
        <Text
          style={{
            color: "#fff",
            fontSize: 14,
            fontFamily: "Poppins-Medium",
          }}
        >
          Hello,
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 14,
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

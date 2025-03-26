import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FontSize } from "../utils/font";

const BackHeader = ({ title, showBackButton }) => {
  const navigation = useNavigation();
  const onBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons name="chevron-back" size={22} color="#F8F8F8" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.iconPlaceholder} />
      </View>
    </View>
  );
};

export default BackHeader;

const styles = StyleSheet.create({
  header: {
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    color: "white",
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
  },
  iconPlaceholder: {
    width: 24, // Adjust this to match the size of the back icon
  },
  separator: {
    backgroundColor: "#1F2933",
    height: 1,
    width: "100%",
    marginTop: 8,
  },
});

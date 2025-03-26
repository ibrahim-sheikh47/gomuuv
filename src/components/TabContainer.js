import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";

const TabContainer = ({ activeTab, onTabClick, tabs }) => {
  return (
    <View style={styles.container}>
      <View style={styles.scrollContent}>
        <View
          style={{
            borderTopColor: colors.bgColor,
            borderTopWidth: 4,
            bottom: 5,
            width: "100%",
            position: "absolute",
          }}
        ></View>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => onTabClick(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && { color: "#fff" }, // Change text color for active tab
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TabContainer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 10,
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    position: "relative",
  },
  tabButton: {
    borderRadius: 30,
    height: 45,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.green,
    borderBottomWidth: 4,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
  },
  tabText: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-SemiBold",
    color: "white",
  },
});

import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import { colors } from "../../constants/colors";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import TabContainer from "../../components/TabContainer";
import Selectable from "../../components/Selectable";
import { useNavigation } from "@react-navigation/native";

const FastingScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Current Fast"); // Set initial active tab
  const tabs = ["Current Fast", "Stats and History"];

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Update the active tab
  };
  return (
    <Container>
      <Header
        title={"Fasting"}
        showBackButton={true}
        rightIcon1={icons.search}
      />

      <TabContainer
        activeTab={activeTab}
        onTabClick={handleTabClick}
        tabs={tabs}
      />

      {activeTab === "Current Fast" && (
        <View style={styles.content}>
          <Text style={{ color: "white" }}>Workout</Text>
        </View>
      )}
      {activeTab === "Stats and History" && (
        <View style={styles.content}>
          <Text style={{ color: "white" }}>Workout</Text>
        </View>
      )}
    </Container>
  );
};

export default FastingScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

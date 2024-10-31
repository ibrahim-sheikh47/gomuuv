import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import Selectable from "../../components/Selectable";

const SleepScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  return (
    <Container>
      <Header
        title={"Sleep Tracker"}
        rightIcon1={icons.shop}
        showBackButton={true}
      />
      <View style={{ marginTop: 20 }}>
        <Selectable
          items={["Today", "Weekly", "Monthly", "Yearly"]}
          selectedItem={selectedPeriod}
          setSelectedItem={setSelectedPeriod}
        />
      </View>
    </Container>
  );
};

export default SleepScreen;

const styles = StyleSheet.create({});

import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import Selectable from "../../components/Selectable";
import { colors } from "../../constants/colors";

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
        <View
          style={{
            marginTop: 20,
            height: 150,
            backgroundColor: colors.bgColor,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-Bold",
              color: "#f8f8f8",
            }}
          >
            Sleep Score
          </Text>
          <Text
            style={{
              fontSize: 36,
              fontFamily: "Poppins-Bold",
              color: colors.green,
            }}
          >
            56
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins-Bold",
              color: "#afafaf",
            }}
          >
            You slept better than "{} " % of users
          </Text>
        </View>

        <Text style={styles.sectionText}>Bed Time</Text>
        <View
          style={{
            marginTop: 20,
            height: 105,
            backgroundColor: colors.bgColor,
            borderRadius: 15,
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#afafaf",
            }}
          >
            Bedtime
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins-Regular",
              color: "#afafaf",
            }}
          >
            9:00 pm - 9:00 am
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              color: "#afafaf",
            }}
          >
            in <Text style={{ color: colors.green }}>6 hours and 22 min</Text>
          </Text>
        </View>
      </View>
    </Container>
  );
};

export default SleepScreen;

const styles = StyleSheet.create({
  sectionText: {
    color: "#fff",
    marginTop: 20,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});

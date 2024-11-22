import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import { colors } from "../../constants/colors";

const CompletedOrder = () => {
  const steps = [
    { label: "Ordered on 'Date'", isCompleted: true },
    { label: "Ready to Ship", isCompleted: true },
    { label: "Estimated Delivery 'Date'", isCompleted: false },
  ];

  return (
    <Container>
      <Header
        title={"Confirmed"}
        showBackButton={true}
        rightIcon1={icons.cart}
        rightIcon2={icons.cart2}
      />

      <View style={{ marginTop: 30 }}>
        <Text style={styles.mainText}>Thanks for your order</Text>
        <Text style={[styles.mainText, { marginTop: 50 }]}>
          Estimated Delivery
        </Text>

        <View style={{ marginTop: 20 }}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.iconLineContainer}>
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: step.isCompleted
                        ? colors.green
                        : "#f8f8f8",
                    },
                  ]}
                />
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.dottedLine,
                      {
                        borderColor: step.isCompleted
                          ? colors.green
                          : "#f8f8f8",
                      },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.stepText,
                  {
                    color: step.isCompleted ? "#f8f8f8" : "#AFAFAF",
                  },
                ]}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Container>
  );
};

export default CompletedOrder;

const styles = StyleSheet.create({
  mainText: {
    color: "#f8f8f8",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "start",
  },
  iconLineContainer: {
    alignItems: "center",
    marginRight: 14,
  },
  circle: {
    height: 16,
    width: 16,
    borderRadius: 30,
  },
  dottedLine: {
    height: 60,
    width: 1,
    borderStyle: "dotted",
    borderWidth: 1,
  },
  stepText: {
    color: "#f8f8f8",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginTop: -5,
  },
});

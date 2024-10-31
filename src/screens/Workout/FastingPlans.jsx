import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import { fastingPlans } from "../../utils/data";
import { FastingCard } from "../../components/FastingCard";

const FastingPlans = () => {
  const renderItem = ({ item }) => <FastingCard plan={item} />;

  return (
    <Container>
      <Header title={"Fasting Plans"} showBackButton={true} />

      <View style={{ marginTop: 40 }}>
        <Text style={styles.headerText}>Start A New Fasting Challenge</Text>
        <FlatList
          data={fastingPlans}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: "#f8f8f8",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },
  flatListContainer: {
    paddingBottom: 20, // Add padding for bottom spacing
  },
});

export default FastingPlans;

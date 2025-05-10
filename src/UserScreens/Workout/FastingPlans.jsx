import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Container from "../../components/Container";
import { FastingCard } from "../../components/FastingCard";
import Header from "../../components/Header";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { useSelector } from "react-redux";
import { FontSize } from "../../utils/font";
import { useRoute } from "@react-navigation/native";

const FastingPlans = (props) => {
  const route = useRoute();
  const { currentPlan } = route.params;

  const [fastingPlans, setFastingPlans] = useState([]);
  const { token } = useSelector((state) => ({
    token: state.Auth?.token,
  }));

  useEffect(() => {
    getAllFastingPlans();
  }, []);

  const getAllFastingPlans = async () => {
    try {
      const res = await API.get(END_POINTS.FASTING_PLANS, null, token);
      if (res?.data?.success) {
        setFastingPlans(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching history", error);
    }
  };

  const renderItem = ({ item }) => (
    <FastingCard plan={item} currentPlan={currentPlan} />
  );

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
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },
  flatListContainer: {
    paddingBottom: 20, // Add padding for bottom spacing
  },
});

export default FastingPlans;

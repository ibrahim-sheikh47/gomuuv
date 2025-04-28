// screens/WorkoutListScreen.js

import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "../../assets/svgs/SearchIcon";
import Container from "../../components/Container";
import Header from "../../components/Header";
import WorkoutCard from "../../components/WorkoutCard";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { setTrendingWorkouts } from "../../redux/reducers/WorkoutSlice";
import images from "../../constants/images";

const ViewAllWorkouts = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { category } = useRoute().params;

  const { token, trendingData } = useSelector((state) => ({
    token: state.Auth?.token,
    trendingData: state.Workout.trendingData,
  }));

  const getTrendingWorkouts = async () => {
    try {
      const res = await API.get(
        `${END_POINTS.WORKOUTS}${
          category ? "?equipments=" + category.value : ""
        }`,
        null,
        token
      );
      if (res.data.success) {
        dispatch(setTrendingWorkouts(res?.data?.data));
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    getTrendingWorkouts();
  }, []);

  const handleOnPress = (workout) => {
    // Navigate to the WorkoutDetail screen with the selected workout data
    navigation.navigate("WorkoutDetails", { workout });
  };

  const renderWorkoutCard = ({ item }) => {
    console.log("item", JSON.stringify(item, null, 2));
    return (
      <View style={{ marginBottom: 20 }}>
        <WorkoutCard
          title={item.name}
          calories={`${item?.calories}`}
          time={`${item?.workoutTime}`}
          category={item?.category}
          image={item?.image}
          onPress={() => handleOnPress(item)} // Pass the item to the handleOnPress function
        />
      </View>
    );
  };

  return (
    <Container>
      <Header
        title={category ? category.label : "Trending Workouts"}
        showBackButton={true}
        rightIcon1={<SearchIcon />}
      />
      <FlatList
        style={{ marginTop: 30 }}
        data={trendingData}
        renderItem={renderWorkoutCard}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{ paddingBottom: 20 }} // Optional: Add padding at the bottom
      />
    </Container>
  );
};

const styles = StyleSheet.create({});

export default ViewAllWorkouts;

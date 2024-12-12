// screens/WorkoutListScreen.js

import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import WorkoutCard from "../../components/WorkoutCard";
import { workoutData } from "../../utils/data";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import { useNavigation } from "@react-navigation/native";
import SearchIcon from "../../assets/svgs/SearchIcon";

const ViewAllWorkouts = () => {
  const navigation = useNavigation(); // Access the navigation object

  const handleOnPress = (workout) => {
    // Navigate to the WorkoutDetail screen with the selected workout data
    navigation.navigate("WorkoutDetails", { workout });
  };

  const renderWorkoutCard = ({ item }) => (
    <View style={{ marginBottom: 20 }}>
      <WorkoutCard
        title={item.title}
        calories={`${item.calories}`}
        time={`${item.time}`}
        category={item.category}
        image={item.image}
        onPress={() => handleOnPress(item)} // Pass the item to the handleOnPress function
      />
    </View>
  );

  return (
    <Container>
      <Header
        title={"Trending Workouts"}
        showBackButton={true}
        rightIcon1={<SearchIcon />}
      />
      <FlatList
        style={{ marginTop: 30 }}
        data={workoutData}
        renderItem={renderWorkoutCard}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{ paddingBottom: 20 }} // Optional: Add padding at the bottom
      />
    </Container>
  );
};

const styles = StyleSheet.create({});

export default ViewAllWorkouts;

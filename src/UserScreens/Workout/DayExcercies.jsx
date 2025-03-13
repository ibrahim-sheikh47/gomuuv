import React from "react";
import { View, Text, FlatList } from "react-native";
import WorkoutCard from "../../components/WorkoutCard";

const DayExercises = ({ day }) => {
  const renderExercise = ({ item }) => (
    <WorkoutCard
      title={item.name}
      sets={item.sets}
      reps={item.reps}
      description={item.description}
      // Add other props as needed
    />
  );

  return (
    <View>
      <Text>{day.name}</Text>
      <FlatList
        data={day.exercises}
        renderItem={renderExercise}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default DayExercises;

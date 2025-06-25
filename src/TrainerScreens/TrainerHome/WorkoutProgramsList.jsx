import React, { useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import images from "../../constants/images";
import icons from "../../constants/icons";
import { colors } from "../../constants/colors";
import Container from "../../components/Container";
import Header from "../../components/Header";
import Selectable from "../../components/Selectable";
import SearchIcon from "../../assets/svgs/SearchIcon";
import StrengthIcon from "../../assets/svgs/StrengthIcon";
import LevelIcon from "../../assets/svgs/LevelIcon";
import { FontSize } from "../../utils/font";

const WorkoutProgramsList = ({ navigation, route }) => {
  const trainerWorkoutData = route.params?.workouts || [];

  const [selectedPeriod, setSelectedPeriod] = useState("All");

  const renderWorkoutCard = ({ item }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() =>
        navigation.navigate("WorkoutProgramDetail", { program: item })
      }
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "70%" }}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>

          <Text style={styles.cardPrice}>{item.price}</Text>
        </View>
        <View style={styles.cardDetails}>
          <View>
            <View style={styles.sessionDetail}>
              <StrengthIcon />
              <Text style={styles.detailText}>
                {item.equipments[0].replace("_", " ")}
              </Text>
            </View>
            <View style={styles.sessionDetail}>
              <LevelIcon />
              <Text style={styles.detailText}>{item.level}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container>
      <Header
        title={"Your Program"}
        showBackButton={true}
        // rightIcon1={<SearchIcon />}
      />
      <Selectable
        items={["All", "Recent", "Popular", "Inactive", "Active"]}
        selectedItem={selectedPeriod}
        setSelectedItem={setSelectedPeriod}
      />
      <FlatList
        data={trainerWorkoutData}
        renderItem={renderWorkoutCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          trainerWorkoutData.length > 0
            ? styles.listContent
            : { alignItems: "center", justifyContent: "center", flexGrow: 1 }
        }
        ListEmptyComponent={
          <Text style={{ fontSize: FontSize.small, color: "white" }}>
            No workout programs
          </Text>
        }
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 20,
  },
  workoutCard: {
    width: "100%",
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardImage: {
    width: "100%",
    height: 170,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
    color: colors.green,
  },
  cardDescription: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
    color: "#F8F8F8",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  sessionDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailIcon: {
    width: 15,
    height: 15,
  },
  detailText: {
    color: "#F8F8F8",
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
  },
  cardPrice: {
    fontSize: FontSize.regular,
    color: colors.green,
    fontFamily: "Poppins-Bold",
  },
});

export default WorkoutProgramsList;

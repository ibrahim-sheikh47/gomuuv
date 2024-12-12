import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Container from "../../components/Container";
import images from "../../constants/images";
import { colors } from "../../constants/colors";
import icons from "../../constants/icons";
import ProfileSection from "../../components/ProfileSection";
import Header from "../../components/Header";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import SearchIcon from "../../assets/svgs/SearchIcon";
import RevenueIcon from "../../assets/svgs/RevenueIcon";
import StrengthIcon from "../../assets/svgs/StrengthIcon";
import LevelIcon from "../../assets/svgs/LevelIcon";
import ActiveClientsIcon from "../../assets/svgs/ActiveClientsIcon";
import ProgramSoldIcon from "../../assets/svgs/ProgramSoldIcon";

const TrainerHome = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    revenue: "$5,010.65",
    activeClients: 6,
    programsSold: 25,
  });

  const trainerWorkoutData = [
    {
      id: "1",
      title: "Full body burn",
      subtitle: "Burn Fat and Boost Metabolism ",
      price: "$790.99",
      image: images.chestWorkout,
      category: "Quadriceps",
      level: "Intermediate",
      exercises: 5,
      calories: "190",
      time: "25",
      equipment: "Dumbbells",
      description:
        "A dynamic program designed to torch calories and melt away fat through intense full-body workouts. Boost your metabolism and achieve your fitness goals efficiently.",
      days: {
        day1: [
          { title: "Bench Press", reps: "x10", image: images.chestWorkout },
          { title: "Push Ups", reps: "x15", image: images.chestWorkout },
        ],
        day2: [
          {
            title: "Incline Bench Press",
            reps: "x12",
            image: images.chestWorkout,
          },
          { title: "Dumbbell Flyes", reps: "x10", image: images.chestWorkout },
        ],
        day3: [
          {
            title: "Decline Bench Press",
            reps: "x10",
            image: images.chestWorkout,
          },
          { title: "Chest Dips", reps: "x8", image: images.chestWorkout },
        ],
        day4: [
          {
            title: "Cable Crossovers",
            reps: "x12",
            image: images.chestWorkout,
          },
          { title: "Dumbbell Press", reps: "x10", image: images.chestWorkout },
        ],
      },
    },
    {
      id: "2",
      title: "30-Day Squat Challenge",
      subtitle: "Strengthen your core with daily planks.",
      price: "$790.99",
      image: images.chestWorkout,
      category: "Quadriceps",
      level: "Intermediate",
      exercises: 5,
      calories: "190",
      time: "25",
      equipment: "Dumbbells",
      description:
        "A dynamic program designed to torch calories and melt away fat through intense full-body workouts. Boost your metabolism and achieve your fitness goals efficiently.",
      days: {
        day1: [
          { title: "Bench Press", reps: "x10", image: images.chestWorkout },
          { title: "Push Ups", reps: "x15", image: images.chestWorkout },
        ],
        day2: [
          {
            title: "Incline Bench Press",
            reps: "x12",
            image: images.chestWorkout,
          },
          { title: "Dumbbell Flyes", reps: "x10", image: images.chestWorkout },
        ],
        day3: [
          {
            title: "Decline Bench Press",
            reps: "x10",
            image: images.chestWorkout,
          },
          { title: "Chest Dips", reps: "x8", image: images.chestWorkout },
        ],
        day4: [
          {
            title: "Cable Crossovers",
            reps: "x12",
            image: images.chestWorkout,
          },
          { title: "Dumbbell Press", reps: "x10", image: images.chestWorkout },
        ],
      },
    },
  ];

  const renderWorkoutCard = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("WorkoutProgramDetail", { program: item })
      }
      style={styles.workoutCard}
    >
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.subtitle}</Text>
        <View style={styles.cardDetails}>
          <View>
            <View style={styles.sessionDetail}>
              <StrengthIcon />
              <Text style={styles.detailText}>{item.category}</Text>
            </View>
            <View style={styles.sessionDetail}>
              <LevelIcon />
              <Text style={styles.detailText}>{item.level}</Text>
            </View>
          </View>
          <Text style={styles.cardPrice}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container>
      <Header title="Home" rightIcon1={<SearchIcon />} />
      <ScrollView>
        <TouchableOpacity style={styles.profileHeader}>
          <ProfileSection
            userName="*username here*"
            imageSource={images.dp}
            onPress={() => navigation.navigate("TrainerProfile")}
          />
        </TouchableOpacity>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.row}>
              <Text style={styles.cardLabel}>Revenue</Text>
              <RevenueIcon />
            </View>
            <Text style={styles.cardValue}>{stats.revenue}</Text>
            <Image source={images.revenueGraph} style={styles.graph} />
          </View>
          <View style={styles.summaryCardColumn}>
            <View style={styles.summaryCardSmall}>
              <View style={styles.row}>
                <Text style={styles.cardLabel}>Active Clients</Text>
                <ActiveClientsIcon />
              </View>
              <Text style={styles.cardValue}>{stats.activeClients}</Text>
            </View>
            <View style={styles.summaryCardSmall}>
              <View style={styles.row}>
                <Text style={styles.cardLabel}>Programs Sold</Text>
                <ProgramSoldIcon />
              </View>
              <Text style={styles.cardValue}>{stats.programsSold}</Text>
            </View>
          </View>
        </View>

        <View style={styles.workoutsHeader}>
          <Text style={styles.workoutsTitle}>Your Workouts Program</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("WorkoutProgramsList", { trainerWorkoutData })
            }
          >
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={trainerWorkoutData}
          renderItem={renderWorkoutCard}
          keyExtractor={(item) => item.id}
          style={styles.workoutList}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
      <CustomButton
        style={{ marginTop: 20 }}
        title="Create New Program"
        onPress={() => {
          navigation.navigate("CreateProgram");
        }}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 14,
    marginTop: 20,
  },
  summaryCard: {
    flex: 1,
    height: 194,
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    padding: 10,
  },
  summaryCardColumn: {
    flex: 1,
    gap: 14,
  },
  summaryCardSmall: {
    height: 90,
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    padding: 10,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#f8f8f8",
  },
  cardValue: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: colors.green,
  },
  workoutsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  workoutsTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: colors.green,
  },
  workoutList: {
    marginVertical: 20,
  },
  workoutCard: {
    width: 257,
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    marginRight: 10,
  },
  cardImage: {
    width: "100%",
    height: 170,
    borderTopLeftRadius: 10,
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.green,
  },
  cardDescription: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#F8F8F8",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "flex-end",
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
    fontSize: 12,
  },
  cardPrice: {
    fontSize: 16,
    color: colors.green,
    fontFamily: "Poppins-Bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 20,
    height: 20,
  },
  graph: {
    margin: 16,
    width: 110,
    height: 72,
  },
});

export default TrainerHome;

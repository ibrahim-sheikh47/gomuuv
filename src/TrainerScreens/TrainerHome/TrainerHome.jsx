import React, { useCallback, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import Container from "../../components/Container";
import images from "../../constants/images";
import { colors } from "../../constants/colors";
import ProfileSection from "../../components/ProfileSection";
import Header from "../../components/Header";
import CustomButton from "../../components/CustomButton";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import RevenueIcon from "../../assets/svgs/RevenueIcon";
import StrengthIcon from "../../assets/svgs/StrengthIcon";
import LevelIcon from "../../assets/svgs/LevelIcon";
import ActiveClientsIcon from "../../assets/svgs/ActiveClientsIcon";
import ProgramSoldIcon from "../../assets/svgs/ProgramSoldIcon";
import { useSelector } from "react-redux";
import { FontSize } from "../../utils/font";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";

const TrainerHome = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    revenue: "$0",
    activeClients: 0,
    programsSold: 0,
  });
  const [workouts, setWorkouts] = useState([]);

  // Combine all useSelector Hooks
  const { data: userData, token } = useSelector((state) => state.Auth);
  const { width } = useWindowDimensions();
  const profileImage =
    userData.image !== "" ? { uri: userData.image } : images.dp;

  useFocusEffect(
    useCallback(() => {
      getWorkouts();
    }, [])
  );

  const renderWorkoutCard = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("WorkoutProgramDetail", { program: item })
      }
      style={[styles.workoutCard, { width: width * 0.9 }]}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
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
          <Text style={styles.cardPrice}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getWorkouts = async () => {
    try {
      const res = await API.get(END_POINTS.TRAINER_WORKOUTS, null, token);
      if (res.data.success) {
        setWorkouts(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  return (
    <Container>
      <Header title="Home" />
      <ScrollView>
        <TouchableOpacity style={styles.profileHeader}>
          <ProfileSection
            userName={
              (userData?.firstName || "") + " " + (userData?.lastName || "")
            }
            imageSource={profileImage}
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
              navigation.navigate("WorkoutProgramsList", { workouts })
            }
          >
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={workouts.length > 0 ? [workouts[0]] : []}
          renderItem={renderWorkoutCard}
          keyExtractor={(item) => item._id}
          style={styles.workoutList}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            workouts.length > 0
              ? {}
              : { alignItems: "center", justifyContent: "center", flexGrow: 1 }
          }
          ListEmptyComponent={
            <Text style={{ fontSize: FontSize.small, color: "white" }}>
              No workout program
            </Text>
          }
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
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Medium",
    color: "#f8f8f8",
  },
  cardValue: {
    fontSize: FontSize.xxlarge,
    fontFamily: "Poppins-Bold",
    color: colors.green,
  },
  workoutsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  workoutsTitle: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  viewAllText: {
    fontSize: FontSize.small,
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
    fontSize: FontSize.small,
  },
  cardPrice: {
    fontSize: FontSize.regular,
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

import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import Container from "../../components/Container";
import { colors } from "../../constants/colors";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import TabContainer from "../../components/TabContainer";
import { useNavigation } from "@react-navigation/native";
import images from "../../constants/images";
import { challenges } from "../../utils/data";
import CustomButton from "../../components/CustomButton";
import GoalModal from "../../components/GoalModal";
import CustomModal from "../../components/CustomModal";
import { ProgressBar } from "../../components/ProgressBar";
import EnduranceIcon from "../../assets/svgs/EnduranceIcon";
import StrengthIcon from "../../assets/svgs/StrengthIcon";
import ChallengesIcon from "../../assets/svgs/ChallengesIcon";
import FlexibilityIcon from "../../assets/svgs/FlexibilityIcon";
import HealthWellIcon from "../../assets/svgs/HealthWellIcon";
import HabitIcon from "../../assets/svgs/HabitIcon";
import LevelIcon from "../../assets/svgs/LevelIcon";
import SearchIcon from "../../assets/svgs/SearchIcon";
import WeightLossIcon from "../../assets/svgs/WeightLossIcon";
const ChallengesScreen = () => {
  const [activeTab, setActiveTab] = useState("Challenges");
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [weightUpdatedVisible, setWeightUpdatedVisible] = useState(false);
  const [targetUpdatedVisible, setTargetUpdatedVisible] = useState(false);

  const [currentWeight, setCurrentWeight] = useState(0);
  const [targetWeight, setTargetWeight] = useState(0);

  const handleUpdateWeight = (newWeight) => {
    setCurrentWeight(newWeight); // Update the current weight
    setWeightModalVisible(false);
    setWeightUpdatedVisible(true); // Close the modal
  };
  const handleUpdateTargetWeight = (newTargetWeight) => {
    setTargetWeight(newTargetWeight);
    setTargetModalVisible(false);
    setTargetUpdatedVisible(true);
  };

  const navigation = useNavigation();
  const tabs = ["Challenges", "Goals"];

  const handleCategoryPress = (category) => {
    navigation.navigate("CategoryList", { category });
  };

  const handleCardPress = (challenge) => {
    navigation.navigate("ChallengeDetail", { challenge });
  };
  const categoryIcons = {
    Endurance: <EnduranceIcon />,
    Strength: <StrengthIcon width={24} height={24} />,
    Flexibility: <FlexibilityIcon />,
    "Health & Wellness": <HealthWellIcon />,
    "Lifestyle & Habit": <HabitIcon />,
    "Skills Based": <ChallengesIcon />,
  };

  const renderChallengeCard = ({ item: challenge }) => (
    <TouchableOpacity
      key={challenge.id}
      style={styles.challengeCard}
      onPress={() => handleCardPress(challenge)}
    >
      <Image style={styles.cardImage} source={challenge.image} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <View style={styles.cardHeaderTag}>
            <StrengthIcon />
            <Text style={styles.cardSubtitle}>{challenge.muscleGroup}</Text>
          </View>
        </View>
        {challenge.type === "upcoming" && (
          <>
            <View
              style={{
                width: 45,
                height: 60,
                backgroundColor: "#3C3C3C",
                position: "absolute",
                borderRadius: 15,
                top: -50,
                right: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.absoluteText,
                  { color: colors.green, fontSize: 16 },
                ]}
              >
                {challenge.date}
              </Text>
              <Text style={[styles.absoluteText, { fontSize: 14 }]}>
                {challenge.month}
              </Text>
            </View>
            <Text style={styles.cardSubtitle}>{challenge.cardSubtitle}</Text>
            <View style={styles.cardHeaderTag}>
              <StrengthIcon />
              <Text style={styles.cardSubtitle}>{challenge.muscleGroup}</Text>
              <LevelIcon />
              <Text style={styles.cardSubtitle}>{challenge.level}</Text>
            </View>
          </>
        )}
        {challenge.type === "enroll" && (
          <>
            <View style={styles.cardHeader}>
              <Text style={styles.cardSubtitle}>{challenge.cardSubtitle}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.green }]}>
                {challenge.percent} %
              </Text>
            </View>

            <ProgressBar progress={challenge.percent} />
            <Text style={styles.cardSubtitle}>
              {challenge.startDate} - {challenge.endDate}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderGoalsSection = () => (
    <View>
      <Text style={[styles.sectionTitle, { fontSize: 14, marginBottom: 5 }]}>
        Current Weight
      </Text>
      <Text
        style={{
          color: colors.green,
          fontSize: 24,
          fontFamily: "Poppins-Bold",
        }}
      >
        {currentWeight} Kg
      </Text>
      <Image
        source={images.weightGraph}
        style={{ height: 205, width: "100%", marginTop: 20 }}
      />
      <Text style={styles.sectionTitle}>Your Progress</Text>
      <View
        style={{
          backgroundColor: colors.bgColor,
          borderRadius: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
          }}
        >
          <View>
            <Text
              style={{
                color: "#F8F8F8",
                fontSize: 12,
                fontFamily: "Poppins-Regular",
              }}
            >
              Current
            </Text>
            <Text
              style={{
                color: colors.green,
                fontSize: 16,
                fontFamily: "Poppins-Bold",
              }}
            >
              <Text>{currentWeight} kg</Text>
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: "#F8F8F8",
                fontSize: 12,
                textAlign: "right",
                fontFamily: "Poppins-Regular",
              }}
            >
              Target
            </Text>
            <Text
              style={{
                color: "#F8F8F8",
                fontSize: 16,
                textAlign: "right",
                fontFamily: "Poppins-Bold",
              }}
            >
              {targetWeight} kg
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          gap: 16,
          marginTop: 20,
        }}
      >
        <CustomButton
          style={{
            flex: 1,
            backgroundColor: "transparent",
            borderColor: colors.green,
            borderWidth: 2,
          }}
          title={"Update Your Weight"}
          textStyle={{ color: colors.green, fontSize: 13 }}
          onPress={() => setWeightModalVisible(true)}
        />
        <CustomButton
          style={{ flex: 1 }}
          title={"Set your target"}
          textStyle={{ fontSize: 13 }}
          onPress={() => setTargetModalVisible(true)}
        />
      </View>
    </View>
  );

  const renderListHeader = () => (
    <>
      <Text style={styles.sectionTitle}>Enrolled Challenge</Text>
      {challenges
        .filter((challenge) => challenge.type === "enroll")
        .map((challenge) => (
          <View key={challenge.id}>
            {renderChallengeCard({ item: challenge })}
          </View>
        ))}
      <Text style={styles.sectionTitle}>Upcoming Challenges</Text>
    </>
  );
  const renderFooter = () => (
    <>
      <Text style={styles.sectionTitle}>Find Your Challenge</Text>
      <View style={styles.cardRow}>
        {[
          "Endurance",
          "Strength",
          "Flexibility",
          "Health & Wellness",
          "Lifestyle & Habit",
          "Skills Based",
        ].map((text) => (
          <TouchableOpacity
            key={text}
            style={styles.card}
            onPress={() => handleCategoryPress(text)} // Navigate with selected category
          >
            {categoryIcons[text]}
            <Text style={styles.cardText}>{text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  return (
    <Container>
      <Header title="Challenges & Goals" rightIcon1={<SearchIcon />} />
      <TabContainer
        activeTab={activeTab}
        onTabClick={setActiveTab}
        tabs={tabs}
      />
      <FlatList
        data={
          activeTab === "Challenges"
            ? challenges.filter((challenge) => challenge.type === "upcoming")
            : [] // Here you can add data for Goals if needed
        }
        renderItem={renderChallengeCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          activeTab === "Challenges" ? renderListHeader : renderGoalsSection
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={activeTab === "Challenges" && renderFooter}
      />

      {/* Modals for Update Weight and Set Target */}
      <GoalModal
        visible={weightModalVisible}
        onClose={() => setWeightModalVisible(false)}
        modalText="Update Your Weight"
        value={currentWeight}
        onSave={handleUpdateWeight} // Pass the update function
      />
      <CustomModal
        visible={weightUpdatedVisible}
        onClose={() => setWeightUpdatedVisible(false)}
        modalText={"Your weight has been updated!"}
        modalIcon={<WeightLossIcon width={50} height={50} />}
      />
      <GoalModal
        visible={targetModalVisible}
        onClose={() => setTargetModalVisible(false)}
        modalText="Set your Target Weight"
        value={targetWeight}
        onSave={handleUpdateTargetWeight}
      />
      <CustomModal
        visible={targetUpdatedVisible}
        onClose={() => setTargetUpdatedVisible(false)}
        modalText={"Your target has been updated!"}
        modalIcon={<ChallengesIcon width={50} height={50} />}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: "white",
    fontSize: 16,
    marginVertical: 20,
    fontFamily: "Poppins-Bold",
  },
  challengeCard: {
    backgroundColor: colors.bgColor,
    borderRadius: 15,
    marginBottom: 20,
  },
  cardImage: {
    height: 175,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 12,
    gap: 7,
  },
  challengeTitle: {
    color: colors.green,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  cardSubtitle: {
    color: "#F8F8F8",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  absoluteText: {
    fontFamily: "Poppins-SemiBold",
    color: "white",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderTag: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  tagIcon: {
    width: 15,
    height: 15,
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#242425",
    height: 103,
    width: "48%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    width: 32,
    height: 32,
  },
  cardText: {
    color: "#fff",
    marginTop: 10,
  },
});

export default ChallengesScreen;

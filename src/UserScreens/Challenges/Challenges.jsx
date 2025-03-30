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
import { FontSize } from "../../utils/font";

const ChallengesScreen = () => {
  const [activeTab, setActiveTab] = useState("Goals"); // Set default to Goals to match your screenshot
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [weightUpdatedVisible, setWeightUpdatedVisible] = useState(false);
  const [targetUpdatedVisible, setTargetUpdatedVisible] = useState(false);

  const [currentWeight, setCurrentWeight] = useState(63); // Set to 63 to match your screenshot
  const [targetWeight, setTargetWeight] = useState(54); // Set to 54 to match your screenshot
  const [bmiValue, setBmiValue] = useState(23.0); // Initial BMI value

  const handleUpdateWeight = (newWeight) => {
    setCurrentWeight(newWeight); // Update the current weight
    setWeightModalVisible(false);
    setWeightUpdatedVisible(true); // Close the modal
    // You might want to recalculate BMI here
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
                  { color: colors.green, fontSize: FontSize.regular },
                ]}
              >
                {challenge.date}
              </Text>
              <Text
                style={[styles.absoluteText, { fontSize: FontSize.medium }]}
              >
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

  // Calculate progress percentage for the progress bar
  const calculateProgressPercentage = () => {
    if (currentWeight <= targetWeight) return 100;

    const totalLoss = 100; // Let's say 100 kg is the max weight loss we'd show
    const currentLoss = currentWeight - targetWeight;
    return Math.min(100, (currentLoss / totalLoss) * 100);
  };

  const renderGoalsSection = () => (
    <View>
      <Text style={[styles.sectionTitle, { fontSize: 14, marginBottom: 5 }]}>
        Current Weight
      </Text>
      <Text
        style={{
          color: colors.green,
          fontSize: FontSize.xxlarge,
          fontFamily: "Poppins-Bold",
        }}
      >
        {currentWeight} kg
      </Text>

      {/* Weight graph with dropdown */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View></View> {/* Empty view for spacing */}
        <TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#242425",
              padding: 8,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: FontSize.small,
                marginRight: 4,
              }}
            >
              Yearly
            </Text>
            <Text style={{ color: "white" }}>▼</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Image
        source={images.weightGraph}
        style={{ height: 205, width: "100%", marginTop: 10 }}
      />

      <Text style={styles.sectionTitle}>Your Progress</Text>

      {/* Updated Progress Section with Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
          <View>
            <Text style={styles.progressLabelText}>Current</Text>
            <Text style={styles.currentWeightText}>{currentWeight} kg</Text>
          </View>
          <View>
            <Text style={[styles.progressLabelText, { textAlign: "right" }]}>
              Target
            </Text>
            <Text style={[styles.targetWeightText, { textAlign: "right" }]}>
              {targetWeight} kg
            </Text>
          </View>
        </View>

        {/* Custom Progress Bar */}
        <View style={styles.customProgressBarContainer}>
          <View
            style={[
              styles.customProgressBar,
              { width: `${calculateProgressPercentage()}%` },
            ]}
          />
          <View
            style={[
              styles.progressMarker,
              { left: `${calculateProgressPercentage()}%`, marginLeft: -8 },
            ]}
          />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <CustomButton
          style={styles.updateWeightButton}
          title={"Update Your Weight"}
          textStyle={{ color: colors.green, fontSize: FontSize.small }}
          onPress={() => setWeightModalVisible(true)}
        />
        <CustomButton
          style={styles.setTargetButton}
          title={"Set Your Target"}
          textStyle={{ fontSize: FontSize.small }}
          onPress={() => setTargetModalVisible(true)}
        />
      </View>

      {/* BMI Section */}
      <Text style={styles.sectionTitle}>Your BMI</Text>
      <View style={styles.bmiContainer}>
        <View style={styles.bmiValueContainer}>
          <Text style={styles.bmiValue}>{bmiValue}</Text>
          <Text style={styles.bmiLabel}>Normal</Text>
        </View>

        {/* BMI Scale */}
        <View style={styles.bmiScaleContainer}>
          <View style={styles.bmiScale}>
            {Array(40)
              .fill()
              .map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.bmiScaleLine,
                    i % 10 === 0 ? styles.bmiScaleLineMajor : null,
                  ]}
                />
              ))}
          </View>

          {/* Scale numbers */}
          <View style={styles.bmiScaleNumbers}>
            <Text style={styles.bmiScaleNumber}>10</Text>
            <Text style={styles.bmiScaleNumber}>20</Text>
            <Text style={styles.bmiScaleNumber}>25</Text>
            <Text style={styles.bmiScaleNumber}>30</Text>
            <Text style={styles.bmiScaleNumber}>40</Text>
          </View>
        </View>
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
            onPress={() => handleCategoryPress(text)}
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
        onSave={handleUpdateWeight}
      />
      <CustomModal
        visible={weightUpdatedVisible}
        onClose={() => setWeightUpdatedVisible(false)}
        modalText={"Your weight has been updated!"}
        modalIcon={
          <Image
            style={{ width: 60, height: 60 }}
            source={require("../../assets/icons/updateWeightIcon.png")}
          />
        }
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
        modalIcon={
          <Image
            style={{ width: 60, height: 60 }}
            source={require("../../assets/icons/setTargetIcon.png")}
          />
        }
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: "white",
    fontSize: FontSize.regular,
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
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
  },
  cardSubtitle: {
    color: "#F8F8F8",
    fontSize: FontSize.small,
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

  // New styles for the progress bar and BMI section
  progressContainer: {
    backgroundColor: colors.bgColor,
    borderRadius: 15,
    padding: 16,
  },
  progressLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressLabelText: {
    color: "#F8F8F8",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  currentWeightText: {
    color: colors.green,
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
  },
  targetWeightText: {
    color: "#F8F8F8",
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
  },
  customProgressBarContainer: {
    height: 8,
    backgroundColor: "#3C3C3C",
    borderRadius: 4,
    marginTop: 5,
    position: "relative",
  },
  customProgressBar: {
    height: "100%",
    backgroundColor: colors.green,
    borderRadius: 4,
  },
  progressMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    position: "absolute",
    top: -4,
    borderWidth: 2,
    borderColor: colors.green,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 16,
    marginTop: 20,
  },
  updateWeightButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderColor: colors.green,
    borderWidth: 2,
  },
  setTargetButton: {
    flex: 1,
  },
  bmiContainer: {
    backgroundColor: "#1D1D1E",
    borderRadius: 15,
    padding: 16,
  },
  bmiValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 15,
  },
  bmiValue: {
    color: colors.green,
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginRight: 8,
  },
  bmiLabel: {
    color: "white",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  bmiScaleContainer: {
    marginTop: 5,
  },
  bmiScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 16,
  },
  bmiScaleLine: {
    width: 1,
    height: 8,
    backgroundColor: "#666",
  },
  bmiScaleLineMajor: {
    height: 16,
    backgroundColor: "#888",
  },
  bmiScaleNumbers: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  bmiScaleNumber: {
    color: "#888",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
});

export default ChallengesScreen;

import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  useWindowDimensions,
} from "react-native";
import Container from "../../components/Container";
import { colors } from "../../constants/colors";
import Header from "../../components/Header";
import TabContainer from "../../components/TabContainer";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import images from "../../constants/images";
// import { challenges } from "../../utils/data";
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
import { END_POINTS } from "../../config/routes";
import { useSelector } from "react-redux";
import { API } from "../../config/apiClient";
import moment from "moment";

const ChallengesScreen = () => {
  const { height, width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("Challenges"); // Set default to Goals to match your screenshot
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [weightUpdatedVisible, setWeightUpdatedVisible] = useState(false);
  const [targetUpdatedVisible, setTargetUpdatedVisible] = useState(false);

  const [enrolledChallenges, setEnrolledChallenges] = useState([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState([]);

  const { token, userData } = useSelector((state) => ({
    token: state.Auth?.token,
    userData: state.Auth?.data,
  }));

  const [currentWeight, setCurrentWeight] = useState(
    userData?.weight.replace("kg", "").replace("lbs", "") || 0
  ); // Set to 63 to match your screenshot
  const [targetWeight, setTargetWeight] = useState(0); // Set to 54 to match your screenshot
  const [progressPercentage, setProgressPercentage] = useState(0); // Set to 54 to match your screenshot
  const [bmiValue, setBmiValue] = useState(0); // Initial BMI value

  const [rangeModalVisible, setRangeModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [graphData, setGraphData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getEnrolledChallenges();
      getUpcomingChallenges();
    }, [])
  );

  useEffect(() => {
    const calculateBMI = () => {
      let heightInMeters;

      if (!currentWeight) return;

      if (userData?.height.toLowerCase().includes("cm")) {
        const cmValue = parseFloat(userData?.height.replace("cm", "").trim());
        heightInMeters = cmValue / 100;
      } else if (userData?.height.includes("ft")) {
        // handle height in ft'in format (e.g., 5'9)
        const [feet, inches] = userData?.height
          .split(" ")
          .map((val) => parseFloat(val.replace(/[^0-9.]/g, "")));
        const totalInches = (feet || 0) * 12 + (inches || 0);
        const meters = totalInches * 0.0254;
        heightInMeters = meters;
      } else {
        // fallback: assume meters directly
        heightInMeters = parseFloat(userData?.height);
      }

      if (heightInMeters > 0) {
        const bmi = currentWeight / (heightInMeters * heightInMeters);
        setBmiValue(parseFloat(bmi.toFixed(1)));
      }
    };

    calculateBMI();
  }, [currentWeight]);

  useEffect(() => {
    const data = generateGraphData(selectedRange);
    setGraphData(data);
  }, [selectedRange]);

  const getBmiLabel = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
  };

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
    navigation.navigate("ChallengeDetail", {
      challenge: JSON.parse(JSON.stringify(challenge)),
    });
  };

  const categoryIcons = {
    Endurance: <EnduranceIcon />,
    Strength: <StrengthIcon width={24} height={24} />,
    Flexibility: <FlexibilityIcon />,
    "Health & Wellness": <HealthWellIcon />,
    "Lifestyle & Habit": <HabitIcon />,
    "Skills Based": <ChallengesIcon />,
  };

  const getEnrolledChallenges = async () => {
    try {
      const res = await API.get(
        `${END_POINTS.CHALLENGES}/enrolled/challenges`,
        null,
        token
      );
      if (res.data.success) {
        setEnrolledChallenges(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching enrolled challenges:", error);
    }
  };

  const getUpcomingChallenges = async () => {
    try {
      const res = await API.get(
        `${END_POINTS.CHALLENGES}/upcoming/challenges`,
        null,
        token
      );
      if (res.data.success) {
        setUpcomingChallenges(
          res.data.data.filter((d) => !d.participants.includes(userData._id))
        );
      }
    } catch (error) {
      console.error("Error fetching upcoming challenges:", error);
    }
  };

  const renderChallengeCard = ({ item }) => {
    return (
      <TouchableOpacity
        key={item._id}
        style={styles.challengeCard}
        onPress={() => handleCardPress(item)}
      >
        <View
          style={[
            styles.cardImage,
            { height: height * 0.25, overflow: "hidden" },
          ]}
        >
          <Image
            style={[styles.cardImage, { height: "100%" }]}
            source={{ uri: item.workout.image }}
          />

          <Text
            style={[
              styles.absoluteText,
              { color: colors.green, fontSize: FontSize.small },
              {
                backgroundColor: "#3C3C3C",
                position: "absolute",
                borderRadius: 15,
                bottom: height * 0.02,
                right: height * 0.02,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: width * 0.04,
                paddingVertical: width * 0.02,
              },
            ]}
          >
            {`${moment(item.startDate).format("DD MMM")} - ${moment(
              item.endDate
            ).format("DD MMM")}`}
          </Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.challengeTitle}>{item.workout.name}</Text>
          <Text style={styles.cardSubtitle}>{item.workout.description}</Text>
          {enrolledChallenges.some((c) => c._id.toString() === item._id) && (
            <>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardSubtitle, { color: colors.green }]}>
                  {(
                    item.workout?.days?.filter(
                      (d) => !d?.exercises?.some((e) => !e.isCompleted)
                    ).length / item.workout?.days.length || 0
                  ).toFixed(3)}{" "}
                  %
                </Text>
              </View>

              <ProgressBar
                progress={
                  (item.workout?.days?.filter(
                    (d) => !d?.exercises?.some((e) => !e.isCompleted)
                  ).length / item.workout?.days.length || 0) * 100
                }
              />
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Calculate progress percentage for the progress bar
  const calculateProgressPercentage = () => {
    if (currentWeight <= targetWeight) return 100;

    const totalLoss = 100; // Let's say 100 kg is the max weight loss we'd show
    const currentLoss = currentWeight - targetWeight;
    return Math.min(100, (currentLoss / totalLoss) * 100);
  };

  useEffect(() => {
    setProgressPercentage(calculateProgressPercentage());
  }, [currentWeight, targetWeight]);

  const weeklyData = [
    { day: "M", value: 10 },
    { day: "T", value: 0 },
    { day: "W", value: 0 },
    { day: "T", value: 15 },
    { day: "F", value: 0 },
    { day: "S", value: 22 },
    { day: "S", value: 0 },
  ];

  const yearlyData = [
    { day: "Jan", value: 0 },
    { day: "Feb", value: 12 },
    { day: "Mar", value: 0 },
    { day: "Apr", value: 44 },
    { day: "May", value: 0 },
    { day: "Jun", value: 0 },
    { day: "Jul", value: 34 },
    { day: "Sep", value: 0 },
    { day: "Oct", value: 55 },
    { day: "Nov", value: 56 },
    { day: "Dec", value: 87 },
  ];

  const BarGraph = ({ data }) => {
    const maxHeight = 150;

    return (
      <View style={styles.barOuterContainer}>
        {data.map((item, index) => {
          const barHeight = (item.value / 100) * maxHeight;

          return (
            <View key={index} style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: "#C2FF59",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.label,
                    {
                      color: "#000",
                    },
                  ]}
                >
                  {item.value}
                </Text>
              </View>
              <Text style={styles.label}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderGoalsSection = () => (
    <View>
      {/* Graph + Yearly Dropdown */}
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          {/* Header Section */}
          <Text
            style={[styles.sectionTitle, { fontSize: 14, marginBottom: 5 }]}
          >
            Current Weight
          </Text>

          <Text
            style={{
              color: colors.green,
              fontSize: FontSize.xxlarge,
              fontFamily: "Poppins-Bold",
            }}
          >
            {userData?.weight || "N/A"}
          </Text>
        </View>

        <TouchableOpacity style={{borderWidth: 1, borderColor: "#c2c2c2", borderRadius: 8}} onPress={() => setRangeModalVisible(true)}>
          <Text style={styles.rangeSelectText}>{selectedRange} ▼</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <BarGraph data={graphData} />
      </View>

      {/* Progress Section */}
      <Text style={styles.sectionTitle}>Your Progress</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
          <View>
            <Text style={styles.progressLabelText}>Current</Text>
            <Text style={styles.currentWeightText}>
              {currentWeight ? `${currentWeight} kg` : "N/A"}
            </Text>
          </View>
          <View>
            <Text style={[styles.progressLabelText, { textAlign: "right" }]}>
              Target
            </Text>
            <Text style={[styles.targetWeightText, { textAlign: "right" }]}>
              {targetWeight ? `${targetWeight} kg` : "N/A"}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.customProgressBarContainer}>
          <View
            style={[
              styles.customProgressBar,
              { width: progressPercentage ? `${progressPercentage}%` : "0%" },
            ]}
          />
          <View
            style={[
              styles.progressMarker,
              {
                left: progressPercentage ? `${progressPercentage}%` : "0%",
                marginLeft: -8,
              },
            ]}
          />
        </View>
      </View>

      {/* Update Weight & Set Target Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
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
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Your BMI</Text>
      <View style={styles.bmiContainer}>
        {/* BMI Value */}
        <View style={styles.bmiValueContainer}>
          <Text style={styles.bmiValue}>
            {bmiValue ? bmiValue.toString() : "N/A"}
          </Text>
          <Text style={styles.bmiLabel}>{getBmiLabel(bmiValue)}</Text>
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

  const renderListHeader = () => {
    if (enrolledChallenges.length > 0) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Enrolled Challenges</Text>
          {enrolledChallenges.map((challenge) => (
            <View key={challenge._id}>
              {renderChallengeCard({ item: challenge })}
            </View>
          ))}
          <Text style={styles.sectionTitle}>Upcoming Challenges</Text>
        </View>
      );
    } else if (upcomingChallenges.length > 0)
      return <Text style={styles.sectionTitle}>Upcoming Challenges</Text>;
    return null;
  };

  const renderFooter = () => (
    <>
      <Text style={styles.sectionTitle}>Find Your Challenge</Text>
      <View style={styles.cardRow}>
        {[
          "Endurance",
          "Strength",
          "Flexibility",
          "Health & Wellness",
          "Lifestyle And Habit",
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

  const generateGraphData = (range) => {
    if (range === "Weekly") {
      return weeklyData;
    } else {
      return yearlyData;
    }
  };

  const RangeModal = ({ visible, onClose, onSelect }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Range</Text>
          {["Weekly", "Yearly"].map((range) => (
            <TouchableOpacity
              key={range}
              style={styles.modalButton}
              onPress={() => {
                onSelect(range);
                onClose();
              }}
            >
              <Text style={styles.modalButtonText}>{range}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <Container>
      <Header title="Challenges & Goals" />
      <TabContainer
        activeTab={activeTab}
        onTabClick={setActiveTab}
        tabs={tabs}
      />
      <FlatList
        data={
          activeTab === "Challenges"
            ? upcomingChallenges.filter((c, i) => i < 3)
            : [] // Here you can add data for Goals if needed
        }
        renderItem={renderChallengeCard}
        keyExtractor={(item) =>
          item?._id?.toString() || Math.random().toString()
        }
        ListHeaderComponent={
          activeTab === "Challenges" ? renderListHeader : renderGoalsSection
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={activeTab === "Challenges" && renderFooter}
        ListEmptyComponent={
          activeTab === "Challenges" &&
          (upcomingChallenges.length > 0 || enrolledChallenges.length > 0) ? (
            <Text style={{ color: "white" }}>No Challenge</Text>
          ) : null
        }
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

      <RangeModal
        visible={rangeModalVisible}
        onClose={() => setRangeModalVisible(false)}
        onSelect={setSelectedRange}
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
  barOuterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20, // optional dark background
    maxHeight: 200,
  },
  barContainer: {
    alignItems: "center",
    width: 30,
  },
  bar: {
    width: 30,
    borderRadius: 3,
    marginBottom: 6,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 30,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButton: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  rangeSelectText: {
    fontSize: 16,
    fontWeight: "500",
    margin: 10,
    color: "white",
  },
});

export default ChallengesScreen;

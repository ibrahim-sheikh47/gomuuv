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
import { FontSize } from "../../utils/font";
import { END_POINTS } from "../../config/routes";
import { useDispatch, useSelector } from "react-redux";
import { API } from "../../config/apiClient";
import moment from "moment";
import { setTargetWeight, setUserData } from "../../redux/reducers/AuthSlice";
import Toast from "react-native-toast-message";
import { getResponsiveFontSize } from "../../utils/utilities";

const ChallengesScreen = () => {
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("Challenges"); // Set default to Goals to match your screenshot
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [weightUpdatedVisible, setWeightUpdatedVisible] = useState(false);
  const [targetUpdatedVisible, setTargetUpdatedVisible] = useState(false);

  const [enrolledChallenges, setEnrolledChallenges] = useState([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState([]);

  const {
    token,
    data: userData,
    targetWeight,
  } = useSelector((state) => state.Auth);

  const [currentWeight, setCurrentWeight] = useState(
    userData?.weight?.replace("kg", "").replace("lbs", "") || 0
  );
  const weightUnit = userData?.weight?.includes("kg") ? "kg" : "lbs" || "kg";
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [bmiValue, setBmiValue] = useState(0);

  const [rangeModalVisible, setRangeModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [graphData, setGraphData] = useState([]);
  const [parentWidth, setParentWidth] = useState(0);

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

      if (userData?.height?.toLowerCase().includes("cm")) {
        const cmValue = parseFloat(
          userData?.height?.replace("cm", "").trim() || 0
        );
        heightInMeters = cmValue / 100;
      } else if (userData?.height?.includes("ft")) {
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
    fetchCurrentWeightStats();
  }, [selectedRange, currentWeight]);

  const getBmiLabel = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
  };

  const handleUpdateWeight = (newWeight) => {
    handleSave(newWeight);
  };

  const handleUpdateTargetWeight = (newTargetWeight) => {
    updateGoal(newTargetWeight);
  };

  const updateGoal = async (newTargetWeight) => {
    try {
      let payload;
      let apiMethod;

      if (targetWeight === null) {
        payload = {
          type: "Weight",
          targetDistance: {
            value: newTargetWeight,
            unit: weightUnit,
          },
          targetDuration: {
            hours: 0,
            minutes: 0,
            totalSeconds: 0,
          },
        };
        apiMethod = API.post;
      } else {
        payload = {
          type: "Weight",
          distance: {
            value: newTargetWeight,
            unit: weightUnit,
          },
          duration: {
            hours: 0,
            minutes: 0,
            totalSeconds: 0,
          },
        };
        apiMethod = API.patch;
      }

      const response = await apiMethod(`${END_POINTS.GOALS}`, payload, token);

      if (response?.data?.success) {
        const newValue = response.data.data.targetDistance?.value;

        dispatch(setTargetWeight(newValue));
        setTargetModalVisible(false);
        setTargetUpdatedVisible(true);
      }
    } catch (error) {
      console.error("updateGoal error:", error);
    }
  };

  const handleSave = async (newWeight) => {
    let weightFormatted = `${newWeight}${weightUnit}`;

    try {
      const updatedData = {
        weight: weightFormatted,
      };
      const response = await API.patch(
        END_POINTS.UPDATE_USER + `${userData?._id}`,
        updatedData,
        token
      );

      if (response?.data?.success) {
        dispatch(setUserData(response?.data?.data));
        setCurrentWeight(newWeight);
        setWeightModalVisible(false);
        setWeightUpdatedVisible(true);
      } else {
        throw new Error("Failed to update information.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentWeightStats = async () => {
    try {
      const response = await API.post(
        `${END_POINTS.GOALS_CURRENT_WEIGHT_STATS}`,
        {
          filter: selectedRange,
        },
        token
      );

      if (response?.data?.success) {
        setGraphData(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
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
      // Fetch all challenges instead of just "upcoming"
      const res = await API.get(`${END_POINTS.CHALLENGES}`, null, token);
      if (res.data.success) {
        // Filter out challenges the user is already enrolled in
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
          {/* Conditional Date/Duration Display */}
          {item.userStartDate && item.userEndDate ? (
            <Text style={styles.dateText}>
              {`${moment(item.userStartDate).format("DD MMM")} - ${moment(
                item.userEndDate
              ).format("DD MMM")}`}
            </Text>
          ) : (
            <Text style={styles.dateText}>{item.workout.days.length} Days</Text>
          )}
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
    const percentage = (currentWeight / targetWeight) * 100;
    const clampedProgress = Math.min(Math.max(percentage, 0), 100);
    return clampedProgress;
  };

  useEffect(() => {
    setProgressPercentage(calculateProgressPercentage());
  }, [currentWeight, targetWeight]);

  const BarGraph = ({ data }) => {
    const maxHeight = 160;
    const maxValue = Math.max(...data.map((item) => item.value));
    const steps = Array.from({ length: 5 }, (_, i) =>
      Math.round((i / 4) * maxValue)
    );

    return (
      <View style={{ flexDirection: "row", gap: 5 }}>
        <View style={{ justifyContent: "space-between", height: maxHeight }}>
          {steps.reverse().map((val, idx) => (
            <Text key={idx} style={styles.label}>
              {val}
            </Text>
          ))}
        </View>

        <View
          onLayout={(e) => {
            setParentWidth(e.nativeEvent.layout.width);
          }}
          style={[styles.barOuterContainer, { flex: 1 }]}
        >
          {targetWeight !== undefined && (
            <View
              style={[
                styles.goalLine,
                {
                  bottom: (targetWeight / maxValue) * maxHeight,
                },
              ]}
            >
              <Text style={styles.goalText}>{targetWeight}</Text>
            </View>
          )}

          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * maxHeight;

            return (
              <View
                key={index}
                style={[
                  styles.barContainer,
                  {
                    width: parentWidth / data.length,
                  },
                ]}
              >
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      width: "90%",
                      maxWidth: getResponsiveFontSize(25),
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
      </View>
    );
  };

  const getBmiPosition = (bmiValue) => {
    if (!bmiValue) return 0;
    const min = 0;
    const max = 40;
    const clamped = Math.max(min, Math.min(max, bmiValue));
    return (clamped - min) / (max - min);
  };

  const getProgressInfo = (current, target) => {
    if (!current || !target) {
      return { progress: 0, targetPosition: 0, message: "N/A" };
    }

    const diff = target - current;
    const absDiff = Math.abs(diff);
    const message =
      diff > 0
        ? `You need to gain ${absDiff.toFixed(1)} ${weightUnit}`
        : diff < 0
        ? `You need to lose ${absDiff.toFixed(1)} ${weightUnit}`
        : "You've reached your target weight!";

    // normalize so that min = smaller weight, max = larger weight
    const min = Math.min(current, target);
    const max = Math.max(current, target);

    // compute current progress position relative to the two
    const progress = ((current - min) / (max - min)) * 100;
    const targetPosition = (current / target) * 100;

    if (current > target) {
      return {
        progress,
        targetPosition: (target / current) * 100,
        message,
      };
    }

    return { progress, targetPosition, message };
  };

  const { progress, targetPosition, message } = getProgressInfo(
    currentWeight,
    targetWeight
  );
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

        <TouchableOpacity
          style={{ borderWidth: 1, borderColor: "#c2c2c2", borderRadius: 8 }}
          onPress={() => setRangeModalVisible(true)}
        >
          <Text style={styles.rangeSelectText}>{selectedRange} ▼</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.progressContainer, { flex: 1 }]}>
        <BarGraph data={graphData} />
      </View>

      {/* Progress Section */}
      <Text style={styles.sectionTitle}>Your Progress</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
          <View>
            <Text style={styles.progressLabelText}>Current</Text>
            <Text style={styles.currentWeightText}>
              {currentWeight ? `${currentWeight} ${weightUnit}` : "N/A"}
            </Text>
          </View>
          <View>
            <Text style={[styles.progressLabelText, { textAlign: "right" }]}>
              Target
            </Text>
            <Text style={[styles.targetWeightText, { textAlign: "right" }]}>
              {targetWeight ? `${targetWeight} ${weightUnit}` : "N/A"}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.customProgressBarContainer}>
          {/* Base bar */}
          <View style={[styles.customProgressBar, { width: "100%" }]} />

          {/* Filled bar (current weight) */}
          <View
            style={[
              styles.customProgressBar,
              {
                width: `${progress}%`,
                backgroundColor: colors.green,
                position: "absolute",
              },
            ]}
          />

          <View
            style={[
              styles.bmiPointer,
              { left: `${targetPosition}%`, top: -15 },
            ]}
          >
            <View style={styles.bmiPointerTriangle} />
          </View>
        </View>

        {/* Progress message */}
        <Text style={styles.progressMessage}>{message}</Text>
      </View>

      {/* Update Weight & Set Target Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          gap: 10,
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
            {Array(41)
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

            {/* Tracker Pointer */}
            <View
              style={[
                styles.bmiPointer,
                { left: `${getBmiPosition(bmiValue) * 100}%` },
              ]}
            >
              <View style={styles.bmiPointerTriangle} />
            </View>
          </View>
          {/* Scale Numbers */}
          <View style={styles.bmiScaleNumbers}>
            <Text style={styles.bmiScaleNumber}>0</Text>
            <Text style={styles.bmiScaleNumber}>10</Text>
            <Text style={styles.bmiScaleNumber}>20</Text>
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

  const RangeModal = ({ visible, onClose, onSelect }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Range</Text>
          {["Weekly", "Yearly"].map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.unitOption]}
              onPress={() => {
                onSelect(range);
                onClose();
              }}
            >
              <Text style={styles.unitOptionText}>{range}</Text>
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
        weightUnit={weightUnit}
        currentWeight={currentWeight}
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
        weightUnit={weightUnit}
        currentWeight={
          targetWeight !== null && targetWeight !== undefined
            ? targetWeight
            : currentWeight
        }
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
  dateText: {
    fontFamily: "Poppins-SemiBold",
    color: colors.green,
    fontSize: FontSize.small,
    backgroundColor: "#3C3C3C",
    position: "absolute",
    borderRadius: 15,
    bottom: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    backgroundColor: colors.bgColorOpaque,
    borderRadius: 4,
  },
  progressMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
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
    width: "100%", // important!
    marginTop: 6,
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
    // padding: 20, // optional dark background
    maxHeight: 200,
  },
  barContainer: {
    alignItems: "center",
    width: 30,
  },
  bar: {
    width: getResponsiveFontSize(25),
    borderRadius: getResponsiveFontSize(25),
    marginBottom: 6,
  },
  label: {
    color: "#aaa",
    fontSize: getResponsiveFontSize(12),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: FontSize.large,
    color: "#fff",
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  unitOption: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  unitOptionText: {
    color: "#fff",
    fontSize: FontSize.regular,
    textAlign: "center",
  },
  selectedUnit: {
    backgroundColor: colors.green,
  },
  rangeSelectText: {
    fontSize: 16,
    fontWeight: "500",
    margin: 10,
    color: "white",
  },
  bmiPointer: {
    position: "absolute",
    top: -20, // keeps it above the ruler
    transform: [{ translateX: -7.5 }], // centers horizontally
  },
  bmiPointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 7.5,
    borderRightWidth: 7.5,
    borderTopWidth: 15,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.green,
  },
  targetMarker: {
    position: "absolute",
    top: -1 * getResponsiveFontSize(2),
    width: getResponsiveFontSize(3),
    height: getResponsiveFontSize(14),
    backgroundColor: "red",
    borderRadius: getResponsiveFontSize(2),
    transform: [{ translateX: -1 * getResponsiveFontSize(2) }],
    zIndex: 10,
  },
  progressMessage: {
    fontSize: getResponsiveFontSize(14),
    textAlign: "center",
    marginTop: getResponsiveFontSize(10),
    color: colors.green,
    fontFamily: "Poppins-SemiBold",
  },
  goalLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.white,
  },
  goalText: {
    position: "absolute",
    right: 0,
    top: -1 * getResponsiveFontSize(14),
    fontSize: getResponsiveFontSize(12),
    color: colors.white,
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});

export default ChallengesScreen;

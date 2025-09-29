import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native"; // Import useRoute
import React, { act, useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import FastingIcon from "../../assets/svgs/FastingIcon";
import FastTypeIcon from "../../assets/svgs/FastTypeIcon";
import GlassIcon from "../../assets/svgs/GlassIcon";
import ProgressIcon from "../../assets/svgs/ProgressIcon";
import SearchIcon from "../../assets/svgs/SearchIcon";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal"; // Import your CustomModal
import { FastingCard } from "../../components/FastingCard";
import Header from "../../components/Header";
import { StatsHistoryCard } from "../../components/StatsHistoryCard";
import TabContainer from "../../components/TabContainer";
import { colors } from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { FontSize } from "../../utils/font";

const FastingScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute(); // Use route to access navigation parameters
  const [activeTab, setActiveTab] = useState("Current Fast");
  const tabs = ["Current Fast", "Stats and History"];
  const { token, data: userData } = useSelector((state) => state.Auth);
  const [selectedFilter, setSelectedFilter] = useState("weekly");

  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [fastingStats, setFastingStats] = useState({}); // Modal visibility state
  const [fastingHistories, setFastingHistories] = useState([]); // Modal visibility state
  const [selectedPlan, setSelectedPlan] = useState(null); // Modal visibility state

  const filters = ["weekly", "monthly", "yearly"];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [fill, setFill] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0); // Total duration in seconds

  useFocusEffect(
    useCallback(() => {
      if (activeTab === "Stats and History") {
        getFastingHistory();
        getFastingHistories();
      } else {
        getCurrentFast();
      }
    }, [activeTab])
  );

  useEffect(() => {
    if (selectedPlan && selectedPlan.startedAt) {
      const fastHours = extractNumberBeforeColon(
        selectedPlan?.fastingPlan?.type
      );
      const totalDurationInSeconds = fastHours * 3600;

      // Convert startedAt to Date and get time difference
      const startedAt = new Date(selectedPlan.startedAt);
      const now = new Date();
      const elapsedTimeInSeconds = Math.floor((now - startedAt) / 1000);

      const remaining = Math.max(
        totalDurationInSeconds - elapsedTimeInSeconds,
        0
      );

      setTotalDuration(totalDurationInSeconds);
      setRemainingTime(remaining);
    }
  }, [selectedPlan]);

  useEffect(() => {
    let interval;
    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
        let fillValue = totalDuration - (remainingTime + 1);
        let normalizedFill = (fillValue / totalDuration) * 100;
        setFill(normalizedFill); // Increment fill based on total duration
      }, 1000); // Update every second
    }

    return () => clearInterval(interval);
  }, [remainingTime, totalDuration]);

  useEffect(() => {
    getFastingHistories();
  }, [selectedFilter]);

  const selectUnit = (value) => {
    setSelectedFilter(value.toLowerCase()); // Ensure it matches 'weekly', 'monthly', 'yearly'
    toggleModal();
    fetchChartData(value.toLowerCase());
  };

  const endFastingSession = async () => {
    try {
      let payload = {
        user: userData?._id,
        fastingHistoryId: selectedPlan?._id,
      };
      const res = await API.post(
        END_POINTS.END_FASTING_SESSION,
        payload,
        token
      );
      if (res.data.success) {
        setModalVisible(true); // Show the modal
        getCurrentFast();
      }
    } catch (error) {
      console.log(error);
    }
  };

  function extractNumberBeforeColon(timeString) {
    const parts = timeString.split(":");
    return parseInt(parts[0], 10);
  }

  const getCurrentFast = async () => {
    try {
      const res = await API.post(END_POINTS.CURRENT_FASTING, {}, token);
      if (res?.data?.success) {
        setSelectedPlan(res.data.data);
      }
    } catch (error) {
      setSelectedPlan(null);
      console.error("Error fetching history", error);
    }
  };

  const getFastingHistory = async () => {
    try {
      const res = await API.post(END_POINTS.FASTING_HISTORY, {}, token);
      if (res?.data?.success) {
        setFastingStats(res.data.data || {});
      }
    } catch (error) {
      console.error("Error fetching history", error);
    }
  };

  const getFastingHistories = async () => {
    try {
      const res = await API.post(`${END_POINTS.FASTING_CHART_DATA}`, {}, token);
      if (res?.data?.success) {
        setFastingHistories(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching history", error);
    }
  };

  const formattedTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Function to reset the timer and progress
  const handleEndFast = () => {
    endFastingSession();
  };

  // Close modal and reset the progress
  const handleModalClose = () => {
    setModalVisible(false);
    setRemainingTime(0); // Reset remaining time
    setFill(0); // Reset circular progress fill
  };

  const MAX_HOURS = 20; // for scaling

  const FastingBarChart = (data) => {
    return (
      <View style={styles.container}>
        <View style={styles.chart}>
          {data.map((item, index) => {
            const barHeight = (item.duration / MAX_HOURS) * 160;
            return (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: item.goalMet ? "#B6FF5B" : "#333",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      { color: item.goalMet ? "#000" : "#fff" },
                    ]}
                  >
                    {item.duration}
                  </Text>
                </View>
                <Text style={[styles.dayLabel]}>{item.day}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: "#B6FF5B" }]} />
            <Text style={styles.legendText}>Goal met</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: "#333" }]} />
            <Text style={styles.legendText}>Goal not met</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Container>
      <Header
        title={"Fasting"}
        showBackButton={true}
      />

      <TabContainer
        activeTab={activeTab}
        onTabClick={handleTabClick}
        tabs={tabs}
      />

      {activeTab === "Current Fast" && (
        <>
          {!selectedPlan && ( // Hide this view if a plan is selected
            <View style={styles.content}>
              <View
                style={{
                  height: 140,
                  backgroundColor: colors.bgColor,
                  borderRadius: 15,
                  padding: 16,
                  gap: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.medium,
                      fontFamily: "Poppins-Bold",
                      color: "white",
                    }}
                  >
                    Ready to Begin Your Fast?
                  </Text>
                  <FastingIcon />
                </View>
                <Text
                  style={{
                    fontSize: FontSize.small,
                    fontFamily: "Poppins-Regular",
                    color: "white",
                  }}
                >
                  Kickstart your journey to better health by choosing a fasting
                  plan that suits your lifestyle.
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("FastingPlans", {
                      currentPlan: selectedPlan,
                    })
                  }
                  style={{
                    backgroundColor: colors.green,
                    width: 100,
                    paddingVertical: 3,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "Poppins-Bold",
                    }}
                  >
                    Explore Plans
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {selectedPlan && ( // Display selected plan details
            <View style={{ marginTop: 20 }}>
              <AnimatedCircularProgress
                style={{ marginHorizontal: "auto" }}
                size={210}
                width={20}
                fill={fill}
                tintColor={colors.green}
                backgroundColor={colors.bgColor}
                rotation={0}
                lineCap="round"
              >
                {() => (
                  <>
                    <Text style={styles.remainingTime}>Remaining time</Text>
                    <Text style={styles.remaining}>
                      {`${formattedTime(remainingTime)} /\n${formattedTime(
                        totalDuration
                      )}`}
                    </Text>
                  </>
                )}
              </AnimatedCircularProgress>

              <CustomButton
                title={"End Fast"}
                onPress={handleEndFast} // Open modal on button press
                style={{
                  width: 90,
                  justifyContent: "center",
                  marginHorizontal: "auto",
                  marginTop: 20,
                }}
                textStyle={{ fontSize: FontSize.medium }}
              />

              <View style={{ marginTop: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: FontSize.regular,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Current Fasting Plan
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("FastingPlans", {
                        currentPlan: selectedPlan.fastingPlan,
                      })
                    }
                  >
                    <Text
                      style={{
                        color: colors.green,
                        fontSize: FontSize.small,
                        fontWeight: "bold",
                      }}
                    >
                      Explore More
                    </Text>
                  </TouchableOpacity>
                </View>

                <FastingCard
                  plan={selectedPlan?.fastingPlan}
                  currentPlan={selectedPlan}
                />

                <Text
                  style={{
                    color: "white",
                    fontSize: FontSize.regular,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  Upcoming Fasting Plan
                </Text>
                <FastingCard
                  plan={selectedPlan?.fastingPlan}
                  currentPlan={selectedPlan}
                />
              </View>
            </View>
          )}
        </>
      )}

      {activeTab === "Stats and History" && (
        <>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                marginTop: 24,
              }}
            >
              <StatsHistoryCard
                label={"Completed Fasts"}
                value={fastingStats?.completedFasts}
                icon={ProgressIcon}
              />
              <StatsHistoryCard
                label={"Longest Fast"}
                value={fastingStats?.longestFastHours}
                icon={ProgressIcon}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 16,
                gap: 16,
              }}
            >
              <StatsHistoryCard
                label={"Incomplete Fast"}
                value={fastingStats?.incompletedFasts}
                icon={ProgressIcon}
              />
              <StatsHistoryCard
                label={"Fast Type"}
                value={fastingStats?.longestFastType}
                icon={FastTypeIcon}
              />
            </View>

            <View style={{ flexDirection: "row", marginTop: 40 }}>
              <Text
                style={{
                  fontSize: FontSize.regular,
                  fontFamily: "Poppins-Bold",
                  color: "white",
                  flex: 1,
                }}
              >
                Fasting History
              </Text>

              {/* <TouchableOpacity
                style={{
                  borderRadius: 8,
                  borderWidth: 0.8,
                  paddingHorizontal: 10,
                  borderColor: colors.green,
                  paddingVertical: 4,
                }}
                onPress={() => setFilterModalVisible(true)}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: FontSize.medium,
                  }}
                >
                  {selectedFilter}
                </Text>
              </TouchableOpacity> */}
            </View>

            {FastingBarChart(fastingHistories)}
          </View>
          <CustomButton
            title={"Explore more Fasting Plans"}
            onPress={() =>
              navigation.navigate("FastingPlans", {
                currentPlan: selectedPlan,
              })
            }
          />
        </>
      )}

      {/* Modal for ending fast */}
      <CustomModal
        visible={modalVisible}
        onClose={handleModalClose}
        modalText={"Your fast has ended!"}
        modalIcon={<FastingIcon />} // Customize your success icon here
      />

      {/* Modal for unit selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Filter</Text>
            {filters.map((filter, index) => (
              <TouchableOpacity
                key={`${index}`}
                style={[styles.unitOption]}
                onPress={() => {
                  setSelectedFilter(filter);
                  setFilterModalVisible(false);
                }}
              >
                <Text style={[styles.unitOptionText]}>{filter}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 30,
  },
  remainingTime: {
    color: "white",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  remaining: {
    color: colors.green,
    fontSize: FontSize.large,
    fontFamily: "Poppins-SemiBold",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 180,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: "center",
    width: 30,
  },
  bar: {
    width: 20,
    borderRadius: 6,
  },
  dayLabel: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 6,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: "#fff",
    fontSize: 12,
  },
  container: {
    padding: 16,
    backgroundColor: "#111",
    borderRadius: 12,
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
  selectedUnit: {
    backgroundColor: colors.green,
  },
  unitOptionText: {
    color: "#fff",
    fontSize: FontSize.regular,
    textAlign: "center",
  },
  selectedUnitText: {
    color: "#000",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: FontSize.regular,
    textAlign: "center",
  },
});

export default FastingScreen;

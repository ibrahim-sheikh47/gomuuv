import { useNavigation, useRoute } from "@react-navigation/native"; // Import useRoute
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  const { token, userData } = useSelector((state) => ({
    token: state.Auth?.token,
    userData: state.Auth?.data,
  }));

  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [fastingStats, setFastingStats] = useState({}); // Modal visibility state

  // Get the selected plan from navigation params
  const selectedPlan = route.params?.selectedPlan;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Stats and History") {
      getFastingHistory();
    }
  };

  const [fill, setFill] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0); // Total duration in seconds

  useEffect(() => {
    if (selectedPlan) {
      // Check if a selected plan is available
      const durationInSeconds =
        extractNumberBeforeColon(selectedPlan?.type) * 3600; // Convert hours to seconds
      setTotalDuration(durationInSeconds);
      setRemainingTime(durationInSeconds);
    }
  }, [selectedPlan]);

  useEffect(() => {
    let interval;
    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
        setFill((prev) => prev + 100 / totalDuration); // Increment fill based on total duration
      }, 1000); // Update every second
    }

    return () => clearInterval(interval);
  }, [remainingTime, totalDuration]);

  const endFastingSession = async () => {
    try {
      let payload = { user: userData?._id, fastingPlan: selectedPlan?._id };
      const res = await API.post(
        END_POINTS.END_FASTING_SESSION,
        payload,
        token
      );
      if (res.data.success) {
        setModalVisible(true); // Show the modal
      }
    } catch (error) {
      console.log(error);
    }
  };

  function extractNumberBeforeColon(timeString) {
    const parts = timeString.split(":");
    return parseInt(parts[0], 10);
  }

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

  return (
    <Container>
      <Header
        title={"Fasting"}
        showBackButton={true}
        rightIcon1={<SearchIcon />}
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
                  onPress={() => navigation.navigate("FastingPlans")}
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
                      {formattedTime(remainingTime)}
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
                    onPress={() => navigation.navigate("FastingPlans")}
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

                <FastingCard plan={selectedPlan} />

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
                <FastingCard plan={selectedPlan} />
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
                label={"Weekly Progress"}
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
            <Text
              style={{
                fontSize: FontSize.regular,
                fontFamily: "Poppins-Bold",
                color: "white",
                marginTop: 40,
              }}
            >
              Fasting History
            </Text>
          </View>
          <CustomButton
            title={"Explore more Fasting Plans"}
            onPress={() => navigation.navigate("FastingPlans")}
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
    fontSize: FontSize.xxlarge,
    fontFamily: "Poppins-SemiBold",
  },
});

export default FastingScreen;

import DateTimePicker from "@react-native-community/datetimepicker"; // Ensure you have this library installed
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, View } from "react-native";
import FastingIcon from "../../assets/svgs/FastingIcon";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import Header from "../../components/Header";
import { MealItem } from "../../components/MealItem";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { useSelector } from "react-redux";
import { FontSize } from "../../utils/font";

const FastingPlanDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, type, description, selectedPlan } = route.params;

  const [startTime, setStartTime] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { token, userData } = useSelector((state) => ({
    token: state.Auth?.token,
    userData: state.Auth?.data,
  }));

  const [filteredMeals, setFilteredMeals] = useState(
    selectedPlan?.mealsToBreakFast || []
  );

  // Function to calculate end time based on duration
  const calculateEndTime = (start) => {
    if (!start) return null; // Check if start time is defined
    const end = new Date(start);
    end.setHours(end.getHours() + extractNumberBeforeColon(selectedPlan?.type)); // Add duration hours to start time
    return end;
  };

  function extractNumberBeforeColon(timeString) {
    const parts = timeString.split(":");
    return parseInt(parts[0], 10);
  }

  // Calculate endTime based on startTime and duration
  const endTime = calculateEndTime(startTime);

  const startFastingSession = async () => {
    try {
      let payload = { user: userData?._id, fastingPlan: selectedPlan?._id };
      const res = await API.post(
        END_POINTS.GET_ALL_FASTING_HISTORY,
        payload,
        token
      );
      if (res.data.success) {
        console.log("Session Start", JSON.stringify(res.data, null, 2));
        const currentTime = new Date();
        openModal();
        setStartTime(currentTime); // Set current time as start time
        setShowPicker(false); // Close the picker if it was open

        navigation.navigate("FastingScreen", {
          selectedPlan,
          title,
          type,
          description,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle starting now
  const handleStartNow = () => {
    startFastingSession();
  };

  const handleStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime; // Use the selected time or keep the current time
    if (event.type === "set") {
      setStartTime(currentTime); // Set the selected start time
    }
    setShowPicker(false); // Always close the picker, whether time is selected or not
  };

  // Format start time to display day and time
  const formatDateTime = (date) => {
    const options = {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options); // Format to 'Fri, 12:00 PM'
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <Container style={styles.container}>
      <Header title={`${title}`} showBackButton={true} />

      <Text style={styles.elapsedTimeText}>
        Elapsed Time: {selectedPlan?.duration?.value} hrs
      </Text>

      <View style={styles.buttonContainer}>
        <View>
          <CustomButton
            title={"Start Now"}
            style={{ width: 118, height: 33 }}
            textStyle={{ fontSize: 14 }}
            onPress={handleStartNow}
          />
          <View>
            <Text style={styles.timeText}>Start Time:</Text>
            <Text style={styles.timeDetail}>
              {selectedPlan?.fastingTime?.start
                ? formatDateTime(new Date(selectedPlan?.fastingTime?.start))
                : "Not Set"}
              {/* Display formatted start time */}
            </Text>
          </View>
        </View>
        <View>
          <CustomButton
            title={"Start Later"}
            style={{ width: 118, height: 33 }}
            textStyle={{ fontSize: 14 }}
            onPress={() => setShowPicker(true)}
          />
          {endTime && (
            <View>
              <Text style={styles.timeText}>End Time</Text>
              <Text style={styles.timeDetail}>
                {endTime ? formatDateTime(endTime) : "Not Set"}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Date/Time Picker for Start Time */}
      {showPicker && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={startTime || new Date()} // Default to current time if startTime is null
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleStartTimeChange}
            />
          </View>
        </Modal>
      )}
      <Text
        style={{
          marginTop: 40,
          color: "#fff",
          fontSize: FontSize.regular,
          fontFamily: "Poppins-Bold",
        }}
      >
        Meals to break your {""}
        {type} fast
      </Text>

      <FlatList
        vertical
        data={filteredMeals} // Use the filtered meals here
        keyExtractor={(item) => item._id?.toString()} // Ensure the id is a string
        renderItem={({ item }) => (
          <MealItem
            style={{ width: "100%" }}
            mealName={item.name}
            mealImage={item.mealImage}
            calories={item.calories}
            time={item?.preparationTime}
          />
        )}
        contentContainerStyle={{ gap: 10, marginBottom: 20 }}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <>
            <Text
              style={{
                color: "white",
                fontFamily: "Poppins-Medium",
                fontSize: FontSize.xlarge,
                textAlign: "center",
                marginTop: 30,
              }}
            >
              NO PLANS YET!
            </Text>
          </>
        }
      />

      <CustomModal
        visible={modalVisible}
        onClose={closeModal}
        modalIcon={<FastingIcon />}
        modalText={"Your fast has started!"}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  timeText: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Medium",
    color: "#F8F8F8",
    marginTop: 30,
  },
  timeDetail: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Regular",
    color: "#AFAFAF",
  },
  elapsedTimeText: {
    marginVertical: 30,
    color: "#fff",
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 40,
    justifyContent: "center",
  },
  pickerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FastingPlanDetail;

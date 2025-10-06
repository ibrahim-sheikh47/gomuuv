import DateTimePicker from "@react-native-community/datetimepicker"; // Ensure you have this library installed
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
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
import { colors } from "../../constants/colors";
import TwoStepDateTimePicker from "../../components/TwoStepDateTimePicker";
import { toastMessage } from "../../components/toastMessage";
import moment from "moment";

const FastingPlanDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedPlan, currentPlan } = route.params;

  const [startTime, setStartTime] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { token, data: userData } = useSelector((state) => state.Auth);

  const filteredMeals = selectedPlan?.mealsToBreakFast || [];

  useEffect(() => {
    if (startTime) {
      setTimeout(() => {
        startFastingSession();
      }, 1000);
    }
  }, [startTime]);

  const startFastingSession = async () => {
    try {
      let payload = {
        user: userData?._id,
        fastingPlan: selectedPlan?._id,
        ...(startTime && {
          startLaterAt: startTime.toISOString(),
        }),
      };
      const res = await API.post(
        END_POINTS.GET_ALL_FASTING_HISTORY,
        payload,
        token
      );
      if (res.data.success) {
        const currentTime = new Date();
        openModal();
        setStartTime(currentTime); // Set current time as start time
        setShowPicker(false); // Close the picker if it was open

        if (startTime) {
          toastMessage({
            text1: `${res.data.message}${moment(res.data.data).format(
              "DD/MM/yyyy - hh:mm A"
            )}`,
            type: "success",
          });
        }

        navigation.goBack();
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle starting now
  const handleStartNow = () => {
    startFastingSession();
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
      <Header title={`${selectedPlan?.name}`} showBackButton={true} />

      <View style={{ marginVertical: 30 }}>
        <Text style={styles.elapsedTimeText}>
          Plan Duration:{" "}
          <Text style={{ fontFamily: "Poppins-Regular" }}>
            {selectedPlan?.totalDuration?.value}{" "}
            {selectedPlan?.totalDuration?.unit}
          </Text>
        </Text>
        <Text style={styles.elapsedTimeText}>
          Fasting Duration:{" "}
          <Text style={{ fontFamily: "Poppins-Regular" }}>
            {selectedPlan?.fastingDuration?.value}{" "}
            {selectedPlan?.fastingDuration?.unit}
          </Text>
        </Text>
        <Text style={styles.elapsedTimeText}>
          Eating Duration:{" "}
          <Text style={{ fontFamily: "Poppins-Regular" }}>
            {selectedPlan?.totalDuration?.value -
              selectedPlan?.fastingDuration?.value}{" "}
            {selectedPlan?.totalDuration?.unit}
          </Text>
        </Text>

        <Text style={styles.elapsedTimeText}>
          Best For:{" "}
          <Text style={{ fontFamily: "Poppins-Regular" }}>
            {selectedPlan?.bestFor}
          </Text>
        </Text>
      </View>

      {!currentPlan && (
        <View style={styles.buttonContainer}>
          <View>
            <CustomButton
              title={"Start Now"}
              style={{ width: 118, height: 33 }}
              textStyle={{ fontSize: 14 }}
              onPress={handleStartNow}
            />
            {startTime && (
              <View>
                <Text style={styles.timeText}>Start Time:</Text>
                <Text style={styles.timeDetail}>
                  {formatDateTime(startTime)}
                </Text>
              </View>
            )}
          </View>
          <View>
            <CustomButton
              title={"Start Later"}
              style={{ width: 118, height: 33 }}
              textStyle={{ fontSize: 14 }}
              onPress={() => setShowPicker(true)}
            />
          </View>
        </View>
      )}

      {currentPlan && (
        <Text
          style={{
            color: colors.green,
            fontSize: FontSize.xlarge,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          You are already fasting, two fasts cannot start at a time
        </Text>
      )}

      <TwoStepDateTimePicker
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        startTime={startTime}
        setStartTime={setStartTime}
      />

      {selectedPlan.tips !== "" && (
        <View>
          <Text
            style={{
              marginTop: 40,
              color: "#fff",
              fontSize: FontSize.regular,
              fontFamily: "Poppins-Bold",
            }}
          >
            Tips:
          </Text>

          <Text
            style={{
              color: "#fff",
              fontSize: FontSize.regular,
              fontFamily: "Poppins-Regular",
            }}
          >
            {selectedPlan?.tips.replace(/\\t/g, "\t")}
          </Text>
        </View>
      )}

      {filteredMeals.length > 0 && (
        <Text
          style={{
            marginTop: 40,
            color: "#fff",
            fontSize: FontSize.regular,
            fontFamily: "Poppins-Bold",
          }}
        >
          Meals to break your fast
        </Text>
      )}

      {filteredMeals.length > 0 && (
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
              onPress={() => {
                navigation.navigate("MealDetailScreen", {
                  meal: item,
                  source: "dailyPlan",
                });
              }}
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
                No meals
              </Text>
            </>
          }
        />
      )}

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

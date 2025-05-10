import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../constants/colors";
import EditIcon from "../../assets/svgs/EditIcon";
import { FontSize } from "../../utils/font";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { useSelector } from "react-redux";

const ActivityScreen = () => {
  const route = useRoute();
  const { activityType, activityName } = route.params;
  const navigation = useNavigation();
  const [formValues, setFormValues] = useState({
    pace: "",
    timeHours: "",
    timeMinutes: "",
    distance: "",
    distanceUnit: "mi",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const { token } = useSelector((state) => ({
    token: state.Auth?.token,
  }));

  const distanceUnits = [
    { label: "Miles", value: "mi" },
    { label: "Inches", value: "in" },
    { label: "Feet", value: "ft" },
  ];

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  function convertToMinutes(hours, minutes) {
    return hours * 60 + minutes;
  }

  const createGoal = async () => {
    try {
      console.log(activityType);
      const response = await API.post(
        `${END_POINTS.GOALS}`,
        {
          type: activityType,
          targetDistance: {
            value: formValues.distance,
            unit: formValues.distanceUnit,
          },
          targetDuration: {
            value: convertToMinutes(
              parseInt(formValues.timeHours),
              parseInt(formValues.timeMinutes)
            ),
            unit: "minute",
          },
        },
        token
      );

      if (response?.data?.success) {
        route?.params?.refresh();
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = () => {
    createGoal();
    // navigation.navigate("ActivityDetailScreen", {
    //   activityName: activityName,
    //   distance: formValues.distance,
    //   time: `${formValues.timeHours}h ${formValues.timeMinutes}m`,
    //   distanceUnit: formValues.distanceUnit,
    // });
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectUnit = (unit) => {
    handleInputChange("distanceUnit", unit);
    toggleModal();
  };

  return (
    <Container>
      <Header title={activityName} showBackButton={true} />

      <ScrollView>
        <Text
          style={{
            color: "#fff",
            marginVertical: 30,
            fontSize: FontSize.regular,
            fontFamily: "Poppins-Bold",
          }}
        >
          Set Your Goal
        </Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <InputField
              label={"Time (Hours)"}
              placeholder={"Enter Hours"}
              value={formValues.timeHours}
              onChangeText={(value) => handleInputChange("timeHours", value)}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.editIcon}>
              <EditIcon />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <InputField
              label={"(Minutes)"}
              placeholder={"Enter Minutes"}
              value={formValues.timeMinutes}
              onChangeText={(value) => handleInputChange("timeMinutes", value)}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.editIcon}>
              <EditIcon />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <InputField
              label="Distance"
              value={formValues.distance}
              onChangeText={(value) => handleInputChange("distance", value)}
              placeholder="Enter distance"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.editIcon}>
              <EditIcon />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.unitSelector} onPress={toggleModal}>
            <Text style={styles.unitText}>{formValues.distanceUnit}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomButton title={"Save"} onPress={handleSave} />

      {/* Modal for unit selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Unit</Text>
            {distanceUnits.map((unit) => (
              <TouchableOpacity
                key={unit.value}
                style={[
                  styles.unitOption,
                  formValues.distanceUnit === unit.value && styles.selectedUnit,
                ]}
                onPress={() => selectUnit(unit.value)}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    formValues.distanceUnit === unit.value &&
                      styles.selectedUnitText,
                  ]}
                >
                  {unit.label} ({unit.value})
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  unitSelector: {
    height: 50,
    width: 100,
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: "#1A1919",
    justifyContent: "center",
    alignItems: "center",
  },
  unitText: {
    color: "#fff",
    fontSize: FontSize.regular,
  },
  editIcon: {
    position: "absolute",
    tintColor: colors.green,
    right: 15,
    bottom: 30,
    width: 12,
    height: 12,
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

export default ActivityScreen;

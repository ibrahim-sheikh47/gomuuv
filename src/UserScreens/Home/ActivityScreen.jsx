import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Container from "../../components/Container";
import Header from "../../components/Header";
import icons from "../../constants/icons";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../constants/colors";

const ActivityScreen = () => {
  const route = useRoute();
  const { activityType, activityName } = route.params;
  const navigation = useNavigation();
  const [formValues, setFormValues] = useState({
    pace: "",
    timeHours: "",
    timeMinutes: "",
    distance: "",
    distanceUnit: "",
  });

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleSave = () => {
    navigation.navigate("ActivityDetailScreen", {
      activityName: activityType,
      distance: formValues.distance,
      time: `${formValues.timeHours}h ${formValues.timeMinutes}m`,
      distanceUnit: formValues.distanceUnit,
    });
  };

  return (
    <Container>
      <Header title={activityName} showBackButton={true} />

      <ScrollView>
        <Text
          style={{
            color: "#fff",
            marginVertical: 30,
            fontSize: 16,
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
            <Image style={styles.editIcon} source={icons.edit} />
          </View>
          <Image
            source={icons.colon}
            style={{ width: 6, height: 18, marginTop: 30 }}
          />
          <View style={{ flex: 1 }}>
            <InputField
              label={"(Minutes)"}
              placeholder={"Enter Minutes"}
              value={formValues.timeMinutes}
              onChangeText={(value) => handleInputChange("timeMinutes", value)}
              keyboardType="numeric"
            />
            <Image style={styles.editIcon} source={icons.edit} />
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
            <Image style={styles.editIcon} source={icons.edit} />
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formValues.distanceUnit}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleInputChange("distanceUnit", itemValue)
              }
              dropdownIconColor={colors.green}
            >
              <Picker.Item label="mi" value="mi" />
              <Picker.Item label="in" value="in" />
              <Picker.Item label="ft" value="ft" />
            </Picker>
          </View>
        </View>
      </ScrollView>

      <CustomButton title={"Save"} onPress={handleSave} />
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
  pickerContainer: {
    height: 50,
    width: 100,
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: "#1A1919",
  },
  picker: {
    height: "100%",
    width: "100%",
    color: "#fff",
  },
  editIcon: {
    position: "absolute",
    tintColor: colors.green,
    right: 15,
    bottom: 30,
    width: 12,
    height: 12,
  },
});

export default ActivityScreen;

import { Image, StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState } from "react";
import Container from "../../../components/Container";
import Header from "../../../components/Header";
import CustomButton from "../../../components/CustomButton";
import icons from "../../../constants/icons";
import { colors } from "../../../constants/colors";
import InputField from "../../../components/InputField";
import { useNavigation, useRoute } from "@react-navigation/native";
import images from "../../../constants/images";

const AddDevice = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { onAddDevice } = route.params || {}; // Callback to send selected devices back

  const [devices, setDevices] = useState([
    { id: 1, name: "Device 1", image: images.device },
    { id: 2, name: "Device 2", image: images.device },
    { id: 3, name: "Device 3", image: images.device },
  ]); // Simulated device list

  const [searchText, setSearchText] = useState(""); // Track search input

  const handleSearchAgain = () => {
    console.log("Searching for devices...");
    setDevices([
      { id: 4, name: "Device 4", image: images.device },
      { id: 5, name: "Device 5", image: images.device },
    ]);
  };

  const handleSelectDevice = (device) => {
    if (onAddDevice) {
      onAddDevice(device); // Send selected device back
      navigation.goBack(); // Navigate back to Device screen
    }
  };
  const renderDevice = ({ item }) => (
    <View style={styles.deviceCard}>
      <Image source={item.image} style={styles.deviceImage} />
      <Text style={styles.deviceName}>{item.name}</Text>
      <CustomButton
        title="Add"
        onPress={() => handleSelectDevice(item)} // Add this device
        style={{ marginTop: 10, height: 30 }}
        textStyle={{ fontSize: 16 }}
      />
    </View>
  );

  return (
    <Container>
      <Header title="Device" showBackButton />

      <View style={styles.content}>
        <Text style={styles.title}>Add Device</Text>
        {/* Input Field with dynamic placeholder */}
        <InputField
          placeholder={
            devices.length === 0 ? "No devices found" : "Searching for devices"
          }
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />

        <FlatList
          data={devices}
          renderItem={renderDevice}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2} // Ensure 2 items per row
          columnWrapperStyle={styles.row} // Styling for each row
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => null} // Avoid extra message since it’s handled in InputField
        />
      </View>

      <CustomButton title="Search Again" onPress={handleSearchAgain} />
    </Container>
  );
};

export default AddDevice;

const styles = StyleSheet.create({
  content: {
    marginVertical: 30,
    flex: 1,
  },
  title: {
    color: "#f8f8f8",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  row: {
    justifyContent: "space-between", // Space between cards in a row
    marginBottom: 16,
  },
  deviceCard: {
    borderColor: colors.bgColor,
    borderWidth: 1,
    flex: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8, // Spacing between cards
  },
  deviceImage: {
    height: 130,
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceName: {
    color: "#f8f8f8",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
});

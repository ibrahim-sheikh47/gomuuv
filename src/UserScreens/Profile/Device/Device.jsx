import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Container from "../../../components/Container";
import Header from "../../../components/Header";
import CustomButton from "../../../components/CustomButton";
import icons from "../../../constants/icons";
import { colors } from "../../../constants/colors";
import { useNavigation } from "@react-navigation/native";

const Device = () => {
  const navigation = useNavigation();
  const [selectedDevices, setSelectedDevices] = useState([]); // Store selected devices

  const handleAddDevice = () => {
    // Simulate adding a new device (this can be fetched from AddDevice screen)
    const newDevice = {
      id: selectedDevices.length + 1,
      name: `Device ${selectedDevices.length + 1}`,
      image: icons.device, // Replace with the actual device image
    };
    setSelectedDevices([...selectedDevices, newDevice]);
  };

  const handleRemoveDevice = (id) => {
    // Remove device from the list by filtering out the device with the given id
    setSelectedDevices(selectedDevices.filter((device) => device.id !== id));
  };

  const renderDevice = ({ item }) => (
    <View style={styles.deviceCard}>
      <Image source={item.image} style={styles.deviceImage} />
      <Text style={styles.deviceName}>{item.name}</Text>
      {/* Remove button */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveDevice(item.id)}
      >
        <Text style={styles.removeText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Container>
      <Header title="Device" showBackButton />

      <View style={styles.imageContainer}>
        <Image source={icons.device} style={styles.mainImage} />
      </View>

      <CustomButton
        title="Add Device"
        onPress={() =>
          navigation.navigate("AddDevice", { onAddDevice: handleAddDevice })
        }
      />
      <CustomButton
        title="Scanner"
        style={styles.scannerButton}
        textStyle={styles.scannerText}
        iconStyle={{ width: 12, height: 12 }}
      />
      <Text style={styles.title}>Your Device</Text>

      {selectedDevices.length > 0 ? (
        <FlatList
          data={selectedDevices}
          renderItem={renderDevice}
          keyExtractor={(item) => item.id.toString()}
          style={styles.deviceList}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
      ) : (
        <Text style={styles.noDeviceText}>No devices added yet.</Text>
      )}
    </Container>
  );
};

export default Device;

const styles = StyleSheet.create({
  imageContainer: {
    marginVertical: 40,
    alignItems: "center",
  },
  mainImage: {
    width: 150,
    height: 150,
  },
  scannerButton: {
    borderColor: colors.green,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  scannerText: {
    color: colors.green,
  },
  title: {
    color: "#f8f8f8",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginTop: 20,
    textAlign: "center",
  },
  deviceList: {
    marginTop: 20,
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
    position: "relative", // For positioning the remove button
  },
  deviceImage: {
    height: 130,
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
    objectFit: "contain",
  },
  deviceName: {
    color: "#f8f8f8",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.red,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  removeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  noDeviceText: {
    color: "#f8f8f8",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    marginTop: 20,
  },
});

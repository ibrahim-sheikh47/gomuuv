import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors } from "../constants/colors"; // Adjust the import path as needed
import { IconButton } from "react-native-paper";
import { FontSize } from "../utils/font";

const GoalModal = ({ visible, onClose, modalText, textStyle, onSave }) => {
  const [value, setValue] = useState(0); // State to track the current value

  const handleIncrement = () => {
    setValue(value + 1); // Increment the value by 1
  };

  const handleDecrement = () => {
    if (value > 0) {
      setValue(value - 1); // Decrement the value by 1, ensuring it doesn't go below 0
    }
  };

  const handleSave = () => {
    onSave(value);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { width: 300, height: 330 }]}>
          <Text style={[styles.modalText, textStyle]}>{modalText}</Text>

          {/* Row for value display and increment/decrement buttons */}
          <View style={styles.valueContainer}>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={handleDecrement}
            >
              <Text style={styles.adjustButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.valueText}>{value} kg</Text>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={handleIncrement}
            >
              <Text style={styles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Save Changes button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.absolute} onPress={onClose}>
            <IconButton
              icon="close" // Specify the icon name
              size={24} // Icon size
              iconColor="white"
              style={styles.closeBtn}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default GoalModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    position: "relative",
    backgroundColor: colors.black,
    borderRadius: 10,
    borderColor: "#696969",
    borderWidth: 1,
    alignItems: "center", // Align content horizontally
    padding: 10, // Optional padding to ensure no content touches the edges
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 40,
  },
  modalText: {
    fontSize: FontSize.medium,
    color: "#f8f8f8",
    fontFamily: "Poppins-SemiBold",
    textAlign: "center", // Ensure text is centered
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center", // Center items vertically within the row
  },
  valueText: {
    fontSize: 34,
    color: colors.green,
    fontFamily: "Poppins-Bold",
    marginHorizontal: 30, // Add some space between the value and buttons
    width: 100, // Fixed width to ensure spacing is consistent
    textAlign: "center", // Center the value text
    marginTop: 5,
  },
  adjustButton: {
    backgroundColor: colors.bgColor,
    borderRadius: 30,
    paddingVertical: 2,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  adjustButtonText: {
    color: "#fff",
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
  },
  saveButton: {
    backgroundColor: colors.green,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    width: "70%", // Full width for the button
    alignItems: "center",
  },
  buttonText: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Bold",
  },
  absolute: {
    position: "absolute",
    top: -20,
    right: -24,
  },
  closeBtn: {
    backgroundColor: colors.bgColor,
  },
});

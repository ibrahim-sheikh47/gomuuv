import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors } from "../constants/colors"; // Adjust the import path as needed
import icons from "../constants/icons";
import { IconButton } from "react-native-paper";

const CustomModal = ({
  visible,
  onClose,
  modalText,
  modalIcon,
  textStyle,
  children,
  width = 205,
  height = 222,
  modalStyles,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { width: width, height: height },
            modalStyles,
          ]}
        >
          {/* Render icon only if modalIcon is provided */}
          {modalIcon && <View>{modalIcon}</View>}

          {/* Render modalText only if it exists */}
          {modalText && (
            <Text style={[styles.modalText, textStyle]}>{modalText}</Text>
          )}

          {/* Close button */}
          <TouchableOpacity style={styles.absolute} onPress={onClose}>
            <IconButton
              icon="close" // Specify the icon name
              size={24} // Icon size
              iconColor="white"
              style={styles.closeBtn}
            />
          </TouchableOpacity>

          {/* Render children only if they are provided */}
          {children && <View>{children}</View>}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

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
    justifyContent: "center", // Align content vertically
    padding: 10, // Optional padding to ensure no content touches the edges
    flexDirection: "column",
  },
  modalText: {
    fontSize: 14,
    color: colors.green,
    fontFamily: "Poppins-SemiBold",
    marginTop: 20,
    textAlign: "center", // Ensure text is centered
  },
  button: {
    backgroundColor: colors.green,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  modalIcon: {
    width: 60,
    height: 60,
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

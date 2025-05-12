import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";

const InputField = ({
  type,
  label,
  value,
  cusStyles,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoFocus = false,
  placeholder,
  unitType, // "height" | "weight" | undefined
  unitValue, // e.g., "cm", "ft-in"
  onUnitChange, // function to update unit
  compositeFields = [], // [{ key, value, onChangeText, placeholder }]
}) => {

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : new Date()
  );
  const inputRef = useRef(null);

  // States for modal visibility
  const [heightModalVisible, setHeightModalVisible] = useState(false);
  const [weightModalVisible, setWeightModalVisible] = useState(false);

  // Options for the dropdowns
  const heightUnitOptions = ["cm", "ft-in"];
  const weightUnitOptions = ["kg", "lbs"];

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      onChangeText(date.toISOString().split("T")[0]);
    }
  };

  const renderCompositeInputs = () => (
    <View style={styles.row}>
      {compositeFields.map((field) => (
        <TextInput
          key={field.key}
          value={field.value?.toString()}
          onChangeText={field.onChangeText}
          placeholder={field.placeholder}
          placeholderTextColor="#AFAFAF"
          keyboardType="numeric"
          style={[styles.input, styles.flexHalf]}
        />
      ))}

      {/* Unit selector */}
      {unitType && (
        <TouchableOpacity
          style={styles.unitSelector}
          onPress={() => setHeightModalVisible(true)}
        >
          <Text style={styles.unitSelectorText}>{unitValue}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input */}
      {type === "date" ? (
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.input,
            { flexDirection: "row-reverse", alignItems: "center" },
          ]}
        >
          <Text
            style={[
              styles.input,
              {
                flex: 1,
                textAlignVertical: "center",
                height: "auto",
                borderWidth: 0,
              },
              isFocused && { borderColor: colors.green },
              cusStyles,
            ]}
          >
            {selectedDate?.toDateString() ?? (placeholder || "Select Date")}
          </Text>
          <Icon name="calendar" size={20} color={"#888"} style={styles.icon} />
        </TouchableOpacity>
      ) : compositeFields.length > 0 && type === "height" ? (
        renderCompositeInputs()
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10}}>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                isFocused && { borderColor: colors.green },
                cusStyles,
              ]}
              value={value?.toString()}
              onChangeText={onChangeText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              secureTextEntry={secureTextEntry && !showPassword}
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor="#AFAFAF"
            />
            {secureTextEntry && (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.iconContainer}
              >
                <Icon
                  name={showPassword ? "eye" : "eye-slash"}
                  size={22}
                  color={"#888"}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Unit selector */}
          {unitType && (
            <TouchableOpacity
              style={styles.unitSelector}
              onPress={() =>
                type === "height"
                  ? setHeightModalVisible(true)
                  : setWeightModalVisible(true)
              }
            >
              <Text style={styles.unitSelectorText}>{unitValue}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <SelectionModal
        visible={heightModalVisible}
        onClose={() => setHeightModalVisible(false)}
        options={heightUnitOptions}
        onSelect={(value) => {
          onUnitChange(value);
        }}
        title="Select Height Unit"
      />

      <SelectionModal
        visible={weightModalVisible}
        onClose={() => setWeightModalVisible(false)}
        options={weightUnitOptions}
        onSelect={(value) => {
          onUnitChange(value);
        }}
        title="Select Weight Unit"
      />
    </View>
  );
};

// Custom modal selection component
const SelectionModal = ({ visible, onClose, options, onSelect, title }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginVertical: 10,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#1A1919",
    color: "#fff",
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Regular",
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 50,
    position: "relative",
  },
  flexHalf: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  label: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    marginBottom: 5,
  },
  iconContainer: {
    position: "absolute",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    right: 16,
    top: "50%",
    transform: [{ translateY: -16 }],
    zIndex: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 32,
  },
  modalContent: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 20,
  },
  unitOption: {
    paddingVertical: 10,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#212121",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    marginBottom: 15,
  },
  modalItem: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#fff",
    textAlign: "center",
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.green,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#fff",
  },

  unitSelector: {
    height: 50,
    width: 100,
    borderRadius: 10,
    backgroundColor: "#1A1919",
    justifyContent: "center",
    alignItems: "center",
  },
  unitSelectorText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
});

export default InputField;

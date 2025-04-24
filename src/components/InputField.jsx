import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
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
  placeholder, // Accept placeholder prop
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : new Date()
  );
  const inputRef = useRef(null);

  // Focus the input field when the component mounts
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      console.log(date.toISOString().split("T")[0]);
      onChangeText(date.toISOString().split("T")[0]); // Send formatted date to parent
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {/* Render label only if it exists */}

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
              { ...(isFocused && { borderColor: colors.green }) },
              cusStyles,
            ]}
          >
            {selectedDate?.toDateString() ?? (placeholder || "Select Date")}
          </Text>
          <Icon name="calendar" size={20} color={"#888"} style={styles.icon} />
        </TouchableOpacity>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              { ...(isFocused && { borderColor: colors.green }) },
              cusStyles,
            ]}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            placeholder={placeholder} // Set placeholder
            placeholderTextColor="#AFAFAF" // Set placeholder text color
          />
          {secureTextEntry && (
            <TouchableOpacity
              onPress={handleTogglePassword}
              style={styles.iconContainer}
            >
              <Icon
                name={showPassword ? "eye" : "eye-slash"}
                size={22}
                color={"#888888"}
              />
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
    </View>
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
    borderColor: "#444444", // Default border color
    backgroundColor: "#1A1919",
    color: "#fff",
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Regular",
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 50,
    position: "relative",
  },
  inputFocused: {
    borderColor: colors.green, // Border color when focused
  },
  iconContainer: {
    position: "absolute",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    right: 16,
    top: "50%",
    transform: [{ translateY: -16 }],
    zIndex: 2,
  },
  label: {
    fontSize: FontSize.medium,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    marginBottom: 5,
  },
});

export default InputField;

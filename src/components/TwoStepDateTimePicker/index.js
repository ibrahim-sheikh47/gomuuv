import React, { useState } from "react";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const TwoStepDateTimePicker = ({
  showPicker,
  setShowPicker,
  startTime,
  setStartTime,
}) => {
  const [tempDate, setTempDate] = useState(startTime || new Date());
  const [mode, setMode] = useState("date");

  const onChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      setMode("date");
      return;
    }

    if (mode === "date") {
      // Step 1 → user picked a date
      setTempDate(selectedDate || tempDate);
      setMode("time"); // next: show time picker
    } else {
      // Step 2 → user picked a time
      const finalDateTime = new Date(tempDate);
      if (selectedDate) {
        finalDateTime.setHours(selectedDate.getHours());
        finalDateTime.setMinutes(selectedDate.getMinutes());
      }
      setStartTime(finalDateTime);
      setShowPicker(false);
      setMode("date");
    }
  };

  // iOS can use datetime directly, Android needs two-step
  if (!showPicker) return null;

  return (
    <DateTimePicker
      value={tempDate}
      mode={Platform.OS === "ios" ? "datetime" : mode}
      is24Hour={false}
      display="spinner"
      onChange={onChange}
    />
  );
};

export default TwoStepDateTimePicker;

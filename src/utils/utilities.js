import { Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export function getResponsiveFontSize(value) {
  return RFValue(value, Dimensions.get("window").height);
}

export const formatElapsedTime2 = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return { hours, minutes, seconds: seconds % 60 };
};

export const formatElapsedTime = (totalSeconds = 0) => {
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  if (totalSeconds < 3600) {
    const minutes = parseInt(totalSeconds / 60);
    const secs = parseInt(totalSeconds % 60);
    return `${minutes}m ${secs}s`;
  }

  const hours = parseInt(totalSeconds / 3600);
  const minutes = parseInt(totalSeconds / 60);
  const secs = parseInt(totalSeconds % 60);
  return `${hours || 0}h ${minutes || 0}m ${secs || 0}s`;
};

export const formatDistance = (distance, unit = "km") => {
  let converted = distance;

  switch (unit) {
    case "mi": // miles
      converted = distance / 1609.34;
      break;

    case "km": // kilometers
      converted = distance / 1000;
      break;

    default:
      // assume meters if no valid unit
      converted = distance;
      unit = "m";
  }

  // Format: 2 decimals for km/mi, no decimals for meters
  let formatted;

  if (converted > 1000 && unit === "m") {
    formatted = `${(converted / 1000).toFixed(2)} km`;
  } else {
    formatted = `${converted.toFixed(2)} ${unit}`;
  }

  return { formatted, distance: converted };
};

export const convertDistanceToMeter = (distance, unit) => {
  let converted = distance;

  switch (unit) {
    case "mi": // miles
      converted = distance / 1609.34;
      break;

    case "km": // kilometers
      converted = distance / 1000;
      break;

    default:
      // assume meters if no valid unit
      converted = distance;
      unit = "m";
  }

  return converted;
};

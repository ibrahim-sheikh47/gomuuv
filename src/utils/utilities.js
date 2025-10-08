import { Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export function getResponsiveFontSize(value) {
  return RFValue(value, Dimensions.get("window").height);
}

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
  const formatted = converted.toFixed(2);

  return { formatted: `${formatted} ${unit}`, distance: converted };
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

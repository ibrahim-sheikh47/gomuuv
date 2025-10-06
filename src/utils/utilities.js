import { Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export function getResponsiveFontSize(value) {
  return RFValue(value, Dimensions.get("window").height);
}

// utils/fonts.js
import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// Global function for responsive font sizes
export const RF = (size) => {
  return width > 600 ? RFValue(size * 1.2, Dimensions.get("window").height) : RFValue(size, Dimensions.get("window").height);
};

// Predefined font sizes for consistency
export const FontSize = {
  xxsmall: RF(10),
  small: RF(12),
  medium: RF(14),
  regular: RF(16),
  large: RF(18),
  xlarge: RF(20),
  xxlarge: RF(22),
};

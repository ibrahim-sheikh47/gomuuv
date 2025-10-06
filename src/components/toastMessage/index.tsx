import React from "react";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastConfig,
  ToastShowParams,
} from "react-native-toast-message";
import { getResponsiveFontSize } from "../../utils/utilities";

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        height: "auto",
        paddingVertical: getResponsiveFontSize(10),
        borderLeftColor: "#22c55e",
        borderLeftWidth: getResponsiveFontSize(6),
      }}
      text1Style={{
        fontSize: getResponsiveFontSize(14),
        fontFamily: "Montserrat-Bold",
        color: "#111",
      }}
      text2Style={{
        fontSize: getResponsiveFontSize(11),
        fontFamily: "Montserrat-Medium",
        color: "#444",
      }}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        height: "auto",
        paddingVertical: getResponsiveFontSize(10),
        borderLeftColor: "#ef4444",
        borderLeftWidth: getResponsiveFontSize(6),
      }}
      text2NumberOfLines={0}
      text1Style={{
        fontSize: getResponsiveFontSize(14),
        fontFamily: "Montserrat-Bold",
        color: "#111",
      }}
      text2Style={{
        fontSize: getResponsiveFontSize(11),
        fontFamily: "Montserrat-Medium",
        color: "#444",
      }}
    />
  ),

  info: (props) => (
    <InfoToast
      {...props}
      style={{
        height: "auto",
        paddingVertical: getResponsiveFontSize(10),
        borderLeftColor: "#3b82f6",
        borderLeftWidth: getResponsiveFontSize(6),
      }}
      text2NumberOfLines={0}
      text1Style={{
        fontSize: getResponsiveFontSize(14),
        fontFamily: "Montserrat-Bold",
        color: "#111",
      }}
      text2Style={{
        fontSize: getResponsiveFontSize(11),
        fontFamily: "Montserrat-Medium",
        color: "#444",
      }}
    />
  ),
};

export const toastMessage = (props: ToastShowParams) => {
  if (props) {
    Toast.show(props);
  }
};

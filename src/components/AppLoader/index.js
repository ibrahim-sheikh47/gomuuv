import {
  View,
  ActivityIndicator,
  useWindowDimensions,
  Modal,
  StyleSheet,
} from "react-native";
import React from "react";
import { colors } from "../../constants/colors";
import { useLoader } from "../../contexts/LoaderContext";

export default function AppLoader() {
  const { height } = useWindowDimensions();
  const { loading } = useLoader();

  return (
    <Modal
      transparent
      visible={loading}
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        ]}
      >
        <View
          style={{
            height: height * 0.1,
            width: height * 0.1,
            padding: 25,
            borderRadius: (height * 0.1) / 5,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.white,
          }}
        >
          <ActivityIndicator size="large" color={colors.green} />
        </View>
      </View>
    </Modal>
  );
}

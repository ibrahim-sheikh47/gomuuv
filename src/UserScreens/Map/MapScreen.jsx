import { View } from "react-native";
import React from "react";
import Map from "../../components/Maps";

const MapScreen = () => {
  let loc = null;
  return (
    <View style={{ flex: 1 }}>
      <Map
        setAddress={(location) => {
          loc = location;
        }}
      />
    </View>
  );
};

export default MapScreen;

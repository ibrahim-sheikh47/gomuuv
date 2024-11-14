import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import images from "../../constants/images";
import { CustomCard } from "../../components/CustomCard";
import icons from "../../constants/icons";
import CustomButton from "../../components/CustomButton";

const FinishActivity = () => {
  const route = useRoute();
  const { activityName, distance, distanceUnit, time } = route.params;
  const navigation = useNavigation();

  return (
    <Container>
      <Header title={`${activityName}`} showBackButton={true} />
      <View style={{ flex: 1 }}>
        <Image
          source={images.walkingGraph}
          style={{ width: "100%", height: 200, marginVertical: 30 }}
        />
        <View style={styles.gridContainer}>
          <CustomCard
            label="Time Per Mile"
            icon={icons.timePerMile}
            message="8m:40s/mi"
          />
          <CustomCard label="Total Time" icon={icons.time} message={time} />
        </View>
        <View style={styles.gridContainer}>
          <CustomCard label="Pace" icon={icons.pace} message="1.1mi/hr" />
          <CustomCard
            label="Distance"
            icon={icons.distance}
            message={`${distance} ${distanceUnit}`}
          />
        </View>
      </View>
      <CustomButton
        title={"Finish"}
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
    </Container>
  );
};

export default FinishActivity;

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 16,
  },
});

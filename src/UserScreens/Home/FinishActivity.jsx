import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import images from "../../constants/images";
import { CustomCard } from "../../components/CustomCard";
import icons from "../../constants/icons";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../constants/colors";

const FinishActivity = () => {
  const route = useRoute();
  const { activityName, distance, distanceUnit, time, heartRate, calories } =
    route.params;
  const navigation = useNavigation();

  return (
    <Container>
      <Header title={`${activityName}`} showBackButton={true} />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.bgColor,
              gap: 7,
              paddingVertical: 6,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}
          >
            <Image source={icons.heartRate} style={{ width: 16, height: 16 }} />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins-Regular",
                color: "white",
              }}
            >
              {heartRate}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.bgColor,
              gap: 7,
              paddingVertical: 6,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}
          >
            <Image source={icons.calories} style={{ width: 16, height: 16 }} />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins-Regular",
                color: "white",
              }}
            >
              {calories}
            </Text>
          </View>
        </View>
        <Image
          source={images.walkingGraph}
          style={{ width: "100%", height: 200, marginVertical: 20 }}
        />
        <View style={styles.gridContainer}>
          <CustomCard
            label="Time Per Mile"
            icon={icons.timePerMile}
            message="8m:40s/mi"
          />
          <CustomCard
            label="Total Time"
            icon={icons.time}
            message={time}
            goal={"Goal: 30 min daily"}
          />
        </View>
        <View style={styles.gridContainer}>
          <CustomCard label="Pace" icon={icons.pace} message="1.1mi/hr" />
          <CustomCard
            label="Distance"
            icon={icons.distance}
            goal={"Goal: 2mi daily"}
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
    marginTop: 10,
    gap: 10,
  },
});

import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import images from "../../constants/images";
import { CustomCard } from "../../components/CustomCard";
import icons from "../../constants/icons";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../constants/colors";
import HeartRateIcon from "../../assets/svgs/HeartRateIcon";
import CaloriesIcon from "../../assets/svgs/CaloriesIcon";
import TimeIcon from "../../assets/svgs/TimeIcon";
import DistanceIcon from "../../assets/svgs/DistanceIcon";
import PaceIcon from "../../assets/svgs/PaceIcon";
import { FontSize } from "../../utils/font";

const FinishActivity = () => {
  const route = useRoute();
  const { activityName, distance, distanceUnit, time, heartRate, calories } =
    route.params;
  const navigation = useNavigation();

  return (
    <Container>
      <Header title={`${activityName}`} showBackButton={true} />
      <ScrollView style={{ flex: 1, marginBottom: 20 }}>
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
            <HeartRateIcon width={16} height={16} />
            <Text
              style={{
                fontSize: FontSize.small,
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
            <CaloriesIcon width={16} height={16} />
            <Text
              style={{
                fontSize: FontSize.small,
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
            iconImage={icons.timePerMile}
            message="0m:0s/mi"
          />
          <CustomCard
            label="Total Time"
            icon={TimeIcon}
            message={time}
            goal={"Goal: 30 min daily"}
          />
        </View>
        <View style={styles.gridContainer}>
          <CustomCard label="Pace" icon={PaceIcon} message="0mi/hr" />
          <CustomCard
            label="Distance"
            icon={DistanceIcon}
            goal={"Goal: 2mi daily"}
            message={`${distance} ${distanceUnit}`}
          />
        </View>
      </ScrollView>
      <CustomButton
        title={"Finish"}
        style={{ marginTop: 20 }}
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

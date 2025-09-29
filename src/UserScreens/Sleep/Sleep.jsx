import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import Tab5Icon from "../../assets/svgs/Tab5Icon";
import Selectable from "../../components/Selectable";
import { colors } from "../../constants/colors";
import { FontSize } from "../../utils/font";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const SleepScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");

  return (
    <Container>
      <Header title={"Sleep Tracker"} showBackButton={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 20 }}
      >
        <Selectable
          items={["Today", "Weekly", "Monthly", "Yearly"]}
          selectedItem={selectedPeriod}
          setSelectedItem={setSelectedPeriod}
        />

        <SleepScoreCard />

        <SleepInsights />

        <BedtimeCard />

        <SleepGraph />

        <DailyTips />
      </ScrollView>
    </Container>
  );
};

const SleepScoreCard = () => (
  <View style={styles.card}>
    <Text style={styles.sectionHeader}>Sleep Score</Text>
    <Text style={[styles.sleepScore, { alignSelf: "center" }]}>0</Text>
    <Text style={styles.percentageText}>You Slept Better Than 0% of Users</Text>
  </View>
);

const SleepInsights = () => (
  <View style={styles.card}>
    <Text style={styles.sectionHeader}>Sleep Insights</Text>
    <Text style={styles.totalSleep}>0h 0min</Text>

    {/* Sleep Stats */}
    <View style={styles.sleepStatRow}>
      <View style={styles.sleepStatBox}>
        <Text style={styles.sleepStatValue}>0h 0m</Text>
        <Text style={styles.sleepStatLabel}>Avg Deep Sleep</Text>
      </View>
      <View style={styles.sleepStatBox}>
        <Text style={styles.sleepStatValue}>0h 0m</Text>
        <Text style={styles.sleepStatLabel}>Avg Light Sleep</Text>
      </View>
    </View>

    <View style={styles.sleepStatRow}>
      <View style={styles.sleepStatBox}>
        <Text style={styles.sleepStatValue}>0 min</Text>
        <Text style={styles.sleepStatLabel}>Avg REM Sleep</Text>
      </View>
      <View style={styles.sleepStatBox}>
        <Text style={styles.sleepStatValue}>N/A</Text>
        <Text style={styles.sleepStatLabel}>Sleep Quality</Text>
      </View>
    </View>
  </View>
);

const BedtimeCard = () => (
  <View style={styles.card}>
    <Text style={styles.sectionHeader}>Bed Time</Text>
    <Text style={styles.bedtimeText}>9:00 pm - 9:00 am</Text>
    <Text style={styles.remainingTime}>
      in <Text style={{ color: colors.green }}>6 hours 22 min</Text>
    </Text>
  </View>
);

const SleepGraph = () => {
  const data = {
    labels: ["12am", "2am", "4am", "6am", "8am", "10am"],
    datasets: [
      {
        data: [3, 1, 2, 1, 3, 4], // Dummy Sleep levels: 0 (Awake), 4 (Deep sleep)
        strokeWidth: 2,
        color: () => colors.green,
      },
    ],
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionHeader}>Sleep Quality Analysis</Text>
      <LineChart
        data={data}
        width={width - 40}
        height={220}
        chartConfig={{
          backgroundColor: colors.bgColor,
          backgroundGradientFrom: colors.bgColor,
          backgroundGradientTo: colors.bgColor,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 255, 100, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: colors.green,
          },
        }}
        bezier
        style={{ marginVertical: 8, marginLeft: -40 }}
      />
    </View>
  );
};

const DailyTips = () => (
  <View style={styles.card}>
    <Text style={styles.sectionHeader}>Daily Tips</Text>
    <Text style={styles.tipText}>
      1. Create a bedtime routine by sleeping and waking up at the same time
      daily.{"\n2. "}Avoid caffeine and heavy meals 4-6 hours before bed.
      {"\n3. "}Use blackout curtains or an eye mask for complete darkness.
      {"\n4. "}Reduce screen time at least an hour before bedtime.
      {"\n5. "}Practice relaxation techniques like deep breathing or meditation.
      {"\n6. "}Keepthe bedroom cool, quiet, and comfortable.
      {"\n7. "}Exercise during the day but not right before bed.
      {"\n8. "}Avoid napping for more than 20 minutes during the day.
    </Text>
  </View>
);

export default SleepScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgColor,
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
  },
  sectionHeader: {
    color: "#fff",
    fontSize: FontSize.regular,
    fontFamily: "Poppins-Bold",
  },
  sleepScore: {
    fontSize: 36,
    color: colors.green,
    fontFamily: "Poppins-Bold",
    marginTop: 10,
  },
  percentageText: {
    color: "#afafaf",
    fontSize: FontSize.small,
    marginTop: 5,
    fontFamily: "Poppins-Regular",
  },
  totalSleep: {
    fontSize: FontSize.large,
    color: "#fff",
    fontFamily: "Poppins-Bold",
    marginVertical: 10,
    textAlign: "center",
  },
  sleepStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  sleepStatBox: {
    width: "48%",
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  sleepStatValue: {
    color: "#fff",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Bold",
  },
  sleepStatLabel: {
    color: "#afafaf",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
    marginTop: 5,
    textAlign: "center",
  },
  bedtimeText: {
    marginTop: 10,
    color: "#afafaf",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  remainingTime: {
    marginTop: 5,
    fontSize: FontSize.large,
    fontFamily: "Poppins-Bold",
    color: "#afafaf",
  },
  tipText: {
    marginTop: 10,
    color: "#afafaf",
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
  },
});

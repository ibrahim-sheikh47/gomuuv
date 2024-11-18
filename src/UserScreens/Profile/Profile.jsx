import React from "react";
import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import Container from "../../components/Container";
import BackHeader from "../../components/BackHeader";
import CustomButton from "../../components/CustomButton";
import images from "../../constants/images";
import SettingItem from "../../components/SettingItem";
import StatCard from "../../components/StatCard";
import { notificationsSettings, settings } from "../../utils/data";

const Profile = ({ navigation }) => {
  const height = "168cm";
  const weight = "57kg";
  const age = 20;
  return (
    <Container>
      <BackHeader title="Profile" showBackButton={true} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileImageContainer}>
          <Image source={images.dp} style={styles.profileImage} />
        </View>
        <View style={styles.statsContainer}>
          <StatCard label="Height" value={height} />
          <StatCard label="Weight" value={weight} />
          <StatCard label="Age" value={age} />
        </View>

        <Text style={styles.accountSettingsHeader}>Account Settings:</Text>
        {settings.map((item, index) => (
          <SettingItem
            key={index}
            icon={item.icon}
            text={item.text}
            onPress={() => navigation.navigate(item.route)}
          />
        ))}

        <Text style={styles.accountSettingsHeader}>Notifications:</Text>
        {notificationsSettings.map((item, index) => (
          <SettingItem
            key={index}
            icon={item.icon}
            text={item.text}
            onPress={() => navigation.navigate(item.route)}
          />
        ))}
      </ScrollView>

      <CustomButton
        title="Log Out"
        onPress={() => navigation.navigate("Login")}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginBottom: 20,
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 135,
    height: 135,
    borderRadius: 100,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },
  accountSettingsHeader: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
    marginTop: 20,
    fontSize: 16,
  },
});

export default Profile;

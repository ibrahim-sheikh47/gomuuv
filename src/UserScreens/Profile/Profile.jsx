import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DevicesIcon from "../../assets/svgs/DevicesIcon";
import NotificationsIcon from "../../assets/svgs/NotificationsIcon";
import BackHeader from "../../components/BackHeader";
import Container from "../../components/Container";
import CustomButton from "../../components/CustomButton";
import SettingItem from "../../components/SettingItem";
import StatCard from "../../components/StatCard";
import images from "../../constants/images";
import { clearUserData } from "../../redux/reducers/AuthSlice";
import { settings } from "../../utils/data";

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();

  // Combine all useSelector Hooks
  const { userData } = useSelector((state) => ({
    userData: state.Auth?.data,
  }));

  // Destructure height, weight, and age from userData
  const height = userData?.height || "0";
  const weight = userData?.weight || "0";
  const age = userData?.age || 0;

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
        <SettingItem
          icon={<NotificationsIcon />}
          text={"Manage Notifications"}
        />
        <Text style={styles.accountSettingsHeader}>Devices:</Text>
        <SettingItem
          icon={<DevicesIcon />}
          text={"Manage Connected Devices"}
          onPress={() => navigation.navigate("Device")}
        />
      </ScrollView>

      <CustomButton
        title="Log Out"
        onPress={async () => {
          dispatch(clearUserData());
          navigation.reset({
            index: 0, // Ensures TabNavigator is at the top
            routes: [
              {
                name: "Splash", // Parent navigator (UserApp)
                // state: {
                //   routes: [{ name: "Login" }], // Navigate to TabNavigator within UserApp
                // },
              },
            ],
          });
          // navigation.navigate("Login")
        }}
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

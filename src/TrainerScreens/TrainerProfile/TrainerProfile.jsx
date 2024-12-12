import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import images from "../../constants/images";
import { colors } from "../../constants/colors";
import SettingItem from "../../components/SettingItem";
import { settings } from "../../utils/data";
import icons from "../../constants/icons";
import { useNavigation } from "@react-navigation/native";
import KetoIcon from "../../assets/svgs/KetoIcon";

const TrainerProfile = () => {
  const navigation = useNavigation();
  const trainerSettings = [
    {
      icon: <KetoIcon />,
      text: "Personal Information",
      route: "PersonalInfoScreen",
    },
    {
      icon: <KetoIcon />,
      text: "Change Password",
      route: "ChangePassScreen",
    },
    {
      icon: <KetoIcon />,
      text: "Sync and Secure Data",
      route: "SyncSecureDataScreen",
    },
  ];
  return (
    <Container>
      <Header title={"Profile"} showBackButton={true} />
      <View style={styles.profileImageContainer}>
        <Image source={images.dp} style={styles.profileImage} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-SemiBold",
            color: "#F8F8F8",
            marginTop: 10,
          }}
        >
          Maxwell
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins-Regular",
            color: colors.green,
          }}
        >
          Nutritionist
        </Text>
      </View>
      <View style={{ marginHorizontal: 10 }}>
        <Text style={styles.accountSettingsHeader}>Account Settings:</Text>
        {trainerSettings.map((item, index) => (
          <SettingItem
            key={index}
            icon={item.icon}
            text={item.text}
            onPress={() => navigation.navigate(item.route)}
          />
        ))}
      </View>
    </Container>
  );
};

export default TrainerProfile;

const styles = StyleSheet.create({
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
  accountSettingsHeader: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
    marginTop: 50,
    fontSize: 16,
  },
});

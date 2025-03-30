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
import { FontSize } from "../../utils/font";
import PersonalInfoIcon from "../../assets/svgs/PersonalInfoIcon";
import ChangePassIcon from "../../assets/svgs/ChangePassIcon";
import SyncSecureIcon from "../../assets/svgs/SyncSecureIcon";

const TrainerProfile = () => {
  const navigation = useNavigation();
  const trainerSettings = [
    {
      icon: <PersonalInfoIcon />,
      text: "Personal Information",
      route: "PersonalInfoScreen",
    },
    {
      icon: <ChangePassIcon />,
      text: "Change Password",
      route: "ChangePassScreen",
    },
    {
      icon: <SyncSecureIcon />,
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
            fontSize: FontSize.regular,
            fontFamily: "Poppins-SemiBold",
            color: "#F8F8F8",
            marginTop: 10,
          }}
        >
          Maxwell
        </Text>
        <Text
          style={{
            fontSize: FontSize.medium,
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
    fontSize: FontSize.regular,
  },
});

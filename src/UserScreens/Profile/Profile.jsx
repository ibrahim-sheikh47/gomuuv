import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
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
import { FontSize } from "../../utils/font";
import * as ImagePicker from "expo-image-picker"; // Assuming expo is used
import AntDesign from "@expo/vector-icons/AntDesign";
import EditIcon from "../../assets/svgs/EditIcon";

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  // Local state for profile image, initialized with default image
  const [profileImage, setProfileImage] = useState(images.dp);

  // Combine all useSelector Hooks
  const { userData } = useSelector((state) => ({
    userData: state.Auth?.data,
  }));

  // Destructure height, weight, and age from userData
  const height = userData?.height || "0";
  const weight = userData?.weight || "0";
  const age = userData?.age || 0;

  // Handle photo change button press
  const handleChangePhoto = async () => {
    try {
      // Request permission - minimal implementation
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please allow access to your photo library to change profile picture"
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // Just update local state - no backend changes
        setProfileImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      console.log("Error selecting image:", error);
      Alert.alert("Error", "Failed to change profile photo");
    }
  };

  return (
    <Container>
      <BackHeader title="Profile" showBackButton={true} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileImageContainer}>
          <Image source={profileImage} style={styles.profileImage} />

          <TouchableOpacity
            style={styles.cameraIconContainer}
            onPress={handleChangePhoto}
            activeOpacity={0.7}
          >
            <EditIcon color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <StatCard label="Height" value={height} unit={"cm"} />
          <StatCard label="Weight" value={weight} unit={"kg"} />
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
          onPress={() => navigation.navigate("ManageNotifications")}
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
            index: 0,
            routes: [
              {
                name: "Splash",
              },
            ],
          });
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
    position: "relative",
  },
  profileImage: {
    width: 135,
    height: 135,
    borderRadius: 100,
  },
  cameraIconContainer: {
    backgroundColor: "#242425",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    right: 110,
  },
  cameraIcon: {
    fontSize: 16,
  },
  changePhotoText: {
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: FontSize.small,
    marginTop: 5,
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
    fontSize: FontSize.regular,
  },
});

export default Profile;

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
import { clearUserData, setUserData } from "../../redux/reducers/AuthSlice";
import { settings } from "../../utils/data";
import { FontSize } from "../../utils/font";
import * as ImagePicker from "expo-image-picker"; // Assuming expo is used
import AntDesign from "@expo/vector-icons/AntDesign";
import EditIcon from "../../assets/svgs/EditIcon";
import Toast from "react-native-toast-message";
import { END_POINTS } from "../../config/routes";
import { API } from "../../config/apiClient";
import { isSignedIn, signOutUser } from "../../services/authService";

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  // Local state for profile image, initialized with default image

  // Combine all useSelector Hooks
  const { data: userData, token } = useSelector((state) => state.Auth);
  const [profileImage, setProfileImage] = useState(
    userData?.image !== "" ? { uri: userData.image } : images.dp
  );

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
        updateProfileImage(result.assets[0]);
      }
    } catch (error) {
      console.log("Error selecting image:", error);
      Alert.alert("Error", "Failed to change profile photo");
    }
  };

  const updateProfileImage = async (image) => {
    const formData = new FormData();

    formData.append("image", {
      uri: image.uri,
      name: image.fileName || "photo.jpg",
      type: image.mimeType || "image/jpeg",
    });

    console.log(formData);

    try {
      const response = await API.patch(
        END_POINTS.UPDATE_PROFILE_PICTURE,
        formData,
        token,
        true
      );

      if (response?.data?.success) {
        dispatch(setUserData(response?.data?.data));
        Toast.show({
          type: "success",
          text1: "Profile picture updated",
        });
      } else {
        throw new Error("Failed to update information.");
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const logout = async () => {
    try {
      const response = await API.patch(
        `${END_POINTS.UPDATE_USER}${userData?._id}`,
        { deviceId: null },
        token,
        false
      );

      if (response?.data?.success) {
        dispatch(clearUserData());
        if (isSignedIn()) {
          signOutUser();
        }
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Splash",
            },
          ],
        });
      } else {
        throw new Error("Failed to update information.");
      }
    } catch (error) {
      console.error("Upload failed", error);
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
          <StatCard label="Height" value={height} unit={""} />
          <StatCard label="Weight" value={weight} unit={""} />
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

      <CustomButton title="Log Out" onPress={logout} />
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

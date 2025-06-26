import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import images from "../../constants/images";
import SettingItem from "../../components/SettingItem";
import { useNavigation } from "@react-navigation/native";
import { FontSize } from "../../utils/font";
import PersonalInfoIcon from "../../assets/svgs/PersonalInfoIcon";
import ChangePassIcon from "../../assets/svgs/ChangePassIcon";
import SyncSecureIcon from "../../assets/svgs/SyncSecureIcon";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../../assets/svgs/EditIcon";
import * as ImagePicker from "expo-image-picker";
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import { clearUserData, setUserData } from "../../redux/reducers/AuthSlice";
import Toast from "react-native-toast-message";
import CustomButton from "../../components/CustomButton";

const TrainerProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Combine all useSelector Hooks
  const { userData, token } = useSelector((state) => ({
    userData: state.Auth?.data,
    token: state.Auth?.token,
  }));
  const [profileImage, setProfileImage] = useState(
    userData.image !== "" ? { uri: userData.image } : images.dp
  );

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

  return (
    <Container>
      <Header title={"Profile"} showBackButton={true} />
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

      <Text
        style={{
          color: "white",
          fontFamily: "Poppins-SemiBold",
          marginTop: 20,
          alignSelf: "center",
          fontSize: FontSize.regular,
        }}
      >
        {userData.firstName}
      </Text>
      <Text
        style={{
          color: "white",
          fontFamily: "Poppins-SemiBold",
          alignSelf: "center",
          fontSize: FontSize.regular,
        }}
      >
        {userData.lastName}
      </Text>

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

      <View style={{ flex: 1 }} />

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

export default TrainerProfile;

const styles = StyleSheet.create({
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
  accountSettingsHeader: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
    marginTop: 30,
    fontSize: FontSize.regular,
  },
});

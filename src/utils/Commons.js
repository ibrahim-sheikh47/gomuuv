import { PermissionsAndroid } from "react-native";
import Geolocation from "react-native-geolocation-service";

const checkPermissions = async () => {
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);
  if (
    !JSON.stringify(granted).includes("denied") &&
    !JSON.stringify(granted).includes("never_ask_again")
  ) {
    return true;
  } else {
    toast("Kindly allow all permissions to continue");
    return false;
  }
};

const fetchLocation = () => {
  return new Promise(async (resolve, reject) => {
    if (checkPermissions()) {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          const { code, message } = error;
          toast(message);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  });
};

export default {
  checkPermissions,
  fetchLocation,
};

import * as Location from "expo-location";

const checkLocationPermissions = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error checking location permissions:", error);
    return false;
  }
};

const fetchLocation = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const hasPermission = await checkLocationPermissions();
      if (!hasPermission) {
        return reject(new Error("Location permission denied"));
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      resolve(location.coords);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  checkLocationPermissions,
  fetchLocation,
};

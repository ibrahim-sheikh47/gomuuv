import messaging from "@react-native-firebase/messaging";
import { Platform, PermissionsAndroid, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

class FCMService {
  register = (onOpenNotification) => {
    if (typeof onOpenNotification !== "function") {
      console.error("[FCMService] onOpenNotification is not a function");
      return;
    }

    this.registerAppWithFCM();
    this.checkPermission();
    this.createNotificationListeners(onOpenNotification);
  };

  registerAppWithFCM = async () => {
    await messaging().registerDeviceForRemoteMessages();
    await messaging().setAutoInitEnabled(true);

    if (Platform.OS === "ios") {
      const apnsToken = await messaging().getAPNSToken();

      if (!apnsToken) {
        console.error(
          "❌ APNs Token is missing. Push notifications may not work."
        );
      }
    }
  };

  getToken = async () => {
    messaging()
      .getToken()
      .then(async (fcmToken) => {
        if (fcmToken) {
          await AsyncStorage.setItem("fcmToken", fcmToken);
        } else {
          await AsyncStorage.setItem("fcmToken", "1234");
        }
      })
      .catch((error) => {
        console.error("[FCMService] getToken rejected ", error);
      });
  };

  checkPermission = async () => {
    const authStatus = await messaging().hasPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  };

  requestPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "You need to allow notifications.");
          return;
        }
      } else {
        const authStatus = await messaging().requestPermission();
        if (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        ) {
          this.getToken();
        } else {
          Alert.alert("Permission Denied", "You need to allow notifications.");
        }
      }
    } catch (error) {
      console.error("[FCMService] Request Permission rejected ", error);
    }
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch((error) => {
        console.error("[FCMService] Delete token error ", error);
      });
  };

  createNotificationListeners = (onOpenNotification) => {
    // Ensure onOpenNotification is a function
    if (typeof onOpenNotification !== "function") {
      console.error("[FCMService] onOpenNotification is not a function");
      return;
    }

    // When the app is in the background or quit state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage) {
        const data = remoteMessage.data;
        onOpenNotification(data);
      }
    });

    // When the app is opened from a quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          const data = remoteMessage.data;
          onOpenNotification(data);
        }
      })
      .catch((error) => {
        console.error("[FCMService] getInitialNotification error:", error);
      });

    // Foreground state messages
    messaging().onMessage((remoteMessage) => {
      // const notification = remoteMessage.notification;
      // const { type } = remoteMessage.data;
      // let currentRoute =
      //   navigationRef.current.getCurrentRoute().name;
      // if (type === "booking" && currentRoute === "Join") {
      //   toastMessage({ type: "success", text1: notification.body });
      // }
    });

    // Background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {});

    // Token refresh
    messaging().onTokenRefresh((fcmToken) => {
      AsyncStorage.setItem("fcmToken", fcmToken);
    });
  };

  unRegister = () => {
    // Cleanup listeners if needed
  };
}

export const fcmService = new FCMService();

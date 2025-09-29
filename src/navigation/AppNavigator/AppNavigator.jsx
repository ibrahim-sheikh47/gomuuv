// NAVIGATION
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../../Splash/Splash";
import TrainerNavigator from "../TrainerNavigator/TrainerNavigator";
import UserNavigator from "../UserNavigator/UserNavigator";
import Login from "../../UserScreens/Auth/Login/Login";
import ForgotPass from "../../UserScreens/Auth/ForgotPass/ForgotPass";
import Verify from "../../UserScreens/Auth/ForgotPass/Verify";
import NewPass from "../../UserScreens/Auth/ForgotPass/NewPass";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoggedIn, data } = useSelector((state) => state.Auth);

  return (
    <Stack.Navigator
      initialRouteName={
        isLoggedIn
          ? data.role === "user"
            ? "UserApp"
            : "TrainerApp"
          : "Splash"
      }
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPass" component={ForgotPass} />
      <Stack.Screen name="Verify" component={Verify} />
      <Stack.Screen name="NewPass" component={NewPass} />
      <Stack.Screen name="UserApp" component={UserNavigator} />
      <Stack.Screen name="TrainerApp" component={TrainerNavigator} />
    </Stack.Navigator>
  );
}

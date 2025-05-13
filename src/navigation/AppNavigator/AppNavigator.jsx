// NAVIGATION
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../../Splash/Splash";
import TrainerNavigator from "../TrainerNavigator/TrainerNavigator";
import UserNavigator from "../UserNavigator/UserNavigator";
import Login from "../../UserScreens/Auth/Login/Login";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="UserApp" component={UserNavigator} />
      <Stack.Screen name="TrainerApp" component={TrainerNavigator} />
    </Stack.Navigator>
  );
}

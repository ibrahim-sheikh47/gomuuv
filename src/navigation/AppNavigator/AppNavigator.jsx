// NAVIGATION
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../../Splash/Splash";
import UserNavigator from "../UserNavigator/UserNavigator";
import TrainerNavigator from "../TrainerNavigator/TrainerNavigator";
import TabNavigator from "../TabNavigator/TabNavigator";
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
      <Stack.Screen name="UserApp" component={UserNavigator} />
      <Stack.Screen name="TrainerApp" component={TrainerNavigator} />
    </Stack.Navigator>
  );
}

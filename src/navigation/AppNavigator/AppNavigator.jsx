// NAVIGATION
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../../screens/Splash/Splash";
import UserNavigator from "../UserNavigator/UserNavigator";
import TrainerNavigator from "../TrainerNavigator/TrainerNavigator";
import Login from "../../screens/Auth/Login/Login";
import TabNavigator from "../TabNavigator/TabNavigator";
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
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
    </Stack.Navigator>
  );
}

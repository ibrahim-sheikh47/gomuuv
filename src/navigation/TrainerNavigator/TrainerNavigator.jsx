// NAVIGATION
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import Container from "../../components/Container";
import TrainerSignup from "../../TrainerScreens/Auth/TrainerSignup/TrainerSignup";
import TrainerHome from "../../TrainerScreens/TrainerHome/TrainerHome";
import WorkoutProgramsList from "../../TrainerScreens/TrainerHome/WorkoutProgramsList";
import WorkoutProgramDetail from "../../TrainerScreens/TrainerHome/WorkoutProgramDetail";
import CreateProgram from "../../TrainerScreens/TrainerHome/CreateProgram";
import TrainerProfile from "../../TrainerScreens/TrainerProfile/TrainerProfile";
import PersonalInfoScreen from "../../UserScreens/Profile/PersonalInfo/PersonalInfo";
import ChangePassScreen from "../../UserScreens/Profile/ChangePass/ChangePass";
import TrainerInfo from "../../TrainerScreens/TrainerHome/TrainerInfo";
import TrainerChangePass from "../../TrainerScreens/TrainerHome/TrainerChangePass";
import { useSelector } from "react-redux";
const Stack = createNativeStackNavigator();

export default function TrainerNavigator() {
  const { isLoggedIn } = useSelector((state) => state.Auth);

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
      }}
      initialRouteName={isLoggedIn && "TrainerHome"}
    >
      <Stack.Screen name="TrainerSignup" component={TrainerSignup} />
      <Stack.Screen name="TrainerHome" component={TrainerHome} />
      <Stack.Screen
        name="WorkoutProgramsList"
        component={WorkoutProgramsList}
      />
      <Stack.Screen
        name="WorkoutProgramDetail"
        component={WorkoutProgramDetail}
      />
      <Stack.Screen name="CreateProgram" component={CreateProgram} />

      <Stack.Screen name="TrainerProfile" component={TrainerProfile} />
      <Stack.Screen name="PersonalInfoScreen" component={TrainerInfo} />
      <Stack.Screen name="ChangePassScreen" component={TrainerChangePass} />
    </Stack.Navigator>
  );
}

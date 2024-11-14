// NAVIGATION
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../screens/Auth/Login/Login";
import Signup from "../../screens/Auth/Signup/Signup";
import { Text, View } from "react-native";
const Stack = createNativeStackNavigator();

export default function TrainerNavigator() {
  const Trainer = () => {
    return (
      <>
        <View style={{ padding: 30 }}>
          <Text>TRAINER</Text>
        </View>
      </>
    );
  };
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
      }}
    >
      <Stack.Screen name="Trainer" component={Trainer} />
    </Stack.Navigator>
  );
}

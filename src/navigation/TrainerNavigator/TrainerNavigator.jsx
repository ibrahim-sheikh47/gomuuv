// NAVIGATION
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import Container from "../../components/Container";
const Stack = createNativeStackNavigator();

export default function TrainerNavigator() {
  const Trainer = () => {
    return (
      <>
        <Container>
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Poppins-Bold",
                fontSize: 20,
              }}
            >
              TRAINER APP
            </Text>
          </View>
        </Container>
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

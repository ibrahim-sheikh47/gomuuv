// NAVIGATION
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../../screens/Splash/Splash";
import Login from "../../screens/Auth/Login/Login";
import Signup from "../../screens/Auth/Signup/Signup";
import ForgotPass from "../../screens/Auth/ForgotPass/ForgotPass";
import Verify from "../../screens/Auth/ForgotPass/Verify";
import NewPass from "../../screens/Auth/ForgotPass/NewPass";
import Profile from "../../screens/Profile/Profile";
import PersonalInfoScreen from "../../screens/Profile/PersonalInfo/PersonalInfo";
import ChangePassScreen from "../../screens/Profile/ChangePass/ChangePass";
import ManageNotifications from "../../screens/Profile/ManageNotifications/ManageNotifications";
import TabNavigator from "../TabNavigator/TabNavigator";
import ActivityScreen from "../../screens/Home/ActivityScreen";
import ActivityDetailScreen from "../../screens/Home/ActivityDetailScreen";
import FinishActivity from "../../screens/Home/FinishActivity";
import ProductDetailScreen from "../../screens/Shop/ProductDetailScreen";
import ShopScreen from "../../screens/Shop/Shop";
import MealDetailScreen from "../../screens/Nutrition/MealDetailScreen";
import ViewAllMeals from "../../screens/Nutrition/ViewAllMeals";
import AddMeal from "../../screens/Nutrition/AddMeal";
import AddMealDetails from "../../screens/Nutrition/AddMealDetails";
import CreatePlan from "../../screens/Nutrition/CreatePlan";
import SetWaterGoal from "../../screens/Nutrition/SetWaterGoal";
import NutritionPlans from "../../screens/Nutrition/NutritionPlans";
import FastingScreen from "../../screens/Workout/FastingScreen";
import EquipmentDetails from "../../screens/Workout/EquipmentDetails";
import NewWorkout from "../../screens/Workout/NewWorkout";
import ViewAllWorkouts from "../../screens/Workout/ViewAllWorkouts";
import WorkoutDetails from "../../screens/Workout/WorkoutDetails";

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
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPass" component={ForgotPass} />
      <Stack.Screen name="Verify" component={Verify} />
      <Stack.Screen name="NewPass" component={NewPass} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
      <Stack.Screen name="ChangePassScreen" component={ChangePassScreen} />
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
      <Stack.Screen name="FinishActivity" component={FinishActivity} />

      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen
        name="ActivityDetailScreen"
        component={ActivityDetailScreen}
      />
      <Stack.Screen name="MealDetailScreen" component={MealDetailScreen} />
      <Stack.Screen name="ViewAllMeals" component={ViewAllMeals} />
      <Stack.Screen name="AddMeal" component={AddMeal} />
      <Stack.Screen name="AddMealDetails" component={AddMealDetails} />
      <Stack.Screen name="CreatePlan" component={CreatePlan} />
      <Stack.Screen name="SetWaterGoal" component={SetWaterGoal} />
      <Stack.Screen name="NutritionPlans" component={NutritionPlans} />
      <Stack.Screen name="FastingScreen" component={FastingScreen} />
      <Stack.Screen name="EquipmentDetails" component={EquipmentDetails} />
      <Stack.Screen name="NewWorkout" component={NewWorkout} />
      <Stack.Screen name="ViewAllWorkouts" component={ViewAllWorkouts} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetails} />

      <Stack.Screen
        name="ManageNotifications"
        component={ManageNotifications}
      />
      <Stack.Screen name="ShopScreen" component={ShopScreen} />
    </Stack.Navigator>
  );
}

// NAVIGATION
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signup from "../../UserScreens/Auth/Signup/Signup";
import ForgotPass from "../../UserScreens/Auth/ForgotPass/ForgotPass";
import Verify from "../../UserScreens/Auth/ForgotPass/Verify";
import NewPass from "../../UserScreens/Auth/ForgotPass/NewPass";
import Profile from "../../UserScreens/Profile/Profile";
import PersonalInfoScreen from "../../UserScreens/Profile/PersonalInfo/PersonalInfo";
import ChangePassScreen from "../../UserScreens/Profile/ChangePass/ChangePass";
import ManageNotifications from "../../UserScreens/Profile/ManageNotifications/ManageNotifications";
import TabNavigator from "../TabNavigator/TabNavigator";
import ActivityScreen from "../../UserScreens/Home/ActivityScreen";
import ActivityDetailScreen from "../../UserScreens/Home/ActivityDetailScreen";
import FinishActivity from "../../UserScreens/Home/FinishActivity";
import ProductDetailScreen from "../../UserScreens/Shop/ProductDetailScreen";
import MealDetailScreen from "../../UserScreens/Nutrition/MealDetailScreen";
import ViewAllMeals from "../../UserScreens/Nutrition/ViewAllMeals";
import AddMeal from "../../UserScreens/Nutrition/AddMeal";
import AddMealDetails from "../../UserScreens/Nutrition/AddMealDetails";
import CreatePlan from "../../UserScreens/Nutrition/CreatePlan";
import SetWaterGoal from "../../UserScreens/Nutrition/SetWaterGoal";
import NutritionPlans from "../../UserScreens/Nutrition/NutritionPlans";
import FastingScreen from "../../UserScreens/Workout/FastingScreen";
import EquipmentDetails from "../../UserScreens/Workout/EquipmentDetails";
import NewWorkout from "../../UserScreens/Workout/NewWorkout";
import ViewAllWorkouts from "../../UserScreens/Workout/ViewAllWorkouts";
import WorkoutDetails from "../../UserScreens/Workout/WorkoutDetails";
import FastingPlans from "../../UserScreens/Workout/FastingPlans";
import FastingPlanDetail from "../../UserScreens/Workout/FastingPlanDetail";
import ChallengeDetail from "../../UserScreens/Challenges/ChallengeDetail";
import CategoryList from "../../UserScreens/Challenges/CategoryList";
import Cart from "../../UserScreens/Shop/Cart";
import SleepScreen from "../../UserScreens/Sleep/Sleep";
import Checkout from "../../UserScreens/Shop/Checkout";
import CompletedOrder from "../../UserScreens/Shop/CompletedOrder";
import StartWorkout from "../../UserScreens/Workout/StartWorkout";
import WorkoutCompleted from "../../UserScreens/Workout/WorkoutCompleted";
import AddDevice from "../../UserScreens/Profile/Device/AddDevice";
import Device from "../../UserScreens/Profile/Device/Device";
import Login from "../../UserScreens/Auth/Login/Login";
import FinalizePlan from "../../UserScreens/Nutrition/FinalizePlan";

const Stack = createNativeStackNavigator();

export default function UserNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
      }}
    >
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPass" component={ForgotPass} />
      <Stack.Screen name="Verify" component={Verify} />
      <Stack.Screen name="NewPass" component={NewPass} />

      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
      <Stack.Screen name="ChangePassScreen" component={ChangePassScreen} />
      <Stack.Screen name="Device" component={Device} />
      <Stack.Screen name="AddDevice" component={AddDevice} />

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
      <Stack.Screen name="FinalizePlan" component={FinalizePlan} />

      <Stack.Screen name="EquipmentDetails" component={EquipmentDetails} />
      <Stack.Screen name="NewWorkout" component={NewWorkout} />
      <Stack.Screen name="ViewAllWorkouts" component={ViewAllWorkouts} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetails} />
      <Stack.Screen name="StartWorkout" component={StartWorkout} />
      <Stack.Screen name="WorkoutCompleted" component={WorkoutCompleted} />

      <Stack.Screen name="FastingScreen" component={FastingScreen} />
      <Stack.Screen name="FastingPlans" component={FastingPlans} />
      <Stack.Screen name="FastingPlanDetail" component={FastingPlanDetail} />

      <Stack.Screen name="ChallengeDetail" component={ChallengeDetail} />
      <Stack.Screen name="CategoryList" component={CategoryList} />

      <Stack.Screen name="SleepScreen" component={SleepScreen} />

      <Stack.Screen
        name="ManageNotifications"
        component={ManageNotifications}
      />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="CompletedOrder" component={CompletedOrder} />
    </Stack.Navigator>
  );
}

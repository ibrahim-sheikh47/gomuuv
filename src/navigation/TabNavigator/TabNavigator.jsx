import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Platform } from "react-native";
import { colors } from "../../constants/colors"; // Import your color palette
import HomeScreen from "../../UserScreens/Home/Home";
import ShopScreen from "../../UserScreens/Shop/Shop";
import NutritionScreen from "../../UserScreens/Nutrition/Nutrition";
import WorkoutScreen from "../../UserScreens/Workout/Workout";
import ChallengesScreen from "../../UserScreens/Challenges/Challenges";
import Tab1Icon from "../../assets/svgs/Tab1Icon";
import Tab2Icon from "../../assets/svgs/Tab2Icon";
import Tab3Icon from "../../assets/svgs/Tab3Icon";
import Tab4Icon from "../../assets/svgs/Tab4Icon";
import Tab5Icon from "../../assets/svgs/Tab5Icon";
import { FontSize } from "../../utils/font";

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, IconFilled, IconOutlined, label }) => {
  const icon = focused ? IconFilled : IconOutlined; // Choose based on focus
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? "#434747" : "transparent",
        padding: Platform.OS === "ios" ? 12 : 8, // Different padding for iOS and Android
        marginVertical: 10,
        borderRadius: 12,
      }}
    >
      {icon}
      {focused && (
        <Text
          style={{
            marginTop: 7,
            fontSize: 8,
            fontFamily: "Poppins-Medium",
            color: colors.green, // Always black when active
            paddingBottom: Platform.OS === "ios" ? 20 : 0,
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const iconMapping = {
  Challenges: {
    filled: <Tab1Icon color={colors.green} />,
    outlined: <Tab1Icon />,
  },
  Workout: {
    filled: <Tab2Icon color={colors.green} />,
    outlined: <Tab2Icon />,
  },
  Home: {
    filled: <Tab3Icon color={colors.green} />,
    outlined: <Tab3Icon />,
  },
  Nutrition: {
    filled: <Tab4Icon color={colors.green} />,
    outlined: <Tab4Icon />,
  },
  Shop: {
    filled: <Tab5Icon color={colors.green} />,
    outlined: <Tab5Icon />,
  },
};

export default function TabNavigator() {
  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <Tab.Navigator
        initialRouteName="Home" // Set the Home screen as the initial active tab
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            height: 75,
            backgroundColor: "#1f1f20",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderTopColor: "#2D2D2F",
            borderTopWidth: 1,
            paddingHorizontal: 10,
          },
          tabBarIcon: ({ focused }) => {
            const { filled, outlined } = iconMapping[route.name] || {};
            return (
              <TabIcon
                focused={focused}
                IconFilled={filled}
                IconOutlined={outlined}
                label={route.name}
              />
            );
          },
          tabBarShowLabel: false, // Disable default label behavior
        })}
      >
        <Tab.Screen name="Challenges" component={ChallengesScreen} />
        <Tab.Screen name="Workout" component={WorkoutScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Nutrition" component={NutritionScreen} />
        <Tab.Screen name="Shop" component={ShopScreen} />
      </Tab.Navigator>
    </View>
  );
}

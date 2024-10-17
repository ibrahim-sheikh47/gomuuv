import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, Text } from "react-native";
import icons from "../../constants/icons"; // Import your icons
import { colors } from "../../constants/colors"; // Import your color palette
import HomeScreen from "../../screens/Home/Home";
import Container from "../../components/Container";
import ShopScreen from "../../screens/Shop/Shop";
import NutritionScreen from "../../screens/Nutrition/Nutrition";
import WorkoutScreen from "../../screens/Workout/Workout";

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, icon, iconOutline, label }) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? "#434747" : "transparent", // Gray background when focused
        padding: 10, // Add padding for better spacing
        marginVertical: 10,
        borderRadius: 12, // Optional: Add border radius for rounded corners
      }}
    >
      <Image
        source={focused ? icon : iconOutline}
        style={{ width: 24, height: 24, resizeMode: "contain" }}
      />
      {/* Render the label only when the tab is focused */}
      {focused && (
        <Text
          style={{
            marginTop: 7,
            fontSize: 8,
            fontFamily: "Poppins-Medium",
            color: colors.green, // Always black when active
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
    filled: icons.tab1Filled,
    outlined: icons.tab1,
  },
  Workout: {
    filled: icons.tab2Filled,
    outlined: icons.tab2,
  },
  Home: {
    filled: icons.tab3Filled,
    outlined: icons.tab3,
  },
  Nutrition: {
    filled: icons.tab4Filled,
    outlined: icons.tab4,
  },
  Shop: {
    filled: icons.shopTabFilled,
    outlined: icons.shopTab,
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
            height: 60,
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
                icon={filled}
                iconOutline={outlined}
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

// Example screen components
export const ChallengesScreen = () => {
  return (
    <Container>
      <Text
        style={{
          color: colors.green,
          fontFamily: "Poppins-Bold",
          fontSize: 20,
          textAlign: "center",
          marginVertical: "auto",
        }}
      >
        Challenges Screen
      </Text>
    </Container>
  );
};

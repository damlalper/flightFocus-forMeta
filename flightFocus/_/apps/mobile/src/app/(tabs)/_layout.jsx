import { Tabs } from "expo-router";
import { Plane, Clock, Trophy, Map } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1a1b3a",
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "#6b7280",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Flight",
          tabBarIcon: ({ color }) => <Plane color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: "Focus",
          tabBarIcon: ({ color }) => <Clock color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <Trophy color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="seat-selection"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="destination-selection"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="flight-screen"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

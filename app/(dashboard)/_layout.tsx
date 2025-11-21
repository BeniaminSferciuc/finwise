import { Tabs } from "expo-router";
import { ArrowLeftRight, LayoutDashboard } from "lucide-react-native";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "orange",
        tabBarStyle: {
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 5,
          height: Platform.OS === "ios" ? 85 : 65,
        },
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={24} color={color} strokeWidth={1.75} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <ArrowLeftRight size={24} color={color} strokeWidth={1.75} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-transaction"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

import { THEME_COLOR } from "@/lib/constants";
import { Tabs } from "expo-router";
import { Gauge, Repeat } from "lucide-react-native";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME_COLOR,
        tabBarStyle: {
          paddingTop: 5,
          height: Platform.OS === "ios" ? 85 : 75,
        },
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Gauge size={24} color={color} strokeWidth={1.75} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Repeat size={24} color={color} strokeWidth={1.75} />
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
        name="statistics"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

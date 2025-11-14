import { Tabs } from "expo-router";
import {
  ArrowLeftRight,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "orange",
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={24} color={color} strokeWidth={2.25} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-transaction"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <PlusCircle size={24} color={color} strokeWidth={2.25} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }) => (
            <ArrowLeftRight size={24} color={color} strokeWidth={2.25} />
          ),
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

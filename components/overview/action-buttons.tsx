import {
  History,
  MoreHorizontal,
  PieChartIcon,
  Wallet,
} from "lucide-react-native";
import { View } from "react-native";

import { router } from "expo-router";
import { ActionButton } from "../action-button";

export const ActionButtons = () => {
  return (
    <View className="flex-row justify-around px-6 mt-8">
      <ActionButton
        icon={Wallet}
        label="Budget"
        color="bg-gray-200"
        iconColor="#000"
      />
      <ActionButton
        icon={PieChartIcon}
        label="Statistics"
        color="bg-gray-200"
        iconColor="#000"
        onPress={() => router.push("/statistics")}
      />
      <ActionButton
        icon={History}
        label="History"
        color="bg-gray-200"
        iconColor="#555"
      />
      <ActionButton
        icon={MoreHorizontal}
        label="More"
        color="bg-gray-200"
        iconColor="#555"
      />
    </View>
  );
};

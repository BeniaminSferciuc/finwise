import React from "react";
import { Text, View } from "react-native";

export const TransactionsHeader = ({ activeYear }: { activeYear: number }) => {
  return (
    <View className="px-5 py-3 border-b border-b-neutral-200">
      <View>
        <Text className="text-2xl font-bold tracking-tight text-black">
          Transactions
        </Text>
        <Text className="text-sm font-medium text-gray-500">{activeYear}</Text>
      </View>
    </View>
  );
};

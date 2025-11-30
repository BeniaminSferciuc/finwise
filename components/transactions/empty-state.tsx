import { Text, View } from "react-native";

export const EmptyState = () => {
  return (
    <View className="items-center justify-center flex-1 mt-10">
      <Text className="text-lg font-medium text-gray-400">
        No transactions found
      </Text>
      <Text className="text-sm text-gray-300">Try changing the filters</Text>
    </View>
  );
};

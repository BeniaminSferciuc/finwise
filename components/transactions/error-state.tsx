import React from "react";
import { Pressable, Text, View } from "react-native";

export const ErrorState = ({ refetch }: { refetch: () => void }) => {
  return (
    <View className="items-center justify-center flex-1 px-6">
      <Text className="mb-4 text-red-500">Error loading transactions.</Text>
      <Pressable
        onPress={() => refetch()}
        className="px-6 py-2 bg-black rounded-full"
      >
        <Text className="font-bold text-white">Retry</Text>
      </Pressable>
    </View>
  );
};

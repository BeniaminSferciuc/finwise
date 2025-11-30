import { TransactionWithCategory } from "@/lib/types";
import { router } from "expo-router";
import React from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { createRenderItem } from "../render-item";

type Props = {
  isLoading: boolean;
  recentActivity: TransactionWithCategory[];
};

export const RecentActivity = ({ isLoading, recentActivity }: Props) => {
  return (
    <View className="px-6 mt-10">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-black">Recent Activity</Text>
        <Pressable onPress={() => router.push("/transactions")}>
          <Text className="text-sm font-medium text-blue-600">See All</Text>
        </Pressable>
      </View>

      <View className="overflow-hidden min-h-[100px] justify-center">
        {isLoading ? (
          <Text className="text-center text-gray-400">Loading...</Text>
        ) : recentActivity?.length === 0 ? (
          <Text className="text-center text-gray-400">No transactions yet</Text>
        ) : (
          <SectionList
            keyExtractor={(item) => item.id}
            sections={[{ data: recentActivity }]}
            renderItem={createRenderItem({ showDate: true })}
            scrollEnabled={false}
            showsVerticalScrollIndicator={true}
            stickySectionHeadersEnabled={false}
          />
        )}
      </View>
    </View>
  );
};

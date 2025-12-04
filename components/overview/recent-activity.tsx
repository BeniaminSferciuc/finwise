import { useDeleteTransaction } from "@/hooks/use-delete-transaction";
import { TransactionWithCategory } from "@/lib/types";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { TransactionItem } from "../render-item";

type Props = {
  isLoading: boolean;
  recentActivity: TransactionWithCategory[];
};

export const RecentActivity = ({ isLoading, recentActivity }: Props) => {
  const deleteMutation = useDeleteTransaction();

  // 1. Funcția de navigare către Editare
  const handleEditTransaction = (item: TransactionWithCategory) => {
    router.push({
      pathname: "/add-transaction",
      params: { id: item.id },
    });
  };

  const renderItem = useCallback(
    ({ item, index, section }: any) => (
      <TransactionItem
        item={item}
        index={index}
        section={section}
        showDate={true}
        onDelete={(id) => deleteMutation.mutate(id)}
        // 2. Pasăm funcția aici
        onPress={handleEditTransaction}
        deletingId={
          deleteMutation.isPending ? (deleteMutation.variables as string) : null
        }
      />
    ),
    [deleteMutation]
  );

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
            sections={[{ title: "Recent", data: recentActivity }]}
            renderItem={renderItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={true}
            stickySectionHeadersEnabled={false}
          />
        )}
      </View>
    </View>
  );
};

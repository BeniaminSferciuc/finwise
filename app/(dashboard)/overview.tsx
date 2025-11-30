import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionButtons } from "@/components/overview/action-buttons";
import { CategoryBreakdown } from "@/components/overview/category-breakdown";
import { FinancialCards } from "@/components/overview/financial-cards";
import { Header } from "@/components/overview/header";
import { RecentActivity } from "@/components/overview/recent-activity";
import { SpendingBreakdown } from "@/components/overview/spending-breakdown";

import { useOverviewTransactions } from "@/hooks/use-overview-transactions";
import { THEME_BACKGROUND, THEME_COLOR } from "@/lib/constants";

export default function HomeScreen() {
  const { data: transactions, isLoading } = useOverviewTransactions();

  const stats = useMemo(() => {
    if (!transactions) return { income: 0, expense: 0, netWorth: 0 };

    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      if (tx.type === "income") {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    });

    return {
      income,
      expense,
      netWorth: income - expense,
    };
  }, [transactions]);

  const recentActivity = useMemo(() => {
    return transactions?.slice(0, 5) || [];
  }, [transactions]);

  return (
    <View className="flex-1" style={{ backgroundColor: THEME_BACKGROUND }}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 70 }}
        >
          <Header />
          <FinancialCards stats={stats} />
          <ActionButtons />
          <RecentActivity
            isLoading={isLoading}
            recentActivity={recentActivity}
          />
          <SpendingBreakdown transactions={transactions} />
          <CategoryBreakdown data={transactions} />
        </ScrollView>
      </SafeAreaView>

      <Pressable
        onPress={() => router.push("/add-transaction")}
        className="absolute items-center justify-center rounded-full shadow-xl right-6 bottom-4 shadow-black/30 size-16"
        style={{
          backgroundColor: THEME_COLOR,
        }}
      >
        <Plus size={24} color="white" strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

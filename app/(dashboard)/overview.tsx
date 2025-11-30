import { ActionButtons } from "@/components/overview/action-buttons";
import { FinancialCards } from "@/components/overview/financial-cards";
import { Header } from "@/components/overview/header";
import { RecentActivity } from "@/components/overview/recent-activity";
import { SpendingBreakdown } from "@/components/overview/spending-breakdown";
import { authClient } from "@/lib/auth-client";
import { THEME_BACKGROUND, THEME_COLOR } from "@/lib/constants";
import { QUERYKEYS } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { data: session } = authClient.useSession();

  // --- 1. QUERY TRANSACTIONS FOR CURRENT YEAR ---
  const { data: transactions, isLoading } = useQuery({
    queryKey: [QUERYKEYS.OVERVIEW_TRANSACTIONS, session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return [];

      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01`;
      const endOfYear = `${currentYear}-12-31`;

      const { data, error } = await supabase
        .from("transactions")
        .select("*, categories(*)") // Join with categories
        .eq("user_id", session.user.id)
        .gte("date", startOfYear)
        .lte("date", endOfYear)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  // --- 2. CALCULATE TOTALS ---
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
          <SpendingBreakdown stats={stats} />
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

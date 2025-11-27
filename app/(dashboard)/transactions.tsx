import { FilterSheet } from "@/components/filters-sheet";
import { renderItem } from "@/components/render-item";
import { renderSectionHeader } from "@/components/render-section-header";
import { MONTHS } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { QUERYKEYS } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { TransactionWithCategory } from "@/lib/types";
import { getDateRange, groupTransactionsByDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

import { FilterIcon } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "all" | "income" | "expense";

const Transactions = () => {
  const { data: session } = authClient.useSession();
  const currentYear = new Date().getFullYear();

  // --- STATE ---
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Stare Activă (ce se vede in lista)
  const [activeYear, setActiveYear] = useState(currentYear);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const [activeType, setActiveType] = useState<FilterType>("all");

  // Stare Temporară (ce modifici in modal inainte de Apply)
  const [tempYear, setTempYear] = useState(currentYear);
  const [tempMonth, setTempMonth] = useState<number | null>(null);
  const [tempType, setTempType] = useState<FilterType>("all");

  // Deschide modalul și sincronizează starea temporară cu cea activă
  const openFilters = () => {
    setTempYear(activeYear);
    setTempMonth(activeMonth);
    setTempType(activeType);
    setIsFilterVisible(true);
  };

  // Aplică filtrele
  const applyFilters = () => {
    setActiveYear(tempYear);
    setActiveMonth(tempMonth);
    setActiveType(tempType);
    setIsFilterVisible(false);
  };

  // --- QUERIES ---
  const { data: availableYears = [currentYear] } = useQuery({
    queryKey: ["available-years", session?.user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("date")
        .order("date", { ascending: false });
      const uniqueYears = new Set<number>([currentYear]);
      data?.forEach((tx) => uniqueYears.add(new Date(tx.date).getFullYear()));
      return Array.from(uniqueYears).sort((a, b) => b - a);
    },
    enabled: !!session?.user.id,
  });

  const {
    data: rawTransactions,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: [QUERYKEYS.TRANSACTIONS, activeYear, activeMonth, activeType],
    queryFn: async () => {
      const { start, end } = getDateRange(activeYear, activeMonth);
      let query = supabase
        .from("transactions")
        .select("*, categories(*)")
        .order("date", { ascending: false })
        .gte("date", start)
        .lte("date", end);

      if (activeType !== "all") query = query.eq("type", activeType);

      const { data, error } = await query.throwOnError();
      if (error) throw error;
      return data as unknown as TransactionWithCategory[];
    },
    enabled: !!session?.user.id,
  });

  const sections = useMemo(() => {
    if (!rawTransactions) return [];
    return groupTransactionsByDate(rawTransactions);
  }, [rawTransactions]);

  // Verificăm dacă sunt filtre active pentru a colora butonul
  const hasActiveFilters =
    activeMonth !== null || activeType !== "all" || activeYear !== currentYear;

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F7]" edges={["top"]}>
      {/* HEADER */}
      <View className="px-5 pt-4 pb-4">
        <View>
          <Text className="text-2xl font-bold tracking-tight text-black">
            Transactions
          </Text>
          <Text className="text-sm font-medium text-gray-500">
            {activeYear} •{" "}
            {activeMonth !== null ? MONTHS[activeMonth] : "All Year"}
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      {isPending ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="small" color="#000" />
        </View>
      ) : isError ? (
        <View className="items-center justify-center flex-1 px-6">
          <Text className="mb-4 text-red-500">Error loading transactions.</Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="px-6 py-2 bg-black rounded-full"
          >
            <Text className="font-bold text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : sections.length === 0 ? (
        <View className="items-center justify-center flex-1 mt-10">
          <Text className="text-lg font-medium text-gray-400">
            No transactions found
          </Text>
          <Text className="text-sm text-gray-300">
            Try changing the filters
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={true}
          stickySectionHeadersEnabled={false}
        />
      )}
      <TouchableOpacity
        onPress={openFilters}
        className={`size-16  rounded-full items-center justify-center absolute right-4 bottom-4 border ${
          hasActiveFilters
            ? "bg-black border-black"
            : "bg-white border-gray-200"
        }`}
      >
        <FilterIcon
          size={20}
          color={hasActiveFilters ? "white" : "black"}
          fill={hasActiveFilters ? "white" : "none"}
        />
      </TouchableOpacity>

      {/* FILTER BOTTOM SHEET */}
      <FilterSheet
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        availableYears={availableYears}
        selectedYear={tempYear}
        setSelectedYear={setTempYear}
        selectedMonth={tempMonth}
        setSelectedMonth={setTempMonth}
        selectedType={tempType}
        setSelectedType={setTempType}
        onApply={applyFilters}
      />
    </SafeAreaView>
  );
};

export default Transactions;

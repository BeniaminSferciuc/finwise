import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useListTransactions } from "@/hooks/use-list-transactions";
import { THEME_COLOR } from "@/lib/constants";
import { FilterType, TransactionWithCategory } from "@/lib/types";

type CategorySum = {
  categoryId: string;
  categoryName: string;
  total: number;
};

const MONTH_LABELS = [
  "Ian",
  "Feb",
  "Mar",
  "Apr",
  "Mai",
  "Iun",
  "Iul",
  "Aug",
  "Sep",
  "Oct",
  "Noi",
  "Dec",
];

const EXPENSE_FILTER: FilterType = "expense";

const CATEGORY_COLORS = [
  "#f97316", // orange-500
  "#22c55e", // green-500
  "#06b6d4", // cyan-500
  "#a855f7", // purple-500
  "#facc15", // yellow-400
  "#ef4444", // red-500
  "#6366f1", // indigo-500
  "#14b8a6", // teal-500
  "#ec4899", // pink-500
];

export default function StatisticsScreen() {
  const now = new Date();

  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(now.getMonth());
  const [selectedCategory, setSelectedCategory] = useState<CategorySum | null>(
    null
  );

  // luăm DOAR cheltuieli pentru anul selectat
  const {
    data: allTransactions,
    isLoading,
    error,
  } = useListTransactions({
    year: selectedYear,
    type: EXPENSE_FILTER,
  });

  const safeTransactions: TransactionWithCategory[] =
    (allTransactions as TransactionWithCategory[]) || [];

  const monthLabel = useMemo(
    () =>
      new Date(selectedYear, selectedMonthIndex, 1).toLocaleDateString(
        "ro-RO",
        {
          month: "long",
          year: "numeric",
        }
      ),
    [selectedYear, selectedMonthIndex]
  );

  // filtrăm DOAR pe lună/an
  const transactionsForMonth = useMemo(() => {
    return safeTransactions.filter((t) => {
      if (!t.date) return false;
      const d = new Date(t.date as unknown as string);
      return (
        d.getFullYear() === selectedYear &&
        d.getMonth() === selectedMonthIndex
      );
    });
  }, [safeTransactions, selectedYear, selectedMonthIndex]);

  // grupăm pe categorie
  const categoryData: CategorySum[] = useMemo(() => {
    const map = new Map<string, CategorySum>();

    for (const t of transactionsForMonth) {
      // @ts-ignore
      const categoryId = String(t.category_id ?? t.categories?.id ?? "other");

      const categoryName =
        // @ts-ignore
        (t.categories?.name as string) ||
        // @ts-ignore
        (t.categories?.title as string) ||
        "Other";

      const rawAmount = (t.amount as number | string | null) ?? 0;
      const amount =
        typeof rawAmount === "string"
          ? parseFloat(rawAmount.replace(",", ".")) || 0
          : rawAmount;

      const existing = map.get(categoryId);
      if (existing) {
        existing.total += amount;
      } else {
        map.set(categoryId, {
          categoryId,
          categoryName,
          total: amount,
        });
      }
    }

    return Array.from(map.values())
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [transactionsForMonth]);

  const totalExpenses = useMemo(
    () => categoryData.reduce((sum, c) => sum + c.total, 0),
    [categoryData]
  );

  const hasChartData = categoryData.length > 0;

  const maxTotal = categoryData.length
    ? Math.max(...categoryData.map((c) => c.total))
    : 1;

  const changeMonth = (direction: "prev" | "next") => {
    setSelectedMonthIndex((prev) => {
      if (direction === "next") {
        if (prev === 11) {
          setSelectedYear((y) => y + 1);
          return 0;
        }
        return prev + 1;
      } else {
        if (prev === 0) {
          setSelectedYear((y) => y - 1);
          return 11;
        }
        return prev - 1;
      }
    });
    setSelectedCategory(null);
  };

  const selectMonthIndex = (index: number) => {
    setSelectedMonthIndex(index);
    setSelectedCategory(null);
  };

  return (
    <View className="flex-1 bg-[#F2F2F7]">
      {/* HEADER */}
      <View className="pt-12 px-5 pb-4">
        <Text className="text-xs font-medium tracking-[3px] text-gray-400 uppercase">
          Overview
        </Text>
        <Text className="mt-1 text-2xl font-bold text-black">Statistics</Text>
      </View>

      {/* CONȚINUT */}
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="mt-3 text-xs text-gray-500">
            Se încarcă statisticile tale...
          </Text>
        </View>
      )}

      {!isLoading && error && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-2xl mb-2">⚠️</Text>
          <Text className="text-red-500 text-center font-medium mb-1">
            Oops, ceva nu a mers bine
          </Text>
          <Text className="text-xs text-gray-500 text-center">
            {(error as any)?.message ?? "Eroare la încărcare."}
          </Text>
        </View>
      )}

      {!isLoading && !error && (
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* CARD SELECTOR LUNĂ + TOTAL */}
          <View className="mb-4 rounded-[28px] bg-white shadow-sm border border-gray-100 px-4 py-4">
            <View className="flex-row items-center justify-between mb-3">
              <TouchableOpacity
                onPress={() => changeMonth("prev")}
                className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
              >
                <Text className="text-lg font-semibold text-gray-700">‹</Text>
              </TouchableOpacity>

              <View className="items-center">
                <Text className="text-[11px] uppercase tracking-[3px] text-gray-400">
                  Luna selectată
                </Text>
                <Text className="text-base font-semibold capitalize text-black">
                  {monthLabel}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => changeMonth("next")}
                className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
              >
                <Text className="text-lg font-semibold text-gray-700">›</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap mt-1">
              {MONTH_LABELS.map((label, index) => {
                const isSelected = index === selectedMonthIndex;
                return (
                  <TouchableOpacity
                    key={label}
                    onPress={() => selectMonthIndex(index)}
                    className={`px-3 py-1.5 rounded-full mr-2 mb-2 ${
                      isSelected ? "bg-black" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        isSelected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View
              className="mt-4 rounded-2xl px-4 py-3 flex-row items-center justify-between"
              style={{ backgroundColor: THEME_COLOR }}
            >
              <View>
                <Text className="text-[11px] uppercase tracking-[3px] text-white/60">
                  Total cheltuieli
                </Text>
                <Text className="mt-1 text-2xl font-bold text-white">
                  {totalExpenses.toFixed(2)} RON
                </Text>
              </View>
              <Text className="text-[11px] text-white/80 text-right">
                Doar tranzacțiile{"\n"}marcate ca cheltuială
              </Text>
            </View>
          </View>

          {/* FĂRĂ DATE */}
          {!hasChartData && (
            <View className="mt-10 items-center justify-center">
              <Text className="text-4xl mb-3">🧾</Text>
              <Text className="text-gray-600 font-medium text-center mb-1">
                Nu există cheltuieli pentru luna selectată.
              </Text>
              <Text className="text-xs text-gray-400 text-center px-10">
                Adaugă câteva tranzacții pentru a vedea cum se distribuie
                cheltuielile tale.
              </Text>
            </View>
          )}

          {/* CU DATE */}
          {hasChartData && (
            <>
              {/* CARD CHART */}
              <View className="mb-4 rounded-[28px] bg-white shadow-sm border border-gray-100 px-4 py-4">
                <View className="flex-row items-center justify-between mb-3">
                  <View>
                    <Text className="text-[11px] uppercase tracking-[3px] text-gray-400">
                      Distribuție
                    </Text>
                    <Text className="mt-1 text-sm font-semibold text-gray-900">
                      Cheltuieli pe categorii
                    </Text>
                  </View>
                  <View className="px-3 py-1 rounded-full bg-gray-100">
                    <Text className="text-[11px] text-gray-600 font-medium">
                      {categoryData.length} categorii
                    </Text>
                  </View>
                </View>

                {/* MINI CHART */}
                <View className="mt-1">
                  <View className="flex-row items-end justify-between h-40 border-b border-b-neutral-200 pb-1">
                    {categoryData.map((item, index) => {
                      const rawPct = (item.total / maxTotal) * 100;
                      const heightPct = Math.max(
                        12,
                        Math.min(rawPct || 0, 90)
                      );
                      const color =
                        CATEGORY_COLORS[index % CATEGORY_COLORS.length];

                      const isSelected =
                        selectedCategory?.categoryId === item.categoryId;

                      return (
                        <TouchableOpacity
                          key={item.categoryId}
                          activeOpacity={0.9}
                          style={{
                            flex: 1,
                            marginLeft: index === 0 ? 0 : 8,
                            height: "100%",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                          onPress={() =>
                            setSelectedCategory(isSelected ? null : item)
                          }
                        >
                          {/* SUMA DEASUPRA BAREI CÂND ESTE SELECTATĂ */}
                          {isSelected && (
                            <Text className="mb-1 text-[10px] font-semibold text-gray-800">
                              -{item.total.toFixed(0)} RON
                            </Text>
                          )}

                          <View
                            className="rounded-t-2xl"
                            style={{
                              width: "100%",
                              height: `${heightPct}%`,
                              backgroundColor: color,
                              opacity: isSelected ? 1 : 0.85,
                              borderWidth: isSelected ? 2 : 0,
                              borderColor: isSelected ? "white" : "transparent",
                              shadowColor: isSelected ? "#000" : "transparent",
                              shadowOpacity: isSelected ? 0.2 : 0,
                              shadowOffset: { width: 0, height: 2 },
                              shadowRadius: isSelected ? 6 : 0,
                            }}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* CARD CU SUMA SELECTATĂ */}
                  <View className="mt-4 px-3 py-2 rounded-2xl bg-gray-50 border border-gray-100">
                    {selectedCategory ? (
                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="text-[11px] text-gray-500">
                            Categoria selectată
                          </Text>
                          <Text className="text-sm font-semibold text-gray-900">
                            {selectedCategory.categoryName}
                          </Text>
                        </View>
                        <Text className="text-sm font-semibold text-red-500">
                          -{selectedCategory.total.toFixed(2)} RON
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-[11px] text-gray-400 text-center">
                        Atinge o bară din grafic pentru a vedea suma exactă.
                      </Text>
                    )}
                  </View>

                  {/* Legendă */}
                  <View className="flex-row flex-wrap mt-3">
                    {categoryData.slice(0, 6).map((item, index) => {
                      const color =
                        CATEGORY_COLORS[index % CATEGORY_COLORS.length];

                      return (
                        <View
                          key={item.categoryId}
                          className="flex-row items-center mr-4 mb-2"
                        >
                          <View
                            className="w-3 h-3 mr-2 rounded-full"
                            style={{
                              backgroundColor: color,
                            }}
                          />
                          <Text className="text-xs text-gray-600">
                            {item.categoryName}
                          </Text>
                        </View>
                      );
                    })}
                    {categoryData.length > 6 && (
                      <Text className="text-xs text-gray-400 mt-1">
                        +{categoryData.length - 6} categorii
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* CARD LISTĂ CATEGORII */}
              <View className="mb-4 rounded-[28px] bg-white shadow-sm border border-gray-100 px-4 py-4">
                <Text className="text-[11px] uppercase tracking-[3px] text-gray-400 mb-1">
                  Detaliu
                </Text>
                <Text className="mb-3 text-sm font-semibold text-gray-900">
                  Cheltuieli pe categorii
                </Text>

                {categoryData.map((item, index) => {
                  const color =
                    CATEGORY_COLORS[index % CATEGORY_COLORS.length];

                  return (
                    <View
                      key={item.categoryId}
                      className={`flex-row justify-between items-center py-3 ${
                        index !== categoryData.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <View className="flex-row items-center">
                        <View
                          className="w-8 h-8 mr-3 rounded-full items-center justify-center"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <Text className="text-xs font-semibold text-gray-900">
                            {item.categoryName.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View>
                          <Text className="font-medium text-gray-900">
                            {item.categoryName}
                          </Text>
                          <Text className="text-[11px] text-gray-400">
                            Cheltuieli în luna curentă
                          </Text>
                        </View>
                      </View>
                      <Text className="font-semibold text-red-500">
                        -{item.total.toFixed(2)} RON
                      </Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

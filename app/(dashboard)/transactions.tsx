import { FilterSheet } from "@/components/filters-sheet";
import { createRenderItem } from "@/components/render-item";

import { renderSectionHeader } from "@/components/render-section-header";
import { useAvailableYears } from "@/hooks/use-available-years";
import { useListTransactions } from "@/hooks/use-list-transactions";
import { THEME_BACKGROUND, THEME_COLOR } from "@/lib/constants";
import { FilterType } from "@/lib/types";
import { groupTransactionsByDate } from "@/lib/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { FilterIcon } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Transactions = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const currentYear = new Date().getFullYear();

  // Stare Activă (ce se vede in lista)
  const [activeYear, setActiveYear] = useState(currentYear);
  const [activeType, setActiveType] = useState<FilterType>("all");

  // Stare Temporară (ce modifici in modal inainte de Apply)
  const [tempYear, setTempYear] = useState(currentYear);
  const [tempType, setTempType] = useState<FilterType>("all");

  // Aplică filtrele
  const applyFilters = () => {
    setActiveYear(tempYear);
    setActiveType(tempType);
    bottomSheetModalRef.current?.dismiss();
  };

  const handlePresentModalPress = useCallback(() => {
    setTempYear(activeYear);
    setTempType(activeType);
    bottomSheetModalRef.current?.present();
  }, [activeType, activeYear]);

  const { data: availableYears = [currentYear] } = useAvailableYears();

  const {
    data: rawTransactions,
    isPending,
    isError,
    refetch,
  } = useListTransactions({
    year: currentYear,
    type: activeType,
  });

  const sections = useMemo(() => {
    if (!rawTransactions) return [];
    return groupTransactionsByDate(rawTransactions);
  }, [rawTransactions]);

  // Verificăm dacă sunt filtre active pentru a colora butonul
  const hasActiveFilters = activeType !== "all" || activeYear !== currentYear;

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ backgroundColor: THEME_BACKGROUND }}
    >
      {/* HEADER */}
      <View className="px-5 py-3 border-b border-b-neutral-200">
        <View>
          <Text className="text-2xl font-bold tracking-tight text-black">
            Transactions
          </Text>
          <Text className="text-sm font-medium text-gray-500">
            {activeYear}
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      {isPending ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="small" color={THEME_COLOR} />
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
          renderItem={createRenderItem({ showDate: false })}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={() => <View style={{ height: 24 }} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={true}
          stickySectionHeadersEnabled={false}
          style={{ paddingTop: 12 }}
        />
      )}
      <TouchableOpacity
        onPress={handlePresentModalPress}
        className="size-16 rounded-full items-center justify-center absolute right-6 bottom-4 border"
        style={{
          backgroundColor: hasActiveFilters ? THEME_COLOR : "white",
          borderColor: hasActiveFilters ? THEME_COLOR : "#E5E5EA",
        }}
      >
        <FilterIcon
          size={20}
          color={hasActiveFilters ? "white" : THEME_COLOR}
          fill={hasActiveFilters ? "white" : "none"}
        />
      </TouchableOpacity>

      <FilterSheet
        availableYears={availableYears}
        selectedYear={tempYear}
        setSelectedYear={setTempYear}
        selectedType={tempType}
        setSelectedType={setTempType}
        onApply={applyFilters}
        ref={bottomSheetModalRef}
      />
    </SafeAreaView>
  );
};

export default Transactions;

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FilterIcon } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, SectionList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterSheet } from "@/components/filters-sheet";
import { LoadingState } from "@/components/loading";
import { TransactionItem } from "@/components/render-item";
import { renderSectionHeader } from "@/components/render-section-header";
import { EmptyState } from "@/components/transactions/empty-state";
import { ErrorState } from "@/components/transactions/error-state";
import { TransactionsHeader } from "@/components/transactions/transactions-header";

import { useAvailableYears } from "@/hooks/use-available-years";
import { useDeleteTransaction } from "@/hooks/use-delete-transaction";
import { useListTransactions } from "@/hooks/use-list-transactions";

import { THEME_BACKGROUND, THEME_COLOR } from "@/lib/constants";
import { FilterType } from "@/lib/types";
import { groupTransactionsByDate } from "@/lib/utils";

const Transactions = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const currentYear = new Date().getFullYear();

  const [activeYear, setActiveYear] = useState(currentYear);
  const [activeType, setActiveType] = useState<FilterType>("all");

  const [tempYear, setTempYear] = useState(currentYear);
  const [tempType, setTempType] = useState<FilterType>("all");

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

  const deleteMutation = useDeleteTransaction();

  const renderItem = useCallback(
    ({ item, index, section }: any) => (
      <TransactionItem
        item={item}
        index={index}
        section={section}
        showDate={true}
        onDelete={(id) => deleteMutation.mutate(id)}
        deletingId={
          deleteMutation.isPending ? (deleteMutation.variables as string) : null
        }
      />
    ),
    [deleteMutation]
  );

  const {
    data: rawTransactions,
    isPending,
    isError,
    refetch,
  } = useListTransactions({
    year: activeYear,
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
      <TransactionsHeader activeYear={activeYear} />
      {isPending ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState refetch={refetch} />
      ) : sections.length === 0 ? (
        <EmptyState />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={() => <View style={{ height: 24 }} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={true}
          stickySectionHeadersEnabled={false}
          style={{ paddingTop: 12 }}
        />
      )}
      <Pressable
        onPress={handlePresentModalPress}
        className="absolute items-center justify-center border rounded-full size-16 right-6 bottom-4"
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
      </Pressable>

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

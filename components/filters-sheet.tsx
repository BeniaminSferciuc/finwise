import { MONTHS } from "@/constants";
import { THEME_COLOR } from "@/lib/constants";
import { X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FilterType = "all" | "income" | "expense";

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  availableYears: number[];
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  selectedMonth: number | null;
  setSelectedMonth: (m: number | null) => void;
  selectedType: FilterType;
  setSelectedType: (t: FilterType) => void;
  onApply: () => void;
}

export const FilterSheet = ({
  visible,
  onClose,
  availableYears,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedType,
  setSelectedType,
  onApply,
}: FilterSheetProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Backdrop cu blur effect vizual (prin opacitate) */}
      <View className="justify-end flex-1 px-2" style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>

        {/* --- FLOATING CARD --- */}
        <View
          className="bg-white rounded-3xl w-full h-[65%] overflow-hidden shadow-2xl"
          style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }}
        >
          {/* Header Vizual (Drag Handle) */}
          <View className="items-center pt-3 pb-2 bg-white">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </View>

          {/* Header Titlu & Close */}
          <View className="flex-row items-center justify-between px-6 pt-2 pb-4 border-b border-gray-100">
            <Text className="text-xl font-bold tracking-tight text-gray-900">
              Filter Transactions
            </Text>
            <Pressable
              onPress={onClose}
              className="p-2 bg-gray-100 rounded-full active:bg-gray-200"
            >
              <X size={18} color="#4B5563" />
            </Pressable>
          </View>

          {/* Continut Scrollabil */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 16,
            }}
          >
            {/* 1. Transaction Type */}
            <View className="mb-6">
              <Text className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Type
              </Text>
              <View className="flex-row p-1 bg-gray-100 rounded-full">
                {(["all", "income", "expense"] as const).map((type) => {
                  const isActive = selectedType === type;

                  return (
                    <Pressable
                      key={type}
                      onPress={() => setSelectedType(type)}
                      style={{
                        flex: 1,
                        paddingVertical: 5,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 120,
                        backgroundColor: isActive ? "white" : "transparent",
                        // Adaugăm umbra manual doar dacă e activ
                        shadowColor: isActive ? THEME_COLOR : undefined,
                        shadowOffset: isActive
                          ? { width: 0, height: 1 }
                          : undefined,
                        shadowOpacity: isActive ? 0.05 : 0,
                        shadowRadius: isActive ? 2 : 0,
                        elevation: isActive ? 1 : 0,
                      }}
                    >
                      <Text
                        className={`text-[13px] font-semibold capitalize ${
                          isActive ? THEME_COLOR : "text-gray-500"
                        }`}
                      >
                        {type}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 2. Year Selection */}
            <View className="mb-6">
              <Text className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Year
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {availableYears.map((year) => {
                  const isActive = selectedYear === year;
                  return (
                    <Pressable
                      key={year}
                      onPress={() => setSelectedYear(year)}
                      className={`mr-3 px-6 py-1 rounded-full border`}
                      style={{
                        backgroundColor: isActive ? THEME_COLOR : "white",
                        borderColor: isActive ? THEME_COLOR : "#E5E7EB",
                      }}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          isActive ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {year}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* 3. Month Selection */}
            <View className="mb-8">
              <Text className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Month
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <Pressable
                  onPress={() => setSelectedMonth(null)}
                  className={`py-1 rounded-full px-3 border items-center`}
                  style={{
                    backgroundColor:
                      selectedMonth === null ? THEME_COLOR : "white",
                    borderColor:
                      selectedMonth === null ? THEME_COLOR : "#E5E7EB",
                  }}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedMonth === null ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Entire Year
                  </Text>
                </Pressable>

                {MONTHS.map((month, index) => {
                  const isActive = selectedMonth === index;
                  return (
                    <Pressable
                      key={month}
                      onPress={() => setSelectedMonth(index)}
                      className="items-center justify-center px-3 py-1 border rounded-full"
                      style={{
                        backgroundColor: isActive ? THEME_COLOR : "white",
                        borderColor: isActive ? THEME_COLOR : "#E5E7EB",
                      }}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          isActive ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {month.substring(0, 3)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View className="p-4 bg-white border-t border-gray-100">
            <Pressable
              onPress={onApply}
              className="items-center w-full py-4 rounded-full "
              style={{ backgroundColor: THEME_COLOR }}
            >
              <Text className="text-base font-bold tracking-wide text-white">
                Apply Filters
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end", // Asta lipește conținutul de jos
    paddingHorizontal: 8, // Puțin spațiu lateral
    paddingBottom: 8, // Puțin spațiu jos
  },
});

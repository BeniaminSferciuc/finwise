import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  CreditCard,
  Tag,
} from "lucide-react-native";
import React, { useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategorySheet } from "@/components/add-transaction/category-sheet"; // Importă componenta nouă
import { SegmentButton, styles } from "@/components/segment-button";

import { AddTransactionHeader } from "@/components/add-transaction/add-transaction-header";
import { AmountInput } from "@/components/add-transaction/amount-input";
import { useTransaction } from "@/hooks/use-transaction";
import { THEME_BACKGROUND, THEME_COLOR } from "@/lib/constants";
import { getCategoryDetails } from "@/lib/get-category-details"; // Importă helper-ul de detalii
import { formatDate } from "@/lib/utils";

export default function AddTransactions() {
  const {
    formik,
    handleDateChange,
    handleTypeChange,
    setShowDatePicker,
    showDatePicker,
    categories,
    // isCategoriesError, // Putem ascunde erorile momentan sau le afisam in consola
    // isLoadingCategories,
    createTransactionMutation,
  } = useTransaction();

  const categorySheetRef = useRef<BottomSheetModal>(null);

  const selectedCategoryDetails = useMemo(() => {
    if (!formik.values.categoryId) return null;
    const selectedCat = categories.find(
      (c) => c.id === formik.values.categoryId
    );
    if (!selectedCat) return null;

    const details = getCategoryDetails(selectedCat.name);
    return { ...details, name: selectedCat.name };
  }, [formik.values.categoryId, categories]);

  const renderCategoryIcon = () => {
    if (selectedCategoryDetails) {
      const Icon = selectedCategoryDetails.icon;
      return (
        <View
          className="items-center justify-center w-10 h-10 mr-4 rounded-full"
          style={{ backgroundColor: selectedCategoryDetails.background }}
        >
          <Icon size={20} color={selectedCategoryDetails.iconColor} />
        </View>
      );
    }

    // Default Icon
    return (
      <View className="items-center justify-center w-10 h-10 mr-4 bg-orange-100 rounded-full">
        <Tag size={20} color="#F97316" />
      </View>
    );
  };

  const handleCategorySelect = (id: string) => {
    formik.setFieldValue("categoryId", id);
    categorySheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: THEME_BACKGROUND,
          paddingBottom: Platform.OS === "ios" ? 0 : 24,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <AddTransactionHeader />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            style={{ flex: 1, marginTop: 8 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* 1. SEGMENTED CONTROL */}
            <View style={styles.segmentWrapper}>
              <View style={styles.segmentContainer}>
                <SegmentButton
                  label="Expense"
                  isActive={formik.values.type === "expense"}
                  onPress={() => handleTypeChange("expense")}
                />
                <SegmentButton
                  label="Income"
                  isActive={formik.values.type === "income"}
                  onPress={() => handleTypeChange("income")}
                />
              </View>
            </View>

            {/* 2. AMOUNT INPUT */}
            <AmountInput formik={formik} />

            {/* 3. FORM GROUP */}
            <View className="px-4">
              <View className="overflow-hidden bg-white border shadow-sm border-neutral-100 rounded-3xl shadow-neutral-100">
                {/* DATE ROW */}
                <View className="border-b border-neutral-100">
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    className="flex-row items-center p-5"
                  >
                    <View className="items-center justify-center w-10 h-10 mr-4 bg-purple-100 rounded-full">
                      <CalendarIcon size={20} color="#9333EA" />
                    </View>
                    <Text className="flex-1 text-base font-medium text-black">
                      Date
                    </Text>
                    <View className="px-3 py-1.5 bg-neutral-100 rounded-lg">
                      <Text className="font-semibold text-blue-600">
                        {formatDate(formik.values.date)}
                      </Text>
                    </View>
                  </Pressable>

                  {showDatePicker && (
                    <View className="items-center px-4 pb-4">
                      {Platform.OS === "ios" ? (
                        <>
                          <DateTimePicker
                            value={formik.values.date}
                            mode="date"
                            display="spinner"
                            onChange={handleDateChange}
                            style={{ height: 120, width: "100%" }}
                            textColor="black"
                            locale="ro-RO"
                          />
                          <Pressable
                            onPress={() => setShowDatePicker(false)}
                            className="px-6 py-2 mt-2 rounded-full bg-neutral-100"
                          >
                            <Text className="text-sm font-bold text-neutral-900">
                              Gata
                            </Text>
                          </Pressable>
                        </>
                      ) : (
                        <DateTimePicker
                          value={formik.values.date}
                          mode="date"
                          display="default"
                          onChange={handleDateChange}
                        />
                      )}
                    </View>
                  )}
                </View>

                <View className="border-b border-neutral-100">
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      categorySheetRef.current?.present();
                    }}
                    className="flex-row items-center p-5"
                  >
                    {renderCategoryIcon()}

                    <View className="flex-1">
                      <Text className="text-base font-medium text-black">
                        Category
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Text
                        className={`text-base mr-2 ${
                          selectedCategoryDetails
                            ? "text-black"
                            : "text-gray-400"
                        }`}
                      >
                        {selectedCategoryDetails?.name || "Select"}
                      </Text>
                      <ChevronRight size={20} color="#C7C7CC" />
                    </View>
                  </Pressable>
                </View>

                {/* NOTE ROW */}
                <View className="flex-row items-center p-5">
                  <View className="items-center justify-center w-10 h-10 mr-4 bg-blue-100 rounded-full">
                    <CreditCard size={20} color="#2563EB" />
                  </View>
                  <Text className="w-24 text-base font-medium text-black">
                    Note
                  </Text>
                  <TextInput
                    className="flex-1 h-10 text-base text-right text-black"
                    placeholder="Add details"
                    placeholderTextColor="#9CA3AF"
                    value={formik.values.description}
                    onChangeText={formik.handleChange("description")}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View className="px-6 shadow-none border-neutral-100">
          <Pressable
            onPress={() => formik.handleSubmit()}
            disabled={!formik.isValid || createTransactionMutation.isPending}
            style={{
              backgroundColor:
                !formik.isValid || createTransactionMutation.isPending
                  ? "#E5E7EB"
                  : THEME_COLOR,
            }}
            className="flex-row justify-center items-center h-[56px] rounded-full"
          >
            {createTransactionMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: !formik.isValid ? "#9CA3AF" : "white",
                }}
              >
                Save Transaction
              </Text>
            )}
          </Pressable>
        </View>

        {/* RENDER CATEGORY SHEET */}
        <CategorySheet
          ref={categorySheetRef}
          categories={categories}
          selectedId={formik.values.categoryId}
          onSelect={handleCategorySelect}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

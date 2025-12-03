import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Check } from "lucide-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { BottomDrawer } from "@/components/modal";

import { getCategoryDetails } from "@/lib/get-category-details";
import { Category } from "@/lib/types";

type CategorySheetProps = {
  categories: Category[];
  selectedId: string;
  onSelect: (categoryId: string) => void;
  ref: React.RefObject<BottomSheetModal>;
};

export const CategorySheet = React.forwardRef<
  BottomSheetModal,
  CategorySheetProps
>(({ categories, selectedId, onSelect }, ref) => {
  const renderedCategories = useMemo(() => {
    return categories.map((cat) => {
      const details = getCategoryDetails(cat.name);
      const Icon = details.icon;
      const isSelected = selectedId === cat.id;

      return (
        <Pressable
          key={cat.id}
          onPress={() => onSelect(cat.id)}
          className="items-center w-[30%] mb-6"
          style={{ marginHorizontal: "1.5%" }}
        >
          <View
            className={`w-14 h-14 rounded-full items-center justify-center mb-2 border`}
            style={{
              backgroundColor: details.background,
              borderColor: isSelected ? details.iconColor : "transparent",
            }}
          >
            {isSelected && (
              <View
                className="absolute z-10 p-1 rounded-full -top-1 -right-1"
                style={{ backgroundColor: details.iconColor }}
              >
                <Check size={10} color="white" />
              </View>
            )}
            <Icon size={24} color={details.iconColor} />
          </View>
          <Text
            className="text-xs font-medium text-center text-gray-700"
            numberOfLines={1}
          >
            {cat.name}
          </Text>
        </Pressable>
      );
    });
  }, [categories, selectedId, onSelect]);

  return (
    <BottomDrawer bottomSheetModalRef={ref as any}>
      <View className="w-full">
        <View className="px-6 pt-2 pb-4 border-b border-gray-100">
          <Text className="text-xl font-bold tracking-tight text-gray-900">
            Select Category
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 12,
            justifyContent: "flex-start",
          }}
          showsVerticalScrollIndicator={false}
        >
          {renderedCategories}
        </ScrollView>
      </View>
    </BottomDrawer>
  );
});

CategorySheet.displayName = "CategorySheet";

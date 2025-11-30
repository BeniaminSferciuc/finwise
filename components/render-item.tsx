import { getCategoryDetails } from "@/lib/get-category-details";
import { TransactionSection, TransactionWithCategory } from "@/lib/types";
import React from "react";
import {
  SectionListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RenderOptions = {
  showDate?: boolean;
};

export const createRenderItem = ({ showDate }: RenderOptions = {}) => {
  const RenderItem = ({
    item,
    index,
    section,
  }: SectionListRenderItemInfo<
    TransactionWithCategory,
    TransactionSection
  >) => {
    const categoryName = item.categories?.name || "Uncategorized";

    const {
      icon: IconComponent,
      background,
      iconColor,
    } = getCategoryDetails(categoryName);

    const formattedDate =
      showDate && item.date
        ? new Date(item.date).toLocaleDateString("ro-RO", {
            day: "2-digit",
            month: "short",
          })
        : null;

    const isFirst = index === 0;
    const isLast = index === section.data.length - 1;

    const containerClass = `bg-white px-4 py-4 gap-3 flex-row items-center ${
      isFirst ? "rounded-t-[30px]" : ""
    } ${isLast ? "rounded-b-[30px]" : "border-b border-gray-100"} `;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className={containerClass}
        style={{
          borderTopStartRadius: isFirst ? 30 : 0,
          borderTopEndRadius: isFirst ? 30 : 0,
          borderBottomStartRadius: isLast ? 30 : 0,
          borderBottomEndRadius: isLast ? 30 : 0,
        }}
      >
        {/* Icon */}
        <View
          className={`size-11 rounded-full items-center justify-center ${background}`}
          style={{ backgroundColor: background, borderRadius: 100 }}
        >
          <IconComponent size={18} color={iconColor} strokeWidth={2} />
        </View>

        {/* Text */}
        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-gray-900 capitalize">
            {categoryName}
          </Text>

          {item.description ? (
            <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>
              {item.description}
            </Text>
          ) : null}

          {formattedDate && (
            <Text className="text-[10px] text-gray-400 mt-0.5">
              {formattedDate}
            </Text>
          )}
        </View>

        {/* Amount */}
        <View className="items-end">
          <Text
            className={`text-[15px] font-bold ${
              item.type === "income" ? "text-emerald-500" : "text-red-500"
            }`}
            style={{
              color: item.type === "income" ? "#10b981" : "#ef4444",
            }}
          >
            {item.type === "income" ? "+" : "-"}
            {Math.abs(item.amount).toFixed(2)}
            <Text className="text-xs font-normal"> lei</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  RenderItem.displayName = "RenderItem";
  return RenderItem;
};

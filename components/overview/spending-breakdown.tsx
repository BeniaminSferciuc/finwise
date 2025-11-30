import { formatCurrency } from "@/lib/utils";
import { Pressable, Text, View } from "react-native";

const CATEGORY_STATS = [
  {
    label: "Food & Dining",
    amount: 450,
    total: 1000,
    color: "#FF9F0A",
    percent: "45%",
  },
  {
    label: "Transport",
    amount: 120,
    total: 400,
    color: "#0A84FF",
    percent: "30%",
  },
  {
    label: "Shopping",
    amount: 890,
    total: 1200,
    color: "#BF5AF2",
    percent: "74%",
  },
  {
    label: "Utilities",
    amount: 200,
    total: 300,
    color: "#30D158",
    percent: "66%",
  },
];

type Props = {
  stats: {
    income: number;
    expense: number;
    netWorth: number;
  };
};

export const SpendingBreakdown = ({ stats }: Props) => {
  return (
    <View className="px-6 mt-8 mb-6">
      <Text className="mb-4 text-lg font-bold text-black">
        Spending Breakdown
      </Text>
      <View className="bg-white rounded-[20px] p-5 shadow-sm shadow-gray-100">
        <View className="flex-row items-end justify-between mb-6">
          <View>
            <Text className="text-sm font-medium text-gray-500">
              Total Expenses
            </Text>
            <Text className="text-3xl font-bold text-black">
              {formatCurrency(stats.expense)}
            </Text>
          </View>
          <View className="px-3 py-1 bg-gray-100 rounded-full">
            <Text className="text-xs font-bold text-gray-600">
              Year {new Date().getFullYear()}
            </Text>
          </View>
        </View>

        <View>
          {CATEGORY_STATS.map((cat, index) => (
            <View
              key={cat.label}
              className={index === CATEGORY_STATS.length - 1 ? "" : "mb-5"}
            >
              <View className="flex-row justify-between mb-2">
                <View className="flex-row items-center">
                  <View
                    className="w-2 h-2 mr-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <Text className="text-sm font-semibold text-gray-700">
                    {cat.label}
                  </Text>
                </View>
                <View className="flex-row">
                  <Text className="mr-1 text-sm font-bold text-black">
                    ${cat.amount}
                  </Text>
                  <Text className="text-sm text-gray-400">({cat.percent})</Text>
                </View>
              </View>
              <View className="h-3 overflow-hidden bg-gray-100 rounded-full">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: cat.percent as any,
                    backgroundColor: cat.color,
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        <Pressable className="items-center pt-4 mt-6 border-t border-gray-100">
          <Text className="text-sm font-semibold text-blue-600">
            Show Full Report
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

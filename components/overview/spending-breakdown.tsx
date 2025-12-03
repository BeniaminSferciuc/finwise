import { TransactionWithCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type Props = {
  transactions: TransactionWithCategory[] | undefined;
};

export const SpendingBreakdown = ({ transactions }: Props) => {
  const [, setChartWidth] = useState(0);
  const currentYear = new Date().getFullYear();

  // Pe Luni
  const { barData, maxValue } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { barData: [], maxValue: 1000 };
    }

    // Initializare luni cu 0
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(currentYear, i, 1);
      return {
        monthIndex: i,
        label: d.toLocaleString("default", { month: "short" }), // Jan, Feb...
        income: 0,
        expense: 0,
      };
    });

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      // Luăm în calcul doar anul curent
      if (date.getFullYear() === currentYear) {
        const idx = date.getMonth();
        if (allMonths[idx]) {
          if (tx.type === "income") {
            allMonths[idx].income += tx.amount;
          } else {
            allMonths[idx].expense += Math.abs(tx.amount);
          }
        }
      }
    });

    // Transformăm pentru Gifted Charts (Grouped Bars)
    const chartData: any[] = [];
    let max = 0;

    allMonths.forEach((m) => {
      max = Math.max(max, m.income, m.expense);

      // Bara VENIT (Verde)
      chartData.push({
        value: m.income,
        label: m.label,
        spacing: 4, // Spațiu mic între Venit și Cheltuială
        labelWidth: 30,
        labelTextStyle: { color: "gray", fontSize: 10 },
        frontColor: "#4ade80", // Green
      });

      // Bara CHELTUIALĂ (Roșu)
      chartData.push({
        value: m.expense,
        frontColor: "#ef4444",
        spacing: 24,
      });
    });

    return { barData: chartData, maxValue: max * 1.2 };
  }, [transactions, currentYear]);

  return (
    <View className="px-6 mt-8 mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-black">Monthly Overview</Text>
        <View className="flex-row gap-3">
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 bg-green-400 rounded-full" />
            <Text className="text-xs text-gray-500">Income</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 bg-red-400 rounded-full" />
            <Text className="text-xs text-gray-500">Expense</Text>
          </View>
        </View>
      </View>

      <View
        className="p-5 bg-white rounded-3xl"
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        {barData.length > 0 ? (
          <View className="-ml-4 overflow-hidden">
            <BarChart
              data={barData}
              barWidth={12}
              spacing={24}
              xAxisThickness={0}
              yAxisThickness={1}
              yAxisColor="#ccc"
              yAxisTextStyle={{ color: "gray", fontSize: 10 }}
              noOfSections={6}
              maxValue={maxValue}
              isAnimated
              scrollAnimation={true}
              renderTooltip={(item: any) => {
                return (
                  <View className="px-2 py-1 bg-black rounded-lg">
                    <Text className="text-xs text-white">
                      {formatCurrency(item.value)}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View className="items-center justify-center py-10">
            <Text className="text-gray-400">
              No transactions data for {currentYear}.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

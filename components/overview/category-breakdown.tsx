import { getCategoryDetails } from "@/lib/get-category-details";
import { TransactionWithCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { LucideIcon } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

type Props = {
  data: TransactionWithCategory[] | undefined;
};

type ChartItem = {
  value: number;
  color: string;
  text: string; // Textul afișat pe grafic
  legendText: string; // Numele categoriei pentru legendă
  percentage: number;
  icon: LucideIcon;
  iconBg: string;
};

export const CategoryBreakdown = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState<"income" | "expense">("expense");

  const { chartData, totalAmount } = useMemo(() => {
    if (!data || data.length === 0) {
      return { chartData: [], totalAmount: 0 };
    }

    const filtered = data.filter((t) => t.type === activeTab);
    const grouped: Record<string, number> = {};
    let total = 0;

    filtered.forEach((tx) => {
      const catName = tx.categories?.name || "Altele";
      const val = Math.abs(tx.amount);
      if (!grouped[catName]) grouped[catName] = 0;
      grouped[catName] += val;
      total += val;
    });

    const processed: ChartItem[] = Object.keys(grouped)
      .map((key) => {
        const { icon, background, iconColor } = getCategoryDetails(key);
        const value = grouped[key];
        const percentage = total > 0 ? (value / total) * 100 : 0;

        const sliceText = percentage > 6 ? `${Math.round(percentage)}%` : "";

        return {
          value,
          text: sliceText,
          legendText: key,
          percentage,
          color: iconColor,
          icon,
          iconBg: background,
        };
      })
      .sort((a, b) => b.value - a.value);

    return { chartData: processed, totalAmount: total };
  }, [data, activeTab]);

  return (
    <View className="p-5 mx-6 mb-6 bg-white rounded-3xl ">
      <View className="flex-row p-1 mb-8 bg-gray-100 rounded-full">
        <TouchableOpacity
          onPress={() => setActiveTab("income")}
          style={[
            {
              flex: 1,
              paddingVertical: 8,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            },
            activeTab === "income" && {
              backgroundColor: "#FFFFFF",
            },
          ]}
        >
          <Text
            className={`text-sm font-semibold ${activeTab === "income" ? "text-green-600" : "text-gray-500"}`}
          >
            Venituri
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("expense")}
          style={[
            {
              flex: 1,
              paddingVertical: 8,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            },
            activeTab === "expense" && {
              backgroundColor: "#FFFFFF",
            },
          ]}
        >
          <Text
            className={`text-sm font-semibold ${activeTab === "expense" ? "text-red-500" : "text-gray-500"}`}
          >
            Cheltuieli
          </Text>
        </TouchableOpacity>
      </View>

      {chartData.length === 0 ? (
        <View className="items-center justify-center py-10">
          <Text className="text-gray-400">Nu există date.</Text>
        </View>
      ) : (
        <View className="items-center">
          <PieChart
            data={chartData}
            donut
            radius={120}
            innerRadius={80}
            innerCircleColor="#fff"
            showText={true}
            textColor="black"
            textSize={12}
            fontWeight="bold"
            labelsPosition="onBorder"
            centerLabelComponent={() => {
              return (
                <View className="items-center justify-center">
                  <Text className="text-xs font-medium text-gray-400">
                    Total
                  </Text>
                  <Text className="text-xl font-bold text-black">
                    {formatCurrency(totalAmount)}
                  </Text>
                </View>
              );
            }}
          />

          {/* --- LEGENDĂ --- */}
          <View className="w-full gap-5 mt-10">
            {chartData.map((item, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between w-full"
              >
                <View className="flex-row items-center gap-3">
                  {/* Iconița */}
                  <View
                    className="items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <item.icon size={18} color={item.color} strokeWidth={2} />
                  </View>

                  {/* Text + Bară de progres mică sub nume */}
                  <View>
                    <Text className="text-sm font-semibold text-gray-900 capitalize">
                      {item.legendText}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <View className="h-1 mr-2 overflow-hidden bg-gray-100 rounded-full w-14">
                        <View
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                          className="h-full rounded-full"
                        />
                      </View>
                      <Text className="text-xs text-gray-400">
                        {item.percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Suma */}
                <Text className="text-sm font-bold text-gray-900">
                  {formatCurrency(item.value)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

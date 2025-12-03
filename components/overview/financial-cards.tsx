import { LinearGradient } from "expo-linear-gradient";
import { ArrowDownRight, ArrowUpRight, PieChart } from "lucide-react-native";
import { Dimensions, ScrollView, Text, View } from "react-native";

import { THEME_COLOR } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;

type Props = {
  stats: {
    income: number;
    expense: number;
    netWorth: number;
  };
};

export const FinancialCards = ({ stats }: Props) => {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + 12}
      className="mt-2"
    >
      {/* CARD 1: FINANCIAL OVERVIEW */}
      <LinearGradient
        colors={[THEME_COLOR, "#262626"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: CARD_WIDTH,
          height: 210,
          borderRadius: 32,
          padding: 24,
          justifyContent: "space-between",
        }}
      >
        <View>
          <View className="flex-row items-center mb-2">
            <Text className="mr-2 font-medium text-gray-400">
              Total Net Worth
            </Text>
            <View className="bg-white/20 px-2 py-0.5 rounded-full flex-row items-center">
              <Text className="ml-1 text-xs font-bold text-white">
                Year {new Date().getFullYear()}
              </Text>
            </View>
          </View>
          <Text className="text-4xl font-bold tracking-tight text-white">
            {formatCurrency(stats.netWorth)}
          </Text>
          <Text className="mt-1 text-xs text-gray-500">
            Calculated based on current year activity
          </Text>
        </View>

        <View className="flex-row p-3 mt-6 border bg-white/5 rounded-2xl border-white/5">
          <View className="flex-1 pr-4 border-r border-white/10">
            <View className="flex-row items-center mb-1">
              <View className="items-center justify-center w-4 h-4 mr-2 rounded-full bg-green-500/20">
                <ArrowUpRight size={10} color="#4ade80" />
              </View>
              <Text className="text-xs text-gray-400">Income</Text>
            </View>
            <Text className="font-semibold text-white">
              {formatCurrency(stats.income)}
            </Text>
          </View>

          <View className="flex-1 pl-4">
            <View className="flex-row items-center mb-1">
              <View className="items-center justify-center w-4 h-4 mr-2 rounded-full bg-red-500/20">
                <ArrowDownRight size={10} color="#ef4444" />
              </View>
              <Text className="text-xs text-gray-400">Expenses</Text>
            </View>
            <Text className="font-semibold text-white">
              {formatCurrency(stats.expense)}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <LinearGradient
        colors={["#007AFF", "#0055B3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: CARD_WIDTH,
          height: 210,
          borderRadius: 32,
          padding: 24,
          justifyContent: "space-between",
        }}
      >
        <View>
          <View className="flex-row items-center justify-between">
            <Text className="font-medium text-blue-100">Net Income Rate</Text>
            <PieChart size={20} color="white" opacity={0.8} />
          </View>
          <Text className="mt-2 text-4xl font-bold tracking-tight text-white">
            {stats.income > 0
              ? `${Math.round(((stats.income - stats.expense) / stats.income) * 100)}%`
              : "0%"}
          </Text>
          <Text className="mt-1 text-sm text-blue-100 opacity-80">
            {stats.income - stats.expense > 0
              ? "You are cash positive this year!"
              : "Expenses are higher than income."}
          </Text>
        </View>

        <View className="w-full h-2 overflow-hidden rounded-full bg-white/10">
          <View
            className="h-full bg-white rounded-full"
            style={{
              width: `${stats.income > 0 ? Math.max(0, Math.min(100, ((stats.income - stats.expense) / stats.income) * 100)) : 0}%`,
            }}
          />
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

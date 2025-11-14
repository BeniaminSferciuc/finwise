import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  ChevronRight,
  CreditCard,
  Sparkles,
  Wallet,
} from "lucide-react-native";

import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 pt-6">
          <View className="flex-row gap-2">
            <Text className="text-xl text-gray-500">Hello,</Text>
            <Text className="text-2xl font-bold text-black">Beniamin 👋</Text>
          </View>

          <View className="flex-row items-center gap-4">
            <TouchableOpacity className="p-3 bg-gray-100 rounded-full">
              <Bell size={20} color="#333" />
            </TouchableOpacity>

            <Image
              source={{ uri: "https://i.imgur.com/4ZQZ4ZB.png" }}
              className="w-12 h-12 rounded-full"
            />
          </View>
        </View>

        {/* BALANCE CARD */}
        <LinearGradient
          colors={["#ffa937", "#ffcf85"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-6 mx-6 mt-6 shadow-md rounded-3xl"
          style={{ borderRadius: 16 }}
        >
          <Text className="text-lg text-white/80">Total Balance</Text>
          <Text className="mt-2 text-4xl font-bold text-white">$4,762.20</Text>

          <View className="flex-row justify-between mt-6">
            <View>
              <Text className="text-sm text-white/70">Income</Text>
              <View className="flex-row items-center mt-1">
                <ArrowUpRight size={18} color="white" />
                <Text className="ml-1 font-medium text-white">$2,380</Text>
              </View>
            </View>

            <View>
              <Text className="text-sm text-white/70">Expenses</Text>
              <View className="flex-row items-center mt-1">
                <ArrowDownLeft size={18} color="white" />
                <Text className="ml-1 font-medium text-white">$1,145</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* QUICK ACTIONS */}
        <View className="px-6 mt-8">
          <Text className="mb-4 text-lg font-semibold text-black">
            Quick Actions
          </Text>

          <View className="flex-row justify-between">
            <TouchableOpacity className="items-center flex-1 p-4 mr-3 bg-gray-100 rounded-2xl">
              <Wallet size={26} color="#333" />
              <Text className="mt-2 font-medium text-black">Add Funds</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center flex-1 p-4 mx-3 bg-gray-100 rounded-2xl">
              <CreditCard size={26} color="#333" />
              <Text className="mt-2 font-medium text-black">Cards</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center flex-1 p-4 ml-3 bg-gray-100 rounded-2xl">
              <Sparkles size={26} color="#333" />
              <Text className="mt-2 font-medium text-black">Insights</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* EXPENSE OVERVIEW */}
        <View className="px-6 mt-10">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-black">
              Expense Overview
            </Text>
            <ChevronRight size={20} color="#555" />
          </View>

          <View className="p-6 mt-4 bg-gray-100 rounded-2xl">
            <Text className="text-gray-500">Monthly Spending</Text>
            <Text className="mt-2 text-3xl font-bold text-black">$1,145</Text>

            {/* Placeholder graph */}
            <View className="items-center justify-center h-24 mt-4 bg-gray-300/40 rounded-xl">
              <Text className="text-gray-500">Graph Placeholder</Text>
            </View>
          </View>
        </View>

        {/* RECENT TRANSACTIONS */}
        <View className="px-6 mt-10">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-black">
              Recent Activity
            </Text>
            <ChevronRight size={20} color="#555" />
          </View>

          <View className="mt-4 space-y-4">
            <View className="flex-row items-center justify-between p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
              <View>
                <Text className="font-medium text-black">Netflix</Text>
                <Text className="text-sm text-gray-400">Subscription</Text>
              </View>
              <Text className="font-semibold text-red-500">- $15.99</Text>
            </View>

            <View className="flex-row items-center justify-between p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
              <View>
                <Text className="font-medium text-black">Salary</Text>
                <Text className="text-sm text-gray-400">Income</Text>
              </View>
              <Text className="font-semibold text-green-600">+ $2,300</Text>
            </View>

            <View className="flex-row items-center justify-between p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
              <View>
                <Text className="font-medium text-black">Groceries</Text>
                <Text className="text-sm text-gray-400">Walmart</Text>
              </View>
              <Text className="font-semibold text-red-500">- $82.40</Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View className="px-6 mt-12">
          <TouchableOpacity
            onPress={() => router.push("/overview")}
            className="items-center py-4 bg-black rounded-2xl"
          >
            <Text className="text-lg font-semibold text-white">
              Track Your Finances Smarter →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import {
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
  Car,
  Coffee,
  DollarSign,
  Dumbbell,
  Home,
  MoreHorizontal,
  ShoppingBag,
} from "lucide-react-native";
import React from "react";
import { SectionList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TRANSACTIONS_DATA = [
  {
    title: "Today",
    data: [
      {
        id: "1",
        category: "Food",
        description: "Starbucks Coffee",
        amount: 5.5,
        type: "expense",
        icon: "coffee",
      },
      {
        id: "2",
        category: "Salary",
        description: "Monthly Paycheck",
        amount: 3200.0,
        type: "income",
        icon: "salary",
      },
    ],
  },
  {
    title: "Yesterday",
    data: [
      {
        id: "3",
        category: "Transport",
        description: "Uber Ride",
        amount: 14.2,
        type: "expense",
        icon: "transport",
      },
      {
        id: "4",
        category: "Shopping",
        description: "Zara - New Coat",
        amount: 89.99,
        type: "expense",
        icon: "shopping",
      },
    ],
  },
  {
    title: "November 15",
    data: [
      {
        id: "5",
        category: "Home",
        description: "Internet Bill",
        amount: 45.0,
        type: "expense",
        icon: "home",
      },
      {
        id: "6",
        category: "Health",
        description: "Gym Membership",
        amount: 30.0,
        type: "expense",
        icon: "health",
      },
    ],
  },
];

// 2. Helper pentru Iconițe și Culori
const getCategoryDetails = (category: string) => {
  switch (category.toLowerCase()) {
    case "food":
      return { icon: Coffee, color: "bg-orange-100", iconColor: "#F97316" };
    case "transport":
      return { icon: Car, color: "bg-blue-100", iconColor: "#2563EB" };
    case "shopping":
      return { icon: ShoppingBag, color: "bg-pink-100", iconColor: "#DB2777" };
    case "home":
      return { icon: Home, color: "bg-purple-100", iconColor: "#9333EA" };
    case "salary":
      return { icon: DollarSign, color: "bg-green-100", iconColor: "#16A34A" };
    case "health":
      return { icon: Dumbbell, color: "bg-red-100", iconColor: "#DC2626" };
    default:
      return { icon: Briefcase, color: "bg-gray-100", iconColor: "#4B5563" };
  }
};

const Transactions = () => {
  const renderItem = ({ item, index, section }: any) => {
    const {
      icon: IconComponent,
      color,
      iconColor,
    } = getCategoryDetails(item.category);

    // Logică pentru colțuri rotunjite (Apple Style Grouped List)
    const isFirst = index === 0;
    const isLast = index === section.data.length - 1;
    const radiusStyle = `
      ${isFirst ? "rounded-t-[28px]" : ""} 
      ${isLast ? "rounded-b-[28px]" : ""}
    `;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className={`bg-white px-4 py-3.5 flex-row items-center ${radiusStyle} ${
          !isLast ? "border-b border-gray-100" : ""
        }`}
      >
        {/* ICON */}
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${color}`}
        >
          <IconComponent size={18} color={iconColor} strokeWidth={1.75} />
        </View>

        {/* DETAILS */}
        <View className="flex-1">
          <Text className="text-[14px] font-semibold text-black">
            {item.category}
          </Text>
          <Text className="text-[12px] text-gray-500" numberOfLines={1}>
            {item.description}
          </Text>
        </View>

        {/* AMOUNT */}
        <View className="items-end">
          <Text
            className={`text-base font-bold ${
              item.type === "income" ? "text-green-600" : "text-black"
            }`}
          >
            {item.type === "income" ? "+" : "-"}${item.amount.toFixed(2)}
          </Text>
          {/* Mic indicator de tip */}
          {item.type === "income" ? (
            <ArrowDownLeft size={12} color="#16a34a" className="mt-0.5" />
          ) : (
            <ArrowUpRight size={12} color="#6b7280" className="mt-0.5" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render Section Header (Data)
  const renderSectionHeader = ({ section: { title } }: any) => (
    <View className="mt-4 mb-1">
      <Text className="text-lg font-bold tracking-wide text-neutral-500">
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 mt-8 bg-gray-100" edges={["top"]}>
      {/* HEADER ECRAN */}
      <View className="flex-row items-center justify-between px-5 pb-3 bg-gray-100">
        <Text className="text-3xl font-bold tracking-tight text-black">
          Transactions
        </Text>
        <TouchableOpacity className="items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
          <MoreHorizontal size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* LISTA TRANZACȚII */}
      <SectionList
        sections={TRANSACTIONS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={true}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

export default Transactions;

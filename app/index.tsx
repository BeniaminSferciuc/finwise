import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <View className="flex-1 bg-white">
      <View
        style={{ borderRadius: 1000 }}
        className="absolute bg-indigo-200 rounded-full -top-20 -left-20 w-72 h-72 opacity-20"
      />
      <View
        style={{ borderRadius: 1000 }}
        className="absolute w-64 h-64 bg-indigo-100 rounded-full top-40 -right-28 opacity-30"
      />
      <View
        style={{ borderRadius: 1000 }}
        className="absolute w-40 h-40 bg-indigo-300 rounded-full -bottom-5 -left-10 opacity-20"
      />

      <SafeAreaView edges={["bottom", "left", "right"]} className="flex-1 px-8">
        {/* LOGO BUBBLE */}
        <View className="items-start flex-1 mt-14">
          <View className="p-4 bg-white border border-gray-200 shadow-lg rounded-2xl shadow-black/10">
            <Sparkles size={38} color="#4338CA" />
          </View>
        </View>

        {/* HERO HEADLINE */}
        <View className="justify-end flex-1 mb-20">
          <Text className="text-[44px] text-black font-extrabold">
            Take Control{"\n"}of Your
          </Text>

          <MaskedView
            maskElement={
              <Text className="text-[44px] font-extrabold -mt-2">
                Financial Life
              </Text>
            }
          >
            <LinearGradient
              colors={["#4338CA", "#6366F1"]} // indigo-700 → indigo-500
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text
                className="text-[44px] font-extrabold"
                style={{
                  opacity: 0, // mask text hidden
                }}
              >
                Financial Life
              </Text>
            </LinearGradient>
          </MaskedView>

          {/* SUBTITLE */}
          <Text className="mt-4 text-[16px] leading-6 text-gray-600">
            Manage expenses, monitor budgets,{"\n"}and make smarter money
            choices.
          </Text>
        </View>

        {/* CTA BUTTON */}
        <TouchableOpacity
          onPress={() => router.push("/sign-in")}
          activeOpacity={0.85}
          className="items-center justify-center h-20 mb-10 overflow-hidden bg-indigo-700 rounded-full shadow-black/10"
        >
          <Text className="font-semibold text-center text-white">
            Get Started
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

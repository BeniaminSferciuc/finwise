import { router } from "expo-router";
import { X } from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";

export const AddTransactionHeader = ({ title }: { title?: string }) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      <Pressable
        onPress={() => router.back()}
        className="items-center justify-center w-10 h-10 rounded-full bg-neutral-200"
        style={{
          opacity: Platform.OS === "ios" ? 0 : 100,
        }}
      >
        <X size={20} color="#333" />
      </Pressable>
      <Text className="text-lg font-bold text-black">{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
};

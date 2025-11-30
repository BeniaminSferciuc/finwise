import { router } from "expo-router";
import { Settings } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { authClient } from "@/lib/auth-client";

export const Header = () => {
  const { data: session } = authClient.useSession();

  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <View>
        <Text className="text-2xl font-bold tracking-tight text-black">
          Hello, {session?.user.name} 👋
        </Text>
      </View>
      <Pressable onPress={() => router.push("/settings")} hitSlop={20}>
        <Settings color="gray" />
      </Pressable>
    </View>
  );
};

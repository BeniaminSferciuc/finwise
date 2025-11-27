import { Text, View } from "react-native";

import { TransactionSection } from "@/lib/types";

export const renderSectionHeader = ({
  section: { title },
}: {
  section: TransactionSection;
}) => (
  <View className="pl-4 mt-2 mb-2">
    <Text className="text-sm font-bold tracking-widest text-gray-400">
      {title}
    </Text>
  </View>
);

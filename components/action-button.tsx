import { LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type ActionButtonProps = {
  icon: LucideIcon;
  label: string;
  color: string;
  iconColor?: string;
  onPress?: () => void;
};

export const ActionButton = ({
  icon: Icon,
  label,
  color,
  iconColor = "white",
  onPress,
}: ActionButtonProps) => (
  <Pressable onPress={onPress} className="items-center justify-center gap-2">
    <View
      className={`w-16 h-16 rounded-full items-center justify-center ${color}`}
    >
      <Icon size={26} color={iconColor} strokeWidth={1.5} />
    </View>
    <Text className="text-xs font-medium text-gray-600">{label}</Text>
  </Pressable>
);

import { getCategoryDetails } from "@/lib/get-category-details";
import { TransactionSection, TransactionWithCategory } from "@/lib/types";
import { Trash } from "lucide-react-native";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// ... (RightAction rămâne neschimbat) ...
const RightAction = ({
  drag,
  onPress,
  isLoading,
}: {
  drag: SharedValue<number>;
  onPress: () => void;
  isFirst: boolean;
  isLast: boolean;
  isLoading: boolean;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      drag.value,
      [-80, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { transform: [{ scale }] };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
      style={{
        width: 80,
        backgroundColor: "#ef4444",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        marginLeft: 8,
        marginVertical: 8,
      }}
    >
      <Reanimated.View style={animatedStyle}>
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Trash size={24} color="white" />
        )}
      </Reanimated.View>
    </TouchableOpacity>
  );
};

interface TransactionItemProps {
  item: TransactionWithCategory;
  index: number;
  section: TransactionSection;
  showDate?: boolean;
  onDelete?: (id: string) => void;
  onPress?: (item: TransactionWithCategory) => void; // <--- ADĂUGAT
  deletingId?: string | null;
}

export const TransactionItem = ({
  item,
  index,
  section,
  showDate,
  onDelete,
  onPress, // <--- ADĂUGAT
  deletingId,
}: TransactionItemProps) => {
  const categoryName = item.categories?.name || "Uncategorized";
  const {
    icon: IconComponent,
    background,
    iconColor,
  } = getCategoryDetails(categoryName);

  const formattedDate =
    showDate && item.date
      ? new Date(item.date).toLocaleDateString("ro-RO", {
          day: "2-digit",
          month: "short",
        })
      : null;

  const isFirst = index === 0;
  const isLast = index === section.data.length - 1;
  const isThisItemDeleting = deletingId === item.id;
  const containerClass = `bg-white px-4 py-4 gap-3 flex-row items-center`;

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      overshootRight={false}
      containerStyle={{
        backgroundColor: "transparent",
      }}
      renderRightActions={(_progress, drag) => (
        <RightAction
          drag={drag}
          onPress={() => onDelete?.(item.id)}
          isFirst={isFirst}
          isLast={isLast}
          isLoading={isThisItemDeleting}
        />
      )}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress?.(item)} // <--- ADĂUGAT LOGICA DE APĂSARE
        className={containerClass}
        style={{
          borderTopStartRadius: isFirst ? 30 : 0,
          borderTopEndRadius: isFirst ? 30 : 0,
          borderBottomStartRadius: isLast ? 30 : 0,
          borderBottomEndRadius: isLast ? 30 : 0,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: "#f3f4f6",
        }}
      >
        <View
          className={`size-11 rounded-full items-center justify-center ${background}`}
          style={{ backgroundColor: background, borderRadius: 100 }}
        >
          <IconComponent size={18} color={iconColor} strokeWidth={2} />
        </View>

        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-gray-900 capitalize">
            {categoryName}
          </Text>
          {item.description ? (
            <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>
              {item.description}
            </Text>
          ) : null}
          {formattedDate && (
            <Text className="text-[10px] text-gray-400 mt-0.5">
              {formattedDate}
            </Text>
          )}
        </View>

        <View className="items-end">
          <Text
            className={`text-[15px] font-bold ${
              item.type === "income" ? "text-emerald-500" : "text-red-500"
            }`}
            style={{
              color: item.type === "income" ? "#10b981" : "#ef4444",
            }}
          >
            {item.type === "income" ? "+" : "-"}
            {Math.abs(item.amount).toFixed(2)}
            <Text className="text-xs font-normal"> lei</Text>
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

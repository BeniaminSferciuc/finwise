import {
  Briefcase,
  Bus,
  Car,
  CircleHelp,
  Gift,
  GraduationCap,
  HandHeart,
  HeartPulse,
  LucideIcon,
  PartyPopper,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Utensils,
  Wallet,
} from "lucide-react-native";

// Return type
interface CategoryDetails {
  icon: LucideIcon;
  background: string; // HEX
  iconColor: string; // HEX
}

export const getCategoryDetails = (categoryName: string): CategoryDetails => {
  const name = categoryName?.toLowerCase() || "other";

  switch (name) {
    // ===========================
    //        INCOME
    // ===========================
    case "salary":
      return { icon: Wallet, background: "#DCFCE7", iconColor: "#16A34A" };

    case "freelance":
      return { icon: Briefcase, background: "#DBEAFE", iconColor: "#2563EB" };

    case "investments":
      return { icon: TrendingUp, background: "#D1FAE5", iconColor: "#059669" };

    case "gifts":
      return { icon: Gift, background: "#FCE7F3", iconColor: "#DB2777" };

    case "other":
      return { icon: CircleHelp, background: "#F3F4F6", iconColor: "#4B5563" };

    // ===========================
    //        EXPENSE
    // ===========================
    case "food & drink":
    case "food":
      return { icon: Utensils, background: "#FFEDD5", iconColor: "#F97316" };

    case "transport":
      return { icon: Bus, background: "#DBEAFE", iconColor: "#2563EB" };

    case "car":
    case "uber":
      return { icon: Car, background: "#DBEAFE", iconColor: "#1D4ED8" };

    case "shopping":
    case "clothing":
      return { icon: ShoppingBag, background: "#FAE8FF", iconColor: "#C026D3" };

    case "bills & fees":
    case "bills":
    case "utilities":
      return { icon: Receipt, background: "#EDE9FE", iconColor: "#9333EA" };

    case "entertainment":
      return { icon: PartyPopper, background: "#FEF3C7", iconColor: "#D97706" };

    case "healthcare":
    case "health":
      return { icon: HeartPulse, background: "#FEE2E2", iconColor: "#DC2626" };

    case "education":
      return {
        icon: GraduationCap,
        background: "#E0E7FF",
        iconColor: "#4F46E5",
      };

    case "donation":
      return { icon: HandHeart, background: "#FFE4E6", iconColor: "#E11D48" };

    // ===========================
    //      DEFAULT
    // ===========================
    default:
      return { icon: CircleHelp, background: "#F3F4F6", iconColor: "#9CA3AF" };
  }
};

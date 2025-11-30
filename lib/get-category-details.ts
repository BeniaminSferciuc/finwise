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

type CategoryDetails = {
  icon: LucideIcon;
  background: string;
  iconColor: string;
};

export const getCategoryDetails = (categoryName: string): CategoryDetails => {
  const name = categoryName?.toLowerCase() || "other";

  switch (name) {
    // --- VENITURI (Păstrate pe tonuri de Verde/Albastru/Aur) ---
    case "salary":
      return { icon: Wallet, background: "#DCFCE7", iconColor: "#16A34A" }; // Green

    case "freelance":
      return { icon: Briefcase, background: "#E0F2FE", iconColor: "#0284C7" }; // Sky Blue

    case "investments":
      return { icon: TrendingUp, background: "#ECFCCB", iconColor: "#65A30D" }; // Lime

    case "gifts":
      return { icon: Gift, background: "#FEF9C3", iconColor: "#CA8A04" }; // Gold/Yellow (Income)

    // --- CHELTUIELI (Culori Distincte) ---

    // 1. Food -> Portocaliu (Orange)
    case "food & drink":
    case "food":
      return { icon: Utensils, background: "#FFEDD5", iconColor: "#EA580C" };

    // 2. Transport -> Albastru Clasic (Blue)
    case "transport":
      return { icon: Bus, background: "#DBEAFE", iconColor: "#2563EB" };

    // 3. Car/Uber -> Cyan/Turcoaz (Să fie diferit de Transport)
    case "car":
    case "uber":
      return { icon: Car, background: "#CFFAFE", iconColor: "#0891B2" };

    // 4. Shopping -> Roz/Fuchsia (Pink)
    case "shopping":
    case "clothing":
      return { icon: ShoppingBag, background: "#FAE8FF", iconColor: "#C026D3" };

    // 5. Bills -> Violet/Mov (Purple) - Diferit de Shopping
    case "bills & fees":
    case "bills":
    case "utilities":
      return { icon: Receipt, background: "#F3E8FF", iconColor: "#7C3AED" };

    // 6. Entertainment -> Galben închis/Chihlimbar (Amber)
    case "entertainment":
      return { icon: PartyPopper, background: "#FEF3C7", iconColor: "#D97706" };

    // 7. Health -> Roșu (Red)
    case "healthcare":
    case "health":
      return { icon: HeartPulse, background: "#FEE2E2", iconColor: "#DC2626" };

    // 8. Education -> Indigo (Indigo)
    case "education":
      return {
        icon: GraduationCap,
        background: "#E0E7FF",
        iconColor: "#4F46E5",
      };

    // 9. Donation -> Rose/Zmeuriu (Rose) - Diferit de Health
    case "donation":
      return { icon: HandHeart, background: "#FFE4E6", iconColor: "#E11D48" };

    // Default -> Gri (Gray)
    case "other":
    default:
      return { icon: CircleHelp, background: "#F3F4F6", iconColor: "#6B7280" };
  }
};

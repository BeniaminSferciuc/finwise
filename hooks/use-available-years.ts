import { authClient } from "@/lib/auth-client";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useAvailableYears = () => {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: ["available-years", session?.user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("date")
        .eq("user_id", session?.user.id ?? "")
        .order("date", { ascending: false });

      const uniqueYears = new Set<number>();
      data?.forEach((tx) => uniqueYears.add(new Date(tx.date).getFullYear()));
      return Array.from(uniqueYears).sort((a, b) => b - a);
    },
    enabled: !!session?.user.id,
  });
};

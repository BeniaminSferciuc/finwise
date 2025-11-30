import { authClient } from "@/lib/auth-client";
import { QUERYKEYS } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useOverviewTransactions = () => {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: [QUERYKEYS.OVERVIEW_TRANSACTIONS, session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return [];

      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01`;
      const endOfYear = `${currentYear}-12-31`;

      const { data, error } = await supabase
        .from("transactions")
        .select("*, categories(*)")
        .eq("user_id", session.user.id)
        .gte("date", startOfYear)
        .lte("date", endOfYear)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });
};

import { authClient } from "@/lib/auth-client";
import { QUERYKEYS } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { FilterType } from "@/lib/types";
import { getDateRange } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

type UseTransactionsProps = {
  year: number;
  type: FilterType;
};

export const useListTransactions = ({ year, type }: UseTransactionsProps) => {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: [QUERYKEYS.TRANSACTIONS, userId, year, type],
    queryFn: async () => {
      const { start, end } = getDateRange(year);

      let query = supabase
        .from("transactions")
        .select("*, categories(*)")
        .eq("user_id", userId ?? "")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })
        .gte("date", start)
        .lte("date", end);

      if (type !== "all") {
        query = query.eq("type", type);
      }

      const { data, error } = await query.throwOnError();
      if (error) throw error;

      return data;
    },

    enabled: !!userId,
  });
};

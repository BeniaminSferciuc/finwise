import { authClient } from "@/lib/auth-client";
import { QUERYKEYS } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useListCategories = () => {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: [QUERYKEYS.CATEGORIES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId ?? "")
        .order("name", { ascending: true })
        .throwOnError();

      return data;
    },
    enabled: !!userId,
  });
};

import { authClient } from "@/lib/auth-client";
import { QUERYKEYS } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { TransactionWithCategory } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTransaction = () => {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!data?.user?.id) throw new Error("No user");
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", data.user.id);
      if (error) throw error;
    },
    onMutate: async (deletedId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: [QUERYKEYS.TRANSACTIONS] });
      await queryClient.cancelQueries({
        queryKey: [QUERYKEYS.OVERVIEW_TRANSACTIONS],
      });

      const previousTransactions = queryClient.getQueryData<
        TransactionWithCategory[]
      >([QUERYKEYS.TRANSACTIONS]);
      const previousOverview = queryClient.getQueryData<
        TransactionWithCategory[]
      >([QUERYKEYS.OVERVIEW_TRANSACTIONS]);

      queryClient.setQueryData<TransactionWithCategory[]>(
        [QUERYKEYS.TRANSACTIONS],
        (old) => {
          if (!old) return [];
          return old.filter((transaction) => transaction.id !== deletedId);
        }
      );

      queryClient.setQueryData<TransactionWithCategory[]>(
        [QUERYKEYS.OVERVIEW_TRANSACTIONS],
        (old) => {
          if (!old) return [];
          return old.filter((transaction) => transaction.id !== deletedId);
        }
      );

      return { previousTransactions, previousOverview };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          [QUERYKEYS.TRANSACTIONS],
          context.previousTransactions
        );
      }
      if (context?.previousOverview) {
        queryClient.setQueryData(
          [QUERYKEYS.OVERVIEW_TRANSACTIONS],
          context.previousOverview
        );
      }
      alert("Nu s-a putut șterge tranzacția. Datele au fost restaurate.");
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.OVERVIEW_TRANSACTIONS],
      });
    },
  });
};

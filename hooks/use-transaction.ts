import { authClient } from "@/lib/auth-client";
import { QUERYKEYS } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router"; // 1. Import necesar pentru ID
import { useFormik } from "formik";
import { useState } from "react";
import { Platform } from "react-native";
import * as Yup from "yup";
import { useCategories } from "./use-categories";
import { useInsertTransaction } from "./use-insert-transaction";

const TransactionSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Suma este obligatorie")
    .positive("Suma trebuie să fie pozitivă"),
  type: Yup.string().oneOf(["income", "expense"]).required(),
  date: Yup.date().required(),
  description: Yup.string().nullable(), // Am schimbat in nullable pentru compatibilitate
  categoryId: Yup.string().required("Selectează o categorie"),
});

export const useTransaction = () => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  // 2. Verificăm dacă suntem pe modul de Editare
  const params = useLocalSearchParams<{ id: string }>();
  const isEditing = !!params.id;

  const [showDatePicker, setShowDatePicker] = useState(false);

  // 3. Fetch Transaction Details (Doar dacă avem ID)
  const { data: existingTransaction, isLoading: isLoadingTransaction } =
    useQuery({
      queryKey: ["transaction", params.id],
      queryFn: async () => {
        if (!params.id) return null;
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        return data;
      },
      enabled: isEditing,
    });

  // Mutation pentru creare (existent)
  const createTransactionMutation = useInsertTransaction(session?.user.id);

  // 4. Mutation pentru Update (NOU)
  const updateTransactionMutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from("transactions")
        .update({
          amount: Number(values.amount),
          category: values.categoryId,
          date: values.date.toISOString(),
          description: values.description,
          type: values.type,
        })
        .eq("id", params.id!); // Folosim ID-ul din params

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.TRANSACTIONS, session?.user.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.OVERVIEW_TRANSACTIONS, session?.user.id],
      });

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(dashboard)/overview");
      }
    },
  });

  // 5. Setup Formik cu enableReinitialize
  const formik = useFormik({
    initialValues: {
      // Dacă avem date existente, le folosim. Altfel, default.
      amount: existingTransaction?.amount
        ? String(existingTransaction.amount)
        : "",
      type: (existingTransaction?.type as "income" | "expense") || "expense",
      date: existingTransaction?.date
        ? new Date(existingTransaction.date)
        : new Date(),
      description: existingTransaction?.description || "",
      categoryId: existingTransaction?.category || "",
    },
    enableReinitialize: true, // IMPORTANT: Permite formularului să se actualizeze când vin datele din DB
    validationSchema: TransactionSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      if (isEditing) {
        // Logica de UPDATE
        updateTransactionMutation.mutate(values);
      } else {
        // Logica de INSERT (existentă)
        createTransactionMutation.mutate({
          amount: values.amount,
          type: values.type,
          date: values.date,
          description: values.description,
          selectedCategoryId: values.categoryId,
        });
      }
    },
  });

  // Fetch categorii bazat pe tipul din Formik
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
  } = useCategories(formik.values.type, session?.user.id);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || formik.values.date;
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    formik.setFieldValue("date", currentDate);
  };

  const handleTypeChange = (newType: "income" | "expense") => {
    formik.setFieldValue("type", newType);
    // Resetăm categoria doar dacă schimbăm manual tipul și nu suntem în timpul inițializării editării
    // (O logică simplificată este să o resetăm mereu, utilizatorul va alege din nou)
    formik.setFieldValue("categoryId", "");
  };

  return {
    formik,
    showDatePicker,
    setShowDatePicker,
    handleDateChange,
    handleTypeChange,
    categories,
    isLoadingCategories,
    isCategoriesError,
    // Returnăm un obiect unificat "mutation" pentru UI (loading state etc.)
    mutation: isEditing ? updateTransactionMutation : createTransactionMutation,
    // Returnăm și helperi noi pentru UI
    isEditing,
    isLoadingTransaction,
    // Păstrăm și vechiul nume dacă e folosit explicit undeva, deși "mutation" e preferat acum
    createTransactionMutation,
  };
};

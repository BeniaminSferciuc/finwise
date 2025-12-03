import { Database } from "./database.types";

export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export type Category = Database["public"]["Tables"]["categories"]["Row"];

export type TransactionWithCategory = Transaction & {
  categories: Category;
};

export type User = Database["public"]["Tables"]["user"]["Row"];

export interface TransactionSection {
  title?: string;
  data: TransactionWithCategory[];
}

export type FilterType = "all" | "income" | "expense";

export type FormValues = {
  amount: string;
  type: "expense" | "income";
  date: Date;
  description: string;
  categoryId: string;
};

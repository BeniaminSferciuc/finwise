import { FormValues } from "@/lib/types";
import { FormikProps } from "formik";
import React from "react";
import { Text, TextInput, View } from "react-native";

export const AmountInput = ({
  formik,
}: {
  formik: FormikProps<FormValues>;
}) => {
  return (
    <View>
      <View className="items-center justify-center mt-10 mb-8">
        <Text className="mb-3 text-xs font-bold tracking-widest uppercase text-neutral-400">
          ENTER AMOUNT
        </Text>
        <View className="flex-row items-center justify-center w-full px-6">
          <TextInput
            style={{
              fontSize: 60,
              fontWeight: "bold",
              textAlign: "center",
              color: formik.values.type === "income" ? "#16a34a" : "#ef4444",
            }}
            placeholder="0"
            placeholderTextColor="#E5E7EB"
            keyboardType="numeric"
            value={formik.values.amount}
            onChangeText={formik.handleChange("amount")}
            onBlur={formik.handleBlur("amount")}
            autoFocus
          />
          <Text
            style={{
              fontSize: 30,
              fontWeight: "500",
              marginTop: 16,
              marginLeft: 8,
              color: formik.values.type === "income" ? "#16a34a" : "#ef4444",
            }}
          >
            RON
          </Text>
        </View>
      </View>
    </View>
  );
};

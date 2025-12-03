import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "http://192.168.100.168:8081",
  disableDefaultFetchPlugins: true,
  plugins: [
    expoClient({
      scheme: "finwise",
      storage: SecureStore,
    }),
  ],
});

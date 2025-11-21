import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL!,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [expo()],
  socialProviders: {
    google: {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: ["exp://172.20.10.2:8081", "finwise://"],
});

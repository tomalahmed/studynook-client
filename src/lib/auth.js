import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { client, getDatabase } from "./mongodb";

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

/**
 * Better Auth handles login/register/Google. After a session exists,
 * SessionTokenSync + /api/auth/set-token mint an httpOnly JWT (`token`)
 * with { userId } for Next middleware and the Express API (same secret).
 */
export const auth = betterAuth({
  database: mongodbAdapter(getDatabase(), {
    client,
    transaction: false,
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
  },
  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            prompt: "select_account",
          },
        }
      : {}),
  },
  user: {
    additionalFields: {},
  },
  plugins: [nextCookies()],
});

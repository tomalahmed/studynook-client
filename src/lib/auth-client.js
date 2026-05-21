import { createAuthClient } from "better-auth/react";
import { getPublicBetterAuthUrl } from "@/lib/app-env";

export const authClient = createAuthClient({
  baseURL: getPublicBetterAuthUrl(),
});

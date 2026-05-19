"use client";

import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  return {
    user: session?.user ?? null,
    session,
    isPending,
    error,
    refetch,
    isAuthenticated: Boolean(session?.user),
  };
}

"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * After Better Auth establishes a session (email login or Google OAuth),
 * mint the HTTP-only JWT `token` cookie via /api/auth/set-token.
 */
export default function SessionTokenSync() {
  const { user, isPending } = useAuth();
  const syncedUserId = useRef(null);

  useEffect(() => {
    if (isPending || !user?.id) {
      return;
    }

    if (syncedUserId.current === user.id) {
      return;
    }

    syncedUserId.current = user.id;

    fetch("/api/auth/set-token", {
      method: "POST",
      credentials: "include",
    }).catch(() => {
      syncedUserId.current = null;
    });
  }, [user?.id, isPending]);

  return null;
}

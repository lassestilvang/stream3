// hooks/use-auth.ts
"use client";

import { useSession } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const user = session?.user || null;
  const loading = status === "loading";
  const error = null; // useSession doesn't provide error state

  return { user, loading, error };
};

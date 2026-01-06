"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const userRefresh = async () => {
      await refreshUser();
      router.replace("/");
    };

    userRefresh();
  }, [refreshUser, router]);

  return null;
}

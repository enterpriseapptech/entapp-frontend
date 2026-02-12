"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetUserByIdQuery } from "@/redux/services/authApi";
import { UserType } from "@/redux/services/authApi";

type AuthGuardOptions = {
  requireAdmin?: boolean;
};

export function useAuthGuard(options: AuthGuardOptions = {}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id") || sessionStorage.getItem("user_id")
      : null;

  const {
    data: user,
    isLoading,
    error,
  } = useGetUserByIdQuery(userId ?? "", {
    skip: !userId,
  });

  useEffect(() => {
    // Still loading → do nothing
    if (isLoading) return;

    // Not logged in
    if (!userId) {
      router.replace("/login");
      return;
    }

    // API error
    if (error) {
      localStorage.clear();
      sessionStorage.clear();
      router.replace("/login");
      return;
    }

    // Role check
    if (options.requireAdmin && user?.userType !== UserType.ADMIN) {
      router.replace("/login"); // or /unauthorized
      return;
    }

    // Passed all checks
    setIsAuthorized(true);
  }, [userId, user, error, isLoading, options.requireAdmin, router]);

  return {
    user,
    isLoading,
    isAuthorized,
  };
}

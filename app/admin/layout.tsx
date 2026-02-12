"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useAuthGuard({ requireAdmin: true });

  // Block everything while checking auth
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
}

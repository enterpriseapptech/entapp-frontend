"use client";

import { Suspense } from "react";

interface GlobalSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wraps children in a Suspense boundary to avoid
 * "useSearchParams() should be wrapped in a suspense boundary" errors.
 * Best practice: wrap at the highest layout level.
 */
export default function GlobalSuspense({
  children,
  fallback = null,
}: GlobalSuspenseProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

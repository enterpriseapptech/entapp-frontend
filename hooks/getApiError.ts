/**
 * Extracts the human-readable error message from an RTK Query / API error.
 * The backend returns { statusCode, message } inside `error.data`.
 * Falls back to `fallback` when the shape doesn't match.
 */
export function getApiError(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    const e = error as { data?: { message?: string } | string; message?: string };
    if (typeof e.data === "object" && e.data?.message) return e.data.message;
    if (typeof e.data === "string" && e.data) return e.data;
    if (typeof e.message === "string" && e.message) return e.message;
  }
  return fallback;
}

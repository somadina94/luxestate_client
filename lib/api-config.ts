/**
 * Express Luxestate mounts REST at the origin root (`/auth`, `/notifications`, …).
 * Strip a trailing `/api/v1` when env still points at the legacy FastAPI prefix.
 */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";
  return raw.replace(/\/api\/v1\/?$/i, "").replace(/\/$/, "");
}

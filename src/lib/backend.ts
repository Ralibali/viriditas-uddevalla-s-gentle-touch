/**
 * Minimal client for the site's Supabase project.
 *
 * The public site only reads published content, records consented clicks and
 * calls edge functions, so it talks to PostgREST and the functions gateway
 * directly instead of shipping the full SDK (auth, storage and realtime are
 * never used in the browser).
 */

const BASE_URL = String(import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/+$/, "");
const PUBLISHABLE_KEY = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "");

export class BackendError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "BackendError";
    this.status = status;
  }
}

/** Legacy anon keys are JWTs and may be sent as bearer tokens; new publishable keys may not. */
function authHeaders(): Record<string, string> {
  if (!PUBLISHABLE_KEY) return {};
  return PUBLISHABLE_KEY.startsWith("eyJ")
    ? { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${PUBLISHABLE_KEY}` }
    : { apikey: PUBLISHABLE_KEY };
}

async function errorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.clone().json()) as { error?: unknown; message?: unknown } | null;
    const message = body?.error ?? body?.message;
    return typeof message === "string" && message.trim() ? message : fallback;
  } catch {
    return fallback;
  }
}

async function send(url: string, init: RequestInit, offlineMessage: string): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new BackendError(offlineMessage, 0);
  }
}

/** Read rows through PostgREST. `query` uses PostgREST syntax, e.g. { slug: "eq.om-oss" }. */
export async function selectRows<T>(table: string, query: Record<string, string> = {}, signal?: AbortSignal): Promise<T[]> {
  const params = new URLSearchParams(query);
  const response = await send(
    `${BASE_URL}/rest/v1/${encodeURIComponent(table)}?${params}`,
    { headers: { ...authHeaders(), Accept: "application/json" }, signal },
    "Innehållet kunde inte hämtas. Kontrollera anslutningen.",
  );
  if (!response.ok) throw new BackendError(await errorMessage(response, "Innehållet kunde inte hämtas."), response.status);
  return (await response.json()) as T[];
}

/** Insert one row without reading it back, so no select permission is needed. */
export async function insertRow(table: string, row: Record<string, unknown>): Promise<void> {
  const response = await send(
    `${BASE_URL}/rest/v1/${encodeURIComponent(table)}`,
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(row),
      keepalive: true,
    },
    "Kunde inte spara. Kontrollera anslutningen.",
  );
  if (!response.ok) throw new BackendError(await errorMessage(response, "Kunde inte spara."), response.status);
}

/** Call an edge function with a JSON body. Errors carry the function's own message. */
export async function callFunction<T>(name: string, body: unknown, headers: Record<string, string> = {}): Promise<T> {
  const response = await send(
    `${BASE_URL}/functions/v1/${encodeURIComponent(name)}`,
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body ?? {}),
    },
    "Kunde inte nå servern. Kontrollera anslutningen och försök igen.",
  );
  const data = (await response.json().catch(() => null)) as (T & { error?: unknown }) | null;
  if (!response.ok || (data && typeof data === "object" && "error" in data && data.error)) {
    const message = data && typeof data.error === "string" && data.error ? data.error : "Åtgärden kunde inte slutföras. Försök igen om en stund.";
    throw new BackendError(message, response.status);
  }
  return data as T;
}

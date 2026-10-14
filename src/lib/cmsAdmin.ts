import { callFunction } from "@/lib/backend";

export function clearLegacyAdminLogin() {
  sessionStorage.removeItem("dashboard-auth");
  sessionStorage.removeItem("dashboard-password");
}

export type CmsSession = { token: string; expires_at: string };

export function setCmsSession(session: CmsSession | null) {
  clearLegacyAdminLogin();
  if (session) {
    sessionStorage.setItem("cms-session", session.token);
    sessionStorage.setItem("cms-session-expires-at", session.expires_at);
  } else {
    sessionStorage.removeItem("cms-session");
    sessionStorage.removeItem("cms-session-expires-at");
  }
  window.dispatchEvent(new Event("cms-session-changed"));
}

export function cmsAdminLogin(password: string): Promise<CmsSession> {
  return callFunction<CmsSession>("cms-admin", { action: "login", payload: { password } });
}

function sessionToken(): string {
  const token = sessionStorage.getItem("cms-session");
  if (!token) throw new Error("Din inloggning har gått ut. Logga in igen.");
  return token;
}

/** Protected admin actions. Only the opaque session token is sent, never the password. */
export async function cmsAdminCall<T = unknown>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const token = sessionToken();
  return callFunction<T>("cms-admin", { action, payload }, { "x-cms-session": token });
}

/** Run a server job (fetching reviews or treatments) as the signed-in administrator. */
export async function cmsRunJob<T = unknown>(functionName: "scrape-reviews" | "sync-treatments"): Promise<T> {
  const token = sessionToken();
  return callFunction<T>(functionName, {}, { "x-cms-session": token });
}

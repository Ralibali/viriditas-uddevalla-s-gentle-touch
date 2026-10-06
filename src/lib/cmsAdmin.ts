import { supabase } from "@/integrations/supabase/client";

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
  return invokeAdmin<CmsSession>("login", { password });
}

export async function cmsAdminCall<T = unknown>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const token = sessionStorage.getItem("cms-session");
  if (!token) throw new Error("Din inloggning har gått ut. Logga in igen.");
  return invokeAdmin<T>(action, payload, token);
}

async function invokeAdmin<T>(action: string, payload: Record<string, unknown>, token?: string): Promise<T> {
  const { data, error } = await supabase.functions.invoke("cms-admin", {
    headers: token ? { "x-cms-session": token } : undefined,
    body: { action, payload },
  });

  if (error) {
    // The function's response explains denied access and validation failures.
    const response = (error as { context?: Response }).context;
    let message: string | undefined;
    if (response instanceof Response) {
      const body = await response.clone().json().catch(() => null) as { error?: string } | null;
      message = body?.error;
    }
    throw new Error(message || "Kunde inte nå administrationen. Försök igen om en stund.");
  }
  if (data?.error) throw new Error(String(data.error));
  return data as T;
}

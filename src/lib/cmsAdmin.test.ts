import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearLegacyAdminLogin, cmsAdminCall, cmsAdminLogin, setCmsSession } from "./cmsAdmin";

const sdk = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: sdk.invoke } } }));

beforeEach(() => { vi.resetAllMocks(); sessionStorage.clear(); });

describe("admin session authentication", () => {
  it("rejects a legacy password without a server-issued session before sending a request", async () => {
    sessionStorage.setItem("dashboard-auth", "true");
    sessionStorage.setItem("dashboard-password", "old-shared-password");
    await expect(cmsAdminCall("list_pages")).rejects.toThrow("Logga in igen");
    expect(sdk.invoke).not.toHaveBeenCalled();
    clearLegacyAdminLogin();
    expect(sessionStorage.getItem("dashboard-password")).toBeNull();
    expect(sessionStorage.getItem("dashboard-auth")).toBeNull();
  });

  it("sends only the opaque session header on protected requests", async () => {
    sessionStorage.setItem("dashboard-password", "old-shared-password");
    setCmsSession({ token: "test-opaque-token", expires_at: "2026-10-06T16:00:00Z" });
    sdk.invoke.mockResolvedValue({ data: { expires_at: "2026-10-06T16:00:00Z" }, error: null });
    await cmsAdminCall("check_access");
    expect(sdk.invoke).toHaveBeenCalledWith("cms-admin", {
      headers: { "x-cms-session": "test-opaque-token" }, body: { action: "check_access", payload: {} },
    });
    expect(sessionStorage.getItem("dashboard-password")).toBeNull();
  });

  it("uses the password only for the login request and stores only the returned session", async () => {
    const result = { token: "test-login-token", expires_at: "2026-10-06T16:00:00Z" };
    sdk.invoke.mockResolvedValue({ data: result, error: null });
    setCmsSession(await cmsAdminLogin("login-password"));
    expect(sdk.invoke).toHaveBeenCalledWith("cms-admin", { headers: undefined, body: { action: "login", payload: { password: "login-password" } } });
    expect(sessionStorage.getItem("cms-session")).toBe(result.token);
    expect(Object.values(sessionStorage)).not.toContain("login-password");
  });

  it("preserves server session errors instead of silently falling back", async () => {
    setCmsSession({ token: "invalid-token", expires_at: "2026-10-06T16:00:00Z" });
    sdk.invoke.mockResolvedValue({ data: null, error: { context: new Response(JSON.stringify({ error: "Sessionen har gått ut. Logga in igen." }), { status: 401 }) } });
    await expect(cmsAdminCall("list_pages")).rejects.toThrow("Sessionen har gått ut");
  });
});

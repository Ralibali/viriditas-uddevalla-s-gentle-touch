import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearLegacyAdminLogin, cmsAdminCall, cmsAdminLogin, cmsRunJob, setCmsSession } from "./cmsAdmin";

const backend = vi.hoisted(() => ({ callFunction: vi.fn() }));
vi.mock("@/lib/backend", () => ({ callFunction: backend.callFunction }));

beforeEach(() => { vi.resetAllMocks(); sessionStorage.clear(); });

describe("admin session authentication", () => {
  it("rejects a legacy password without a server-issued session before sending a request", async () => {
    sessionStorage.setItem("dashboard-auth", "true");
    sessionStorage.setItem("dashboard-password", "old-shared-password");
    await expect(cmsAdminCall("list_pages")).rejects.toThrow("Logga in igen");
    expect(backend.callFunction).not.toHaveBeenCalled();
    clearLegacyAdminLogin();
    expect(sessionStorage.getItem("dashboard-password")).toBeNull();
    expect(sessionStorage.getItem("dashboard-auth")).toBeNull();
  });

  it("sends only the opaque session header on protected requests", async () => {
    sessionStorage.setItem("dashboard-password", "old-shared-password");
    setCmsSession({ token: "test-opaque-token", expires_at: "2026-10-06T16:00:00Z" });
    backend.callFunction.mockResolvedValue({ expires_at: "2026-10-06T16:00:00Z" });
    await cmsAdminCall("check_access");
    expect(backend.callFunction).toHaveBeenCalledWith("cms-admin", { action: "check_access", payload: {} }, { "x-cms-session": "test-opaque-token" });
    expect(sessionStorage.getItem("dashboard-password")).toBeNull();
  });

  it("uses the password only for the login request and stores only the returned session", async () => {
    const result = { token: "test-login-token", expires_at: "2026-10-06T16:00:00Z" };
    backend.callFunction.mockResolvedValue(result);
    setCmsSession(await cmsAdminLogin("login-password"));
    expect(backend.callFunction).toHaveBeenCalledWith("cms-admin", { action: "login", payload: { password: "login-password" } });
    expect(sessionStorage.getItem("cms-session")).toBe(result.token);
    expect(Object.values(sessionStorage)).not.toContain("login-password");
  });

  it("preserves server session errors instead of silently falling back", async () => {
    setCmsSession({ token: "invalid-token", expires_at: "2026-10-06T16:00:00Z" });
    backend.callFunction.mockRejectedValue(new Error("Sessionen har gått ut. Logga in igen."));
    await expect(cmsAdminCall("list_pages")).rejects.toThrow("Sessionen har gått ut");
  });

  it("runs server jobs with the session token and refuses without one", async () => {
    await expect(cmsRunJob("scrape-reviews")).rejects.toThrow("Logga in igen");
    setCmsSession({ token: "job-token", expires_at: "2026-10-06T16:00:00Z" });
    backend.callFunction.mockResolvedValue({ success: true, count: 3 });
    await cmsRunJob("scrape-reviews");
    expect(backend.callFunction).toHaveBeenCalledWith("scrape-reviews", {}, { "x-cms-session": "job-token" });
  });
});

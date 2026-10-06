import { act, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";

const mock = vi.hoisted(() => ({ call: vi.fn(), login: vi.fn() }));
vi.mock("@/lib/cmsAdmin", () => ({
  cmsAdminCall: mock.call, cmsAdminLogin: mock.login,
  clearLegacyAdminLogin: () => { sessionStorage.removeItem("dashboard-auth"); sessionStorage.removeItem("dashboard-password"); },
  setCmsSession: (session: { token: string; expires_at: string } | null) => {
    if (session) sessionStorage.setItem("cms-session", session.token);
    else sessionStorage.removeItem("cms-session");
    window.dispatchEvent(new Event("cms-session-changed"));
  },
}));
vi.mock("@/components/SeoHead", () => ({ default: () => null }));
vi.mock("@/components/cms/ContentEditor", () => ({ default: ({ onDirtyChange }: { onDirtyChange: (dirty: boolean) => void }) => <button onClick={() => onDirtyChange(true)}>Ändra testinnehåll</button> }));
vi.mock("@/components/cms/PageList", () => ({ default: () => <p>Skyddade sidor</p> }));
vi.mock("@/components/cms/PageEditor", () => ({ default: () => <p>Sidredigering</p> }));
vi.mock("@/components/cms/SettingsEditor", () => ({ default: () => <p>Skyddade inställningar</p> }));
vi.mock("@/components/cms/CmsAccessEditor", () => ({ default: () => <p>Skyddad åtkomst</p> }));

const session = { token: "test-opaque-token", expires_at: "2026-10-06T16:00:00Z" };
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(<QueryClientProvider client={client}><MemoryRouter initialEntries={["/admin"]}><Dashboard /></MemoryRouter></QueryClientProvider>);
  return client;
}

beforeEach(() => {
  vi.resetAllMocks();
  sessionStorage.clear();
  window.history.replaceState(null, "", "/admin");
});

describe("admin session gate", () => {
  it("does not request protected data for an anonymous visitor, even with a forged legacy login", async () => {
    sessionStorage.setItem("dashboard-auth", "true");
    sessionStorage.setItem("dashboard-password", "old-shared-password");
    mount();
    expect(await screen.findByRole("heading", { name: "Logga in till admin" })).toBeVisible();
    expect(screen.queryByLabelText("E-postadress")).not.toBeInTheDocument();
    expect(mock.call).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("dashboard-password")).toBeNull();
  });

  it("keeps editors and statistics hidden when the server rejects a forged session", async () => {
    sessionStorage.setItem("cms-session", "forged-token");
    mock.call.mockRejectedValue(new Error("Sessionen är ogiltig"));
    mount();
    expect(await screen.findByRole("heading", { name: "Åtkomst kunde inte bekräftas" })).toBeVisible();
    expect(screen.queryByText("Ändra testinnehåll")).not.toBeInTheDocument();
    expect(mock.call.mock.calls.map(([action]) => action)).toEqual(["check_access"]);
  });

  it("mounts editing only after server approval and revokes the session then clears cached admin data on logout", async () => {
    let approve: ((value: { expires_at: string }) => void) | undefined;
    sessionStorage.setItem("cms-session", session.token);
    mock.call.mockImplementation((action: string) => action === "check_access" ? new Promise(resolve => { approve = resolve; }) : Promise.resolve({ success: true }));
    const client = mount();
    await screen.findByText("Kontrollerar administratörsåtkomst…");
    expect(screen.queryByText("Ändra testinnehåll")).not.toBeInTheDocument();
    await act(async () => approve?.({ expires_at: session.expires_at }));
    expect(await screen.findByText("Ändra testinnehåll")).toBeVisible();
    client.setQueryData(["cms-admin-pages"], [{ title: "Hemligt utkast" }]);
    fireEvent.click(screen.getByRole("button", { name: "Logga ut" }));
    await screen.findByRole("heading", { name: "Logga in till admin" });
    expect(client.getQueryData(["cms-admin-pages"])).toBeUndefined();
    expect(mock.call).toHaveBeenCalledWith("logout");
    expect(sessionStorage.getItem("cms-session")).toBeNull();
  });

  it("signs in using only a password and validates the returned token on the server", async () => {
    mock.login.mockResolvedValue(session);
    mock.call.mockResolvedValue({ expires_at: session.expires_at });
    mount();
    fireEvent.change(screen.getByLabelText("Lösenord"), { target: { value: "test-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Logga in" }));
    expect(await screen.findByText("Ändra testinnehåll")).toBeVisible();
    expect(mock.login).toHaveBeenCalledWith("test-password");
    expect(mock.call).toHaveBeenCalledWith("check_access");
  });

  it("shows a statistics error instead of presenting failed requests as zero clicks", async () => {
    sessionStorage.setItem("cms-session", session.token);
    mock.call.mockImplementation((action: string) => action === "check_access" ? Promise.resolve({ expires_at: session.expires_at }) : Promise.reject(new Error("Testfel")));
    mount();
    fireEvent.click(await screen.findByRole("tab", { name: "Statistik" }));
    expect(await screen.findByRole("alert", {}, { timeout: 5000 })).toHaveTextContent("Statistiken kunde inte hämtas: Testfel");
    expect(screen.queryByText("Inga bokningsklick har registrerats ännu.")).not.toBeInTheDocument();
  });

  it("keeps an unsaved draft when declining to leave the tab", async () => {
    sessionStorage.setItem("cms-session", session.token);
    mock.call.mockResolvedValue({ expires_at: session.expires_at });
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    mount();
    fireEvent.click(await screen.findByText("Ändra testinnehåll"));
    fireEvent.click(screen.getByRole("tab", { name: "Inställningar" }));
    expect(screen.getByText("Ändra testinnehåll")).toBeVisible();
    expect(screen.queryByText("Skyddade inställningar")).not.toBeInTheDocument();
    expect(confirm).toHaveBeenCalledOnce();
    confirm.mockRestore();
  });
});

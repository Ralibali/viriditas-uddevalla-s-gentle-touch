import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CmsAccessEditor from "./CmsAccessEditor";

const mock = vi.hoisted(() => ({ call: vi.fn(), setSession: vi.fn() }));
vi.mock("@/lib/cmsAdmin", () => ({ cmsAdminCall: mock.call, setCmsSession: mock.setSession }));

function mount() {
  const client = new QueryClient();
  client.setQueryData(["cms-admin-pages"], [{ title: "Cached draft" }]);
  render(<QueryClientProvider client={client}><CmsAccessEditor /></QueryClientProvider>);
  return client;
}

function enterPasswords(confirmation = "new-test-password", password = "new-test-password") {
  fireEvent.change(screen.getByLabelText("Nuvarande lösenord"), { target: { value: "old-test-password" } });
  fireEvent.change(screen.getByLabelText("Nytt lösenord (minst 8 tecken)"), { target: { value: password } });
  fireEvent.change(screen.getByLabelText("Bekräfta det nya lösenordet"), { target: { value: confirmation } });
  fireEvent.click(screen.getByRole("button", { name: "Spara nytt lösenord" }));
}

beforeEach(() => vi.resetAllMocks());

describe("admin password change", () => {
  it("does not send a password change until the confirmation matches", async () => {
    mount();
    enterPasswords("different-test-password");
    expect(await screen.findByRole("alert")).toHaveTextContent("Lösenorden behöver vara likadana.");
    expect(mock.call).not.toHaveBeenCalled();
  });

  it("uses the server's rotated session and clears old cached data after a password change", async () => {
    const nextSession = { token: "rotated-test-token", expires_at: "2026-10-07T01:00:00Z" };
    mock.call.mockResolvedValue(nextSession);
    const client = mount();
    enterPasswords();
    await waitFor(() => expect(mock.setSession).toHaveBeenCalledWith(nextSession));
    expect(mock.call).toHaveBeenCalledWith("change_password", { current_password: "old-test-password", new_password: "new-test-password" });
    expect(client.getQueryData(["cms-admin-pages"])).toBeUndefined();
    expect(screen.getByLabelText("Nuvarande lösenord")).toHaveValue("");
    expect(screen.getByLabelText("Nytt lösenord (minst 8 tecken)")).toHaveValue("");
  });

  it("rejects an oversized Unicode password before sending it to be hashed", async () => {
    mount();
    const password = "å".repeat(40);
    enterPasswords(password, password);
    expect(await screen.findByRole("alert")).toHaveTextContent("Det nya lösenordet är för långt.");
    expect(mock.call).not.toHaveBeenCalled();
    expect(mock.setSession).not.toHaveBeenCalled();
  });
});

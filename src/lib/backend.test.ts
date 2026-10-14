import { afterEach, describe, expect, it, vi } from "vitest";
import { BackendError, callFunction, insertRow, selectRows } from "./backend";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

afterEach(() => vi.unstubAllGlobals());

describe("backend client", () => {
  it("reads public rows with PostgREST filters and the publishable key", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json([{ slug: "om-massage" }]));
    vi.stubGlobal("fetch", fetchMock);
    const rows = await selectRows<{ slug: string }>("site_pages", { select: "slug", is_published: "eq.true" });
    expect(rows).toEqual([{ slug: "om-massage" }]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/rest\/v1\/site_pages\?select=slug&is_published=eq.true$/);
    expect(init.headers.apikey).toBe("eyJ-test-publishable-key");
    expect(init.headers.Authorization).toBe("Bearer eyJ-test-publishable-key");
  });

  it("inserts without asking for the row back", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    await insertRow("booking_clicks", { source: "hero" });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.headers.Prefer).toBe("return=minimal");
    expect(JSON.parse(init.body)).toEqual({ source: "hero" });
  });

  it("surfaces an edge function's own error message and status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ error: "Fel lösenord." }, 401)));
    const error = (await callFunction("cms-admin", { action: "login" }).catch((reason) => reason)) as BackendError;
    expect(error).toBeInstanceOf(BackendError);
    expect(error.message).toBe("Fel lösenord.");
    expect(error.status).toBe(401);
  });

  it("explains a network failure in plain language", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(callFunction("contact-form", {})).rejects.toThrow("Kunde inte nå servern");
  });
});

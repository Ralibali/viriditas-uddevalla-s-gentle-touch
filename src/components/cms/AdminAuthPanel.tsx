import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { cmsAdminLogin, setCmsSession } from "@/lib/cmsAdmin";
import { BrailleMark } from "@/components/site/BrailleMark";

export default function AdminAuthPanel() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const session = await cmsAdminLogin(password);
      setPassword("");
      setCmsSession(session);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Kunde inte logga in. Försök igen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <BrailleMark />
          <span className="font-display text-2xl text-ink soft-type">Viriditas</span>
        </div>
        <div className="space-y-5 rounded-media border border-line bg-paper-raised p-6 sm:p-8">
          <h1 className="type-h3">Logga in till admin</h1>
          <p className="text-ink/80">Ange webbplatsens administratörslösenord för att redigera innehållet och läsa meddelanden.</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="field-label">
                Lösenord
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                className="field-input"
                disabled={busy}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "admin-password-error" : undefined}
              />
            </div>
            {error && (
              <p id="admin-password-error" role="alert" className="font-semibold text-destructive">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full disabled:opacity-60">
              {busy ? "Loggar in…" : "Logga in"}
            </button>
          </form>
          <p className="type-small text-moss">Du kan byta lösenordet under Åtkomst & hjälp när du är inloggad.</p>
        </div>
        <Link to="/" className="link-quiet mt-6 inline-block text-moss">
          Till webbplatsen
        </Link>
      </div>
    </main>
  );
}

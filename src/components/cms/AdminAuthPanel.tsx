import { useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { cmsAdminLogin, setCmsSession } from "@/lib/cmsAdmin";

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
    } finally { setBusy(false); }
  }

  return <div className="min-h-screen bg-background flex items-center justify-center px-5 py-10">
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-lg max-w-md w-full space-y-5">
      <Lock className="w-9 h-9 text-primary" aria-hidden="true" />
      <h1 className="text-2xl font-display font-semibold text-foreground">Logga in till admin</h1>
      <p className="text-muted-foreground text-sm font-body">Ange webbplatsens administratörslösenord för att redigera innehållet.</p>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="admin-password" className="text-sm font-body text-foreground">Lösenord</label>
          <input id="admin-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={event => { setPassword(event.target.value); setError(""); }} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary" disabled={busy} />
        </div>
        {error && <p role="alert" className="text-destructive text-sm font-body">{error}</p>}
        <button type="submit" disabled={busy} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-body font-medium hover:bg-primary/90 disabled:opacity-50">{busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}Logga in</button>
      </form>
      <p className="text-xs text-muted-foreground font-body">Du kan byta lösenordet under Åtkomst & hjälp när du är inloggad.</p>
      <Link to="/" className="block text-muted-foreground text-sm font-body hover:underline">← Till webbplatsen</Link>
    </div>
  </div>;
}

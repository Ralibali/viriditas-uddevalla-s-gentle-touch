import { useEffect, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cmsAdminCall, setCmsSession, type CmsSession } from "@/lib/cmsAdmin";
import type { SitePage } from "@/types/cms";
import { GLOBAL_CONTENT_FIELDS, SITE_CONTENT_ROUTES, getContentFieldValue } from "@/lib/siteContent";

type ContentExport = { exported_at: string; settings: { setting_key: string; setting_value: string }[]; pages: SitePage[] };

const GUIDE: { title: string; text: string }[] = [
  { title: "Översikt", text: "Det viktigaste just nu: nya meddelanden, klick på boka, betyget och saker som behöver göras." },
  { title: "Meddelanden", text: "Frågor och presentkortsbeställningar från formulären. Svara med e-post och markera dem som hanterade. De raderas automatiskt efter tolv månader." },
  { title: "Innehåll", text: "Texter, bilder och länkar på webbplatsens sidor, sida för sida. Ändrade fält markeras tills du sparar." },
  { title: "Sidor", text: "Skriv artiklar och egna sidor med rubriker, text, bilder och frågor och svar. Spara som utkast, förhandsgranska och publicera när du är nöjd." },
  { title: "Omdömen", text: "Omdömena hämtas från Bokadirekt. Du väljer vilka som visas på webbplatsen och vilka som visas först." },
  { title: "Priser", text: "Jämför priserna på webbplatsen med Bokadirekt och uppdatera dem med ett klick." },
  { title: "Statistik", text: "Var på webbplatsen besökarna klickar på boka, ringer eller mejlar. Själva bokningarna och betalningarna finns i Bokadirekt." },
  { title: "Inställningar", text: "Kontaktuppgifter, adress, bokningslänk och priser som gäller hela webbplatsen." },
];

export default function CmsAccessEditor({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
  const qc = useQueryClient();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    onDirtyChange?.(!!(currentPassword || password || confirmation));
  }, [currentPassword, password, confirmation, onDirtyChange]);

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setPasswordError("");
    if (password !== confirmation) {
      setPasswordError("Lösenorden behöver vara likadana.");
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      setPasswordError("Det nya lösenordet är för långt. Använd högst 72 enkla tecken och färre om du använder å, ä, ö eller emoji.");
      return;
    }
    setSavingPassword(true);
    try {
      const session = await cmsAdminCall<CmsSession>("change_password", { current_password: currentPassword, new_password: password });
      setCurrentPassword("");
      setPassword("");
      setConfirmation("");
      qc.clear();
      setCmsSession(session);
      toast.success("Lösenordet är bytt. Andra inloggningar är utloggade.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kunde inte byta lösenordet.";
      setPasswordError(message);
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  }

  async function downloadBackup() {
    setDownloading(true);
    try {
      const data = await cmsAdminCall<ContentExport>("export_content");
      const settings = Object.fromEntries(data.settings.map((setting) => [setting.setting_key, setting.setting_value ?? ""]));
      const fieldValues = (fields: typeof GLOBAL_CONTENT_FIELDS) =>
        fields.map((field) => ({ setting_key: field.settingKey, label: field.label, kind: field.kind, value: getContentFieldValue(field, settings) }));
      const backup = {
        ...data,
        resolved_content: {
          global: fieldValues(GLOBAL_CONTENT_FIELDS),
          routes: SITE_CONTENT_ROUTES.map((route) => ({ path: route.path, label: route.label, fields: fieldValues(route.fields) })),
        },
      };
      const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `viriditas-innehall-${data.exported_at.slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Säkerhetskopian är nedladdad.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Kunde inte hämta säkerhetskopian.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-8">
        <section aria-labelledby="password-title" className="rounded-2xl border border-line bg-paper-raised p-5 sm:p-6">
          <h2 id="password-title" className="font-display text-xl soft-type">
            Byt lösenord
          </h2>
          <p className="mt-1 text-moss">Lösenordet gäller hela administrationen. När du byter det loggas andra enheter ut, men du fortsätter här.</p>
          <form onSubmit={changePassword} className="mt-5 max-w-md space-y-4">
            <div>
              <label htmlFor="current-password" className="field-label">
                Nuvarande lösenord
              </label>
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                disabled={savingPassword}
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="change-password" className="field-label">
                Nytt lösenord (minst 8 tecken)
              </label>
              <input
                id="change-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={savingPassword}
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="change-password-confirm" className="field-label">
                Bekräfta det nya lösenordet
              </label>
              <input
                id="change-password-confirm"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                disabled={savingPassword}
                className="field-input"
              />
            </div>
            {passwordError && (
              <p role="alert" className="font-semibold text-destructive">
                {passwordError}
              </p>
            )}
            <button type="submit" disabled={savingPassword} className="btn btn-primary disabled:opacity-60">
              {savingPassword ? "Sparar…" : "Spara nytt lösenord"}
            </button>
          </form>
        </section>

        <section aria-labelledby="backup-title" className="rounded-2xl border border-line bg-paper-raised p-5 sm:p-6">
          <h2 id="backup-title" className="font-display text-xl soft-type">
            Säkerhetskopia
          </h2>
          <p className="mt-1 text-moss">
            Ladda ner inställningar, texter och egna sidor som en fil inför större ändringar eller en överlämning. Bilder, lösenord och meddelanden ingår inte. Att läsa tillbaka filen kräver teknisk hjälp.
          </p>
          <button type="button" disabled={downloading} onClick={() => void downloadBackup()} className="btn btn-quiet mt-5 min-h-11 px-5 py-2 disabled:opacity-50">
            {downloading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Download aria-hidden="true" className="h-4 w-4" />}
            Ladda ner säkerhetskopia
          </button>
        </section>
      </div>

      <section aria-labelledby="guide-title">
        <h2 id="guide-title" className="font-display text-xl soft-type">
          Så sköter du webbplatsen
        </h2>
        <dl className="mt-4 divide-y divide-line border-y border-line">
          {GUIDE.map((item) => (
            <div key={item.title} className="py-4">
              <dt className="font-semibold">{item.title}</dt>
              <dd className="mt-1 text-ink/80">{item.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 type-small text-moss">Lediga tider, kundbokningar och betalningar sköts i Bokadirekt. Administrationen nås på /admin.</p>
      </section>
    </div>
  );
}

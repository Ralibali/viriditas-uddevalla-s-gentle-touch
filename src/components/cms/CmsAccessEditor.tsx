import { useEffect, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cmsAdminCall, setCmsSession, type CmsSession } from "@/lib/cmsAdmin";
import type { SitePage } from "@/types/cms";
import { GLOBAL_CONTENT_FIELDS, SITE_CONTENT_ROUTES, getContentFieldValue } from "@/lib/siteContent";

type ContentExport = { exported_at: string; settings: { setting_key: string; setting_value: string }[]; pages: SitePage[] };

export default function CmsAccessEditor({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
  const qc = useQueryClient();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [downloading, setDownloading] = useState(false);
  useEffect(() => { onDirtyChange?.(!!(currentPassword || password || confirmation)); }, [currentPassword, password, confirmation, onDirtyChange]);

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setPasswordError("");
    if (password !== confirmation) { setPasswordError("Lösenorden behöver vara likadana."); return; }
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
      toast.success("Lösenordet är ändrat. Övriga administratörssessioner är utloggade.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kunde inte ändra lösenordet.";
      setPasswordError(message);
      toast.error(message);
    } finally { setSavingPassword(false); }
  }

  async function downloadBackup() {
    setDownloading(true);
    try {
      const data = await cmsAdminCall<ContentExport>("export_content");
      const settings = Object.fromEntries(data.settings.map(setting => [setting.setting_key, setting.setting_value ?? ""]));
      const fieldValues = (fields: typeof GLOBAL_CONTENT_FIELDS) => fields.map(field => ({
        setting_key: field.settingKey, label: field.label, kind: field.kind,
        value: getContentFieldValue(field, settings),
      }));
      const backup = {
        ...data,
        resolved_content: {
          global: fieldValues(GLOBAL_CONTENT_FIELDS),
          routes: SITE_CONTENT_ROUTES.map(route => ({ path: route.path, label: route.label, fields: fieldValues(route.fields) })),
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
      toast.success("Säkerhetskopian har laddats ner.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Kunde inte hämta säkerhetskopian.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6 font-body">
      <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-xl font-display font-semibold">Byt administratörslösenord</h2>
        <p className="text-sm text-muted-foreground">Lösenordet gäller hela webbplatsens administration. När du byter det avslutas andra inloggade sessioner. Din nuvarande session fortsätter med det nya lösenordet.</p>
        <form onSubmit={changePassword} className="space-y-3 max-w-md">
          <div className="space-y-1"><label htmlFor="current-password" className="text-sm font-medium">Nuvarande lösenord</label><input id="current-password" type="password" autoComplete="current-password" required value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} disabled={savingPassword} className="w-full rounded-xl px-3 py-2 border border-border bg-background" /></div>
          <div className="space-y-1"><label htmlFor="change-password" className="text-sm font-medium">Nytt lösenord (minst 8 tecken)</label><input id="change-password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required value={password} onChange={event => setPassword(event.target.value)} disabled={savingPassword} className="w-full rounded-xl px-3 py-2 border border-border bg-background" /></div>
          <div className="space-y-1"><label htmlFor="change-password-confirm" className="text-sm font-medium">Bekräfta det nya lösenordet</label><input id="change-password-confirm" type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={event => setConfirmation(event.target.value)} disabled={savingPassword} className="w-full rounded-xl px-3 py-2 border border-border bg-background" /></div>
          {passwordError && <p role="alert" className="text-sm text-destructive">{passwordError}</p>}
          <button type="submit" disabled={savingPassword} className="rounded-xl px-4 py-2 bg-primary text-primary-foreground text-sm disabled:opacity-50">{savingPassword ? "Sparar…" : "Spara nytt lösenord"}</button>
        </form>
      </section>

      <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-xl font-display font-semibold">Säkerhetskopia av innehållet</h2>
        <p className="text-sm text-muted-foreground">Ladda ner webbplatsens inställningar, aktuella grundtexter och egna sidor som en JSON-fil inför större ändringar eller överlämning. Bildfiler, administratörslösenord och bokningar hos Bokadirekt ingår inte. Återställning av filen kräver teknisk hjälp.</p>
        <button type="button" disabled={downloading} onClick={downloadBackup} className="rounded-xl px-4 py-2 flex items-center gap-2 border border-border text-sm disabled:opacity-50">{downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Ladda ner säkerhetskopia</button>
      </section>

      <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3">
        <h2 className="text-xl font-display font-semibold">Så sköter du webbplatsen</h2>
        <ul className="list-disc pl-5 text-sm space-y-2">
          <li><strong>Innehåll:</strong> Ändra texter och bilder på webbplatsens befintliga sidor. Ladda upp bilder från din dator eller ange en bildadress. Spara och öppna webbplatsen för att se resultatet.</li>
          <li><strong>Inställningar:</strong> Ändra kontaktuppgifter, bokningslänk, priser och återkommande texter.</li>
          <li><strong>Sidor:</strong> Skapa egna sidor med text, bilder och innehållsblock. Du kan spara ett utkast, förhandsgranska och välja om en publicerad sida ska synas i menyn.</li>
          <li><strong>Bokningar:</strong> Lediga tider, kundbokningar och betalningar hanteras i Bokadirekt. Här ändrar du länken dit. Statistiken visar klick på bokning och kontakt. Genomförda bokningar visas i Bokadirekt.</li>
          <li><strong>Överlämning:</strong> Låt kunden logga in via /admin och testa att redigera innehållet. Kunden kan sedan välja sitt eget administratörslösenord här, vilket också avslutar tidigare sessioner.</li>
        </ul>
      </section>
    </div>
  );
}

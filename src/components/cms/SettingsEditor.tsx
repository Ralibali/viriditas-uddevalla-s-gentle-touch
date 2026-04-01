import { useState, useEffect } from "react";
import { Save, Loader2, ChevronDown } from "lucide-react";
import { useSiteSettings, useUpdateSetting } from "@/hooks/useSiteSettings";
import { toast } from "sonner";

interface SettingsGroup {
  label: string;
  fields: { key: string; label: string; placeholder: string; type?: "textarea" }[];
}

const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    label: "Allmänt",
    fields: [
      { key: "business_name", label: "Företagsnamn", placeholder: "Viriditas" },
      { key: "phone", label: "Telefon", placeholder: "076-317 78 97" },
      { key: "email", label: "E-post", placeholder: "info@viriditas.se" },
      { key: "address", label: "Adress", placeholder: "Norra Drottninggatan 2, Uddevalla" },
      { key: "booking_url", label: "Boknings-URL", placeholder: "https://peach.nu/..." },
      { key: "opening_hours", label: "Öppettider", placeholder: "Fredagar & lördagar", type: "textarea" },
      { key: "footer_text", label: "Footer-text", placeholder: "Klassisk massage i Uddevalla...", type: "textarea" },
    ],
  },
  {
    label: "Hero-sektion",
    fields: [
      { key: "hero_title", label: "Rubrik", placeholder: "Massage i Uddevalla" },
      { key: "hero_subtitle", label: "Underrubrik", placeholder: "– Känn skillnaden med Viriditas" },
      { key: "hero_description", label: "Beskrivning", placeholder: "Diplomerad massageterapeut Andreas Håman – Hälsokraft, Norra Drottninggatan 2" },
      { key: "hero_availability", label: "Tillgänglighet", placeholder: "Tider tillgängliga fredagar & lördagar" },
      { key: "hero_price_from", label: "Pris från", placeholder: "Från 550 kr" },
    ],
  },
  {
    label: "Om Andreas",
    fields: [
      { key: "about_title", label: "Rubrik", placeholder: "Om Andreas & Goliat" },
      { key: "about_text_1", label: "Stycke 1", placeholder: "Andreas Håman är diplomerad massageterapeut...", type: "textarea" },
      { key: "about_text_2", label: "Stycke 2", placeholder: "Tidigare har han arbetat inom personlig assistans...", type: "textarea" },
      { key: "about_text_goliat", label: "Text om Goliat", placeholder: "Min bästa vän och ledarhund Goliat...", type: "textarea" },
      { key: "about_quote", label: "Citat", placeholder: "Jag lyssnar med händerna." },
    ],
  },
  {
    label: "CTA-sektioner (gröna)",
    fields: [
      { key: "cta1_title", label: "CTA 1 – Rubrik", placeholder: "Redo att boka din massage?" },
      { key: "cta1_text", label: "CTA 1 – Text", placeholder: "Boka enkelt online – välj tid som passar dig." },
      { key: "cta2_title", label: "CTA 2 – Rubrik (sista)", placeholder: "Ge kroppen den omvårdnad den förtjänar" },
      { key: "cta2_text", label: "CTA 2 – Text (sista)", placeholder: "Klassisk massage från 550 kr. Boka din tid idag." },
    ],
  },
  {
    label: "Viriditas-sektion",
    fields: [
      { key: "viriditas_title", label: "Rubrik", placeholder: "Vad betyder Viriditas?" },
      { key: "viriditas_text_1", label: "Stycke 1", placeholder: "Viriditas är ett ord som betyder vitalitet...", type: "textarea" },
      { key: "viriditas_text_2", label: "Stycke 2", placeholder: "Hildegard hade en helhetssyn...", type: "textarea" },
    ],
  },
  {
    label: "Behandlingar",
    fields: [
      { key: "treatments_title", label: "Rubrik", placeholder: "Klassisk massage – Behandlingar & priser" },
      { key: "treatment_45_title", label: "45 min – Titel", placeholder: "Klassisk massage" },
      { key: "treatment_45_price", label: "45 min – Pris", placeholder: "550 kr" },
      { key: "treatment_45_desc", label: "45 min – Beskrivning", placeholder: "En kortare men effektiv behandling...", type: "textarea" },
      { key: "treatment_60_title", label: "60 min – Titel", placeholder: "Klassisk massage" },
      { key: "treatment_60_price", label: "60 min – Pris", placeholder: "650 kr" },
      { key: "treatment_60_desc", label: "60 min – Beskrivning", placeholder: "En hel timmes avkopplande behandling...", type: "textarea" },
      { key: "gift_title", label: "Presentkort – Titel", placeholder: "Presentkort" },
      { key: "gift_price", label: "Presentkort – Pris", placeholder: "Valfritt belopp" },
      { key: "gift_desc", label: "Presentkort – Beskrivning", placeholder: "Ge bort välmående...", type: "textarea" },
    ],
  },
  {
    label: "Kontakt-sektion",
    fields: [
      { key: "contact_title", label: "Rubrik", placeholder: "Boka massage Uddevalla – Hitta hit" },
      { key: "contact_address_full", label: "Adress (visas)", placeholder: "Hälsokraft, Norra Drottninggatan 2\n451 30 Uddevalla", type: "textarea" },
      { key: "contact_hours_display", label: "Öppettider (visas)", placeholder: "Mån–Fre: 09:00–18:00\nLör: 10:00–15:00", type: "textarea" },
    ],
  },
];

// Flatten for save logic
const ALL_FIELDS = SETTINGS_GROUPS.flatMap(g => g.fields);

export default function SettingsEditor() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSetting();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ "Allmänt": true });

  useEffect(() => {
    if (settings) setValues(settings);
  }, [settings]);

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const field of ALL_FIELDS) {
        if (values[field.key] !== (settings?.[field.key] || "")) {
          await updateSetting.mutateAsync({ key: field.key, value: values[field.key] || "" });
        }
      }
      toast.success("Inställningar sparade!");
    } catch (err: any) {
      toast.error("Kunde inte spara: " + err.message);
    }
    setSaving(false);
  };

  if (isLoading) {
    return <p className="text-muted-foreground font-body text-center py-12">Laddar inställningar...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold text-foreground">Inställningar</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-body font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Spara
        </button>
      </div>

      {SETTINGS_GROUPS.map((group) => (
        <div key={group.label} className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleGroup(group.label)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
          >
            <span className="font-display font-semibold text-foreground text-sm">{group.label}</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openGroups[group.label] ? "rotate-180" : ""}`} />
          </button>
          {openGroups[group.label] && (
            <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-foreground font-body font-medium block mb-1">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={values[field.key] || ""}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground font-body text-sm resize-y min-h-[60px]"
                    />
                  ) : (
                    <input
                      value={values[field.key] || ""}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground font-body text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

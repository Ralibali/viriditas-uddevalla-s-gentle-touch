import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { useSiteSettings, useUpdateSetting } from "@/hooks/useSiteSettings";
import { toast } from "sonner";

const SETTINGS_FIELDS = [
  { key: "business_name", label: "Företagsnamn", placeholder: "Viriditas" },
  { key: "phone", label: "Telefon", placeholder: "076-317 78 97" },
  { key: "email", label: "E-post", placeholder: "info@viriditas.se" },
  { key: "address", label: "Adress", placeholder: "Norra Drottninggatan 2, Uddevalla" },
  { key: "booking_url", label: "Boknings-URL", placeholder: "https://peach.nu/..." },
  { key: "opening_hours", label: "Öppettider", placeholder: "Fredagar & lördagar", type: "textarea" as const },
  { key: "footer_text", label: "Footer-text", placeholder: "Klassisk massage i Uddevalla...", type: "textarea" as const },
];

export default function SettingsEditor() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSetting();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setValues(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const field of SETTINGS_FIELDS) {
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

      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        {SETTINGS_FIELDS.map((field) => (
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
    </div>
  );
}

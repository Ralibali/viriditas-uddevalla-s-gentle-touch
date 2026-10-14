import { useEffect } from "react";
import { useContentDraft } from "@/hooks/useContentDraft";
import { GLOBAL_CONTENT_FIELDS } from "@/lib/siteContentValues";
import ContentField from "./ContentField";
import SaveBar from "./SaveBar";

const GROUPS = [...new Set(GLOBAL_CONTENT_FIELDS.map((field) => field.group))];
const fieldId = (settingKey: string) => `setting-${settingKey}`;

export default function SettingsEditor({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
  const draft = useContentDraft(GLOBAL_CONTENT_FIELDS);
  const dirty = draft.changedKeys.length > 0;

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  async function save() {
    const result = await draft.save("Inställningarna är sparade och syns på webbplatsen.");
    if (!result.ok && result.key) document.getElementById(fieldId(result.key))?.focus();
  }

  if (draft.query.isError && !draft.ready) {
    return (
      <div role="alert" className="rounded-2xl border border-destructive/30 bg-paper-raised p-6">
        <p className="font-semibold text-destructive">Inställningarna kunde inte hämtas: {draft.query.error.message}</p>
        <button type="button" onClick={() => void draft.query.refetch()} className="link mt-3">
          Försök igen
        </button>
      </div>
    );
  }
  if (!draft.ready) return <p role="status" className="py-12 text-moss">Hämtar inställningarna…</p>;

  return (
    <div>
      <p className="max-w-2xl text-moss">
        Kontaktuppgifter, bokningslänk och priser används på hela webbplatsen och i informationen som Google läser. Sidornas texter och bilder finns under Innehåll.
      </p>

      {draft.error && (
        <p role="alert" className="mt-6 rounded-xl border border-destructive/30 bg-paper-raised p-4 font-semibold text-destructive">
          {draft.error.message}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {GROUPS.map((group) => (
          <section key={group} className="rounded-2xl border border-line bg-paper-raised">
            <h2 className="px-5 py-4 font-display text-xl soft-type sm:px-6">{group}</h2>
            <div className="space-y-6 border-t border-line px-5 py-6 sm:px-6">
              {GLOBAL_CONTENT_FIELDS.filter((field) => field.group === group).map((field) => (
                <ContentField
                  key={field.settingKey}
                  field={field}
                  id={fieldId(field.settingKey)}
                  value={draft.values[field.settingKey] ?? field.defaultValue}
                  changed={draft.values[field.settingKey] !== draft.baseline[field.settingKey]}
                  invalid={draft.error?.key === field.settingKey}
                  disabled={draft.saving}
                  onChange={(value) => draft.set(field.settingKey, value)}
                  onRevert={() => draft.revert(field.settingKey)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <SaveBar count={draft.changedKeys.length} saving={draft.saving} onSave={() => void save()} onDiscard={draft.discard} />
    </div>
  );
}

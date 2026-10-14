interface SaveBarProps {
  count: number;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

/** Stays in view at the bottom of long forms while there are unsaved changes. */
export default function SaveBar({ count, saving, onSave, onDiscard }: SaveBarProps) {
  if (count === 0) return null;
  return (
    <div className="sticky bottom-3 z-20 mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-3 text-paper-raised sm:bottom-5">
      <p role="status" className="font-semibold">
        {count} {count === 1 ? "osparad ändring" : "osparade ändringar"}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onDiscard} disabled={saving} className="btn min-h-11 px-4 py-2 text-paper-raised hover:bg-paper-raised/10 disabled:opacity-50">
          Ångra alla
        </button>
        <button type="button" onClick={onSave} disabled={saving} className="btn btn-on-dark min-h-11 px-5 py-2 disabled:opacity-60">
          {saving ? "Sparar…" : "Spara ändringar"}
        </button>
      </div>
    </div>
  );
}

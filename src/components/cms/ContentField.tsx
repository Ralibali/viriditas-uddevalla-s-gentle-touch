import type { SiteContentField } from "@/lib/siteContentValues";
import MediaInput from "./MediaInput";

interface ContentFieldProps {
  field: SiteContentField;
  id: string;
  value: string;
  changed: boolean;
  invalid?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onRevert: () => void;
}

const HINTS: Partial<Record<SiteContentField["kind"], string>> = {
  link: "En https-adress, en sökväg som /om-andreas eller en ankarlänk som #kontakt.",
  video: "En https-adress till filmfilen eller en sökväg på webbplatsen.",
};

function inputMode(field: SiteContentField): "url" | "email" | "tel" | undefined {
  if (field.kind === "link" || field.kind === "video") return "url";
  if (field.settingKey === "email") return "email";
  if (field.settingKey === "phone") return "tel";
  return undefined;
}

/** One editable text, link, image or on/off setting, with a way back to the saved value. */
export default function ContentField({ field, id, value, changed, invalid, disabled, onChange, onRevert }: ContentFieldProps) {
  const marker = changed ? (
    <span className="flex items-center gap-3">
      <span className="rounded-full bg-sprout px-2.5 py-0.5 text-xs font-semibold text-ink">Ändrad</span>
      <button type="button" onClick={onRevert} disabled={disabled} aria-label={`Ångra ändringen i ${field.label}`} className="link-quiet text-sm text-moss hover:text-ink">
        Ångra
      </button>
    </span>
  ) : null;

  if (field.kind === "toggle") {
    return (
      <div className="flex min-h-11 flex-wrap items-center gap-x-4 gap-y-2 py-2">
        <input
          id={id}
          type="checkbox"
          checked={value !== "false"}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked ? "true" : "false")}
          className="h-5 w-5 shrink-0 accent-primary"
        />
        <label htmlFor={id} className="font-semibold">
          {field.label}
        </label>
        {marker && <span className="ml-auto">{marker}</span>}
      </div>
    );
  }

  if (field.kind === "image") {
    return <MediaInput id={id} label={field.label} value={value} onChange={onChange} disabled={disabled} labelAddon={marker} />;
  }

  const hint = HINTS[field.kind];
  const hintId = hint ? `${id}-hint` : undefined;
  const multiline = field.kind === "longtext" || (field.kind === "text" && field.defaultValue.length > 110);
  const shared = {
    id,
    value,
    disabled,
    "aria-invalid": invalid || undefined,
    "aria-describedby": hintId,
    className: multiline && field.kind !== "longtext" ? "field-input !min-h-[6rem]" : "field-input",
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <label htmlFor={id} className="field-label">
          {field.label}
        </label>
        {marker}
      </div>
      {multiline ? (
        <textarea {...shared} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input
          {...shared}
          type="text"
          inputMode={inputMode(field)}
          spellCheck={field.kind === "link" || field.kind === "video" ? false : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, Search } from "lucide-react";
import { useContentDraft } from "@/hooks/useContentDraft";
import { SITE_CONTENT_ROUTES } from "@/lib/siteContent";
import { getContentFieldValue } from "@/lib/siteContentValues";
import ContentField from "./ContentField";
import SaveBar from "./SaveBar";

const ROUTE_FIELDS = SITE_CONTENT_ROUTES.flatMap((route) => route.fields);
const fieldId = (settingKey: string) => `content-${settingKey.replace(/[^a-z0-9_-]/gi, "-")}`;

export default function ContentEditor({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
  const draft = useContentDraft(ROUTE_FIELDS);
  const [routeId, setRouteId] = useState(SITE_CONTENT_ROUTES[0].id);
  const [search, setSearch] = useState("");
  const dirty = draft.changedKeys.length > 0;

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  async function save() {
    const result = await draft.save("Ändringarna är sparade och syns på webbplatsen.");
    if (result.ok || !result.key) return;
    const key = result.key;
    const owner = SITE_CONTENT_ROUTES.find((route) => route.fields.some((field) => field.settingKey === key));
    if (owner) setRouteId(owner.id);
    setSearch("");
    window.setTimeout(() => document.getElementById(fieldId(key))?.focus(), 0);
  }

  if (draft.query.isError && !draft.ready) {
    return (
      <div role="alert" className="rounded-2xl border border-destructive/30 bg-paper-raised p-6">
        <p className="font-semibold text-destructive">Webbplatsens innehåll kunde inte hämtas: {draft.query.error.message}</p>
        <button type="button" onClick={() => void draft.query.refetch()} className="link mt-3">
          Försök igen
        </button>
      </div>
    );
  }
  if (!draft.ready) return <p role="status" className="py-12 text-moss">Hämtar webbplatsens innehåll…</p>;

  const route = SITE_CONTENT_ROUTES.find((candidate) => candidate.id === routeId) ?? SITE_CONTENT_ROUTES[0];
  const needle = search.trim().toLocaleLowerCase("sv");
  const visibleFields = route.fields.filter((field) => !needle || `${field.label} ${draft.values[field.settingKey] ?? ""}`.toLocaleLowerCase("sv").includes(needle));
  const groups = [...new Set(visibleFields.map((field) => field.group))];
  const isChanged = (key: string) => draft.values[key] !== draft.baseline[key];
  const changesOn = (fields: typeof ROUTE_FIELDS) => fields.filter((field) => isChanged(field.settingKey)).length;

  return (
    <div>
      <p className="max-w-2xl text-moss">
        Ändra texter, bilder och länkar sida för sida. Kontaktuppgifter, bokningslänk och priser finns under Inställningar och gäller hela webbplatsen.
      </p>

      <div className="mt-6 grid gap-5 rounded-2xl border border-line bg-paper-raised p-5 sm:p-6 md:grid-cols-2">
        <div>
          <label htmlFor="content-route" className="field-label">
            Sida
          </label>
          <select
            id="content-route"
            value={route.id}
            onChange={(event) => {
              setRouteId(event.target.value);
              setSearch("");
            }}
            className="field-input"
          >
            {SITE_CONTENT_ROUTES.map((option) => {
              const count = changesOn(option.fields);
              return (
                <option key={option.id} value={option.id}>
                  {option.label}
                  {count ? ` (${count} ${count === 1 ? "ändring" : "ändringar"})` : ""}
                </option>
              );
            })}
          </select>
          <a href={route.path} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-flex items-center gap-1.5 type-small">
            Öppna sidan
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only"> (öppnas i ny flik)</span>
          </a>
        </div>
        <div>
          <label htmlFor="content-search" className="field-label">
            Sök på sidan
          </label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-moss" />
            <input
              id="content-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="field-input pl-11"
              placeholder="Till exempel pris eller rubrik"
              aria-describedby="content-search-hint"
            />
          </div>
          <p id="content-search-hint" className="field-hint">
            Söker i fältens namn och text.
          </p>
        </div>
      </div>

      {draft.error && (
        <p role="alert" className="mt-6 rounded-xl border border-destructive/30 bg-paper-raised p-4 font-semibold text-destructive">
          {draft.error.message}
        </p>
      )}
      {!visibleFields.length && <p className="mt-6 rounded-2xl border border-dashed border-line p-8 text-center text-moss">Inga fält på den här sidan matchar ”{search.trim()}”.</p>}

      <div className="mt-6 space-y-4">
        {groups.map((group) => {
          const fields = visibleFields.filter((field) => field.group === group);
          const changed = changesOn(fields);
          return (
            <details key={`${route.id}-${group}`} open className="group rounded-2xl border border-line bg-paper-raised">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-xl text-ink soft-type">{group}</span>
                <span className="flex shrink-0 items-center gap-3">
                  {changed > 0 && (
                    <span className="rounded-full bg-sprout px-2.5 py-0.5 text-xs font-semibold text-ink">
                      {changed} {changed === 1 ? "ändrad" : "ändrade"}
                    </span>
                  )}
                  <ChevronDown aria-hidden="true" className="h-5 w-5 text-moss transition-transform duration-200 group-open:rotate-180" />
                </span>
              </summary>
              <div className={`border-t border-line px-5 sm:px-6 ${fields.every((field) => field.kind === "toggle") ? "divide-y divide-line py-2" : "space-y-6 py-6"}`}>
                {fields.map((field) => (
                  <ContentField
                    key={field.settingKey}
                    field={field}
                    id={fieldId(field.settingKey)}
                    value={draft.values[field.settingKey] ?? getContentFieldValue(field, draft.query.data)}
                    changed={isChanged(field.settingKey)}
                    invalid={draft.error?.key === field.settingKey}
                    disabled={draft.saving}
                    onChange={(value) => draft.set(field.settingKey, value)}
                    onRevert={() => draft.revert(field.settingKey)}
                  />
                ))}
              </div>
            </details>
          );
        })}
      </div>

      <SaveBar count={draft.changedKeys.length} saving={draft.saving} onSave={() => void save()} onDiscard={draft.discard} />
    </div>
  );
}

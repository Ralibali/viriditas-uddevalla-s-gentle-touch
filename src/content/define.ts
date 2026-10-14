import type { ContentFieldKind, SiteContentField, SiteContentRoute } from "@/lib/siteContentValues";

/**
 * One editable field: [key, label in the admin, default text, kind?, setting key?].
 * The setting key defaults to `content.<route>.<key>`; older fields keep the key
 * they were saved under so customer edits keep working.
 */
export type FieldSpec = readonly [key: string, label: string, defaultValue: string, kind?: ContentFieldKind, settingKey?: string];

/** A group of fields as the admin shows them, in the order they appear on the page. */
export interface SectionSpec {
  title: string;
  fields: readonly FieldSpec[];
}

function inferKind(key: string): ContentFieldKind {
  if (key.startsWith("image_")) return "image";
  if (key.startsWith("video_")) return "video";
  if (key.startsWith("link_")) return "link";
  if (key.startsWith("show_")) return "toggle";
  return "text";
}

export function defineRoute(route: { id: string; label: string; path: string; sections: readonly SectionSpec[] }): SiteContentRoute {
  const fields: SiteContentField[] = route.sections.flatMap((section) =>
    section.fields.map(([key, label, defaultValue, kind, settingKey]) => ({
      key,
      label,
      defaultValue,
      kind: kind ?? inferKind(key),
      settingKey: settingKey ?? `content.${route.id}.${key}`,
      group: section.title,
    })),
  );
  return { id: route.id, label: route.label, path: route.path, fields };
}

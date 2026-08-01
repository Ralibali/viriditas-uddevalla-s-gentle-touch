import { useEffect, useMemo, useState } from "react";
import { Save, X, MousePointerClick, Image as ImageIcon, Link as LinkIcon, Type, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cmsAdminCall } from "@/lib/cmsAdmin";

type OverrideValue = { text?: string; href?: string; src?: string; alt?: string };
type Overrides = Record<string, OverrideValue>;

const EDITABLE_SELECTOR = "h1,h2,h3,h4,h5,h6,p,span,a,button,label,li,blockquote,cite,img";
const SETTINGS_KEY = "global_content_overrides";

function getElementKey(el: Element) {
  const parts: string[] = [];
  let current: Element | null = el;
  while (current && current !== document.body) {
    const tag = current.tagName.toLowerCase();
    if (current.id) { parts.unshift(`${tag}#${CSS.escape(current.id)}`); break; }
    const parent = current.parentElement;
    if (!parent) break;
    const siblings = Array.from(parent.children).filter((child) => child.tagName === current!.tagName);
    parts.unshift(`${tag}:nth-of-type(${siblings.indexOf(current) + 1})`);
    current = parent;
  }
  return `${window.location.pathname}::${parts.join(" > ")}`;
}

function findElementByKey(key: string) {
  const [path, selector] = key.split("::");
  if (path !== window.location.pathname || !selector) return null;
  try { return document.querySelector(selector); } catch { return null; }
}

function applyOverride(el: Element, value: OverrideValue) {
  if (el instanceof HTMLImageElement) {
    if (value.src !== undefined) el.src = value.src;
    if (value.alt !== undefined) el.alt = value.alt;
    return;
  }
  if (el instanceof HTMLAnchorElement && value.href !== undefined) el.href = value.href;
  if (value.text !== undefined) el.textContent = value.text;
}

export default function GlobalContentEditor() {
  const { data: settings } = useSiteSettings();
  const [overrides, setOverrides] = useState<Overrides>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const authed = sessionStorage.getItem("dashboard-auth") === "true";
  const editMode = useMemo(() => new URLSearchParams(window.location.search).get("cms-edit") === "1" && authed, [authed]);
  const dashboardMode = window.location.pathname === "/dashboard" && authed;

  useEffect(() => {
    const raw = settings?.[SETTINGS_KEY];
    if (!raw) return setOverrides({});
    try { setOverrides(JSON.parse(raw)); } catch { setOverrides({}); }
  }, [settings]);

  useEffect(() => {
    const applyAll = () => Object.entries(overrides).forEach(([key, value]) => {
      const el = findElementByKey(key);
      if (el) applyOverride(el, value);
    });
    applyAll();
    const observer = new MutationObserver(applyAll);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [overrides]);

  useEffect(() => {
    if (!editMode) return;
    document.body.classList.add("cms-editing");
    const handleClick = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest(EDITABLE_SELECTOR);
      if (!el || el.closest("[data-cms-toolbar]") || el.closest("[data-cms-panel]")) return;
      event.preventDefault(); event.stopPropagation();
      const key = getElementKey(el);
      const current = overrides[key] || {};
      let next: OverrideValue | null = null;
      if (el instanceof HTMLImageElement) {
        const src = window.prompt("Bildens URL", current.src ?? el.currentSrc ?? el.src);
        if (src === null) return;
        const alt = window.prompt("Alternativtext", current.alt ?? el.alt ?? "");
        if (alt === null) return;
        next = { ...current, src, alt };
      } else if (el instanceof HTMLAnchorElement) {
        const text = window.prompt("Länk-/knapptext", current.text ?? el.textContent?.trim() ?? "");
        if (text === null) return;
        const href = window.prompt("Länkadress", current.href ?? el.getAttribute("href") ?? "");
        if (href === null) return;
        next = { ...current, text, href };
      } else {
        const text = window.prompt("Text", current.text ?? el.textContent?.trim() ?? "");
        if (text === null) return;
        next = { ...current, text };
      }
      setOverrides((prev) => ({ ...prev, [key]: next! }));
      setDirty(true);
      toast.success("Ändringen är klar att sparas");
    };
    document.addEventListener("click", handleClick, true);
    return () => { document.removeEventListener("click", handleClick, true); document.body.classList.remove("cms-editing"); };
  }, [editMode, overrides]);

  const save = async () => {
    setSaving(true);
    try {
      await cmsAdminCall("update_setting", { key: SETTINGS_KEY, value: JSON.stringify(overrides) });
      setDirty(false);
      toast.success("Hela sidans ändringar är publicerade");
    } catch (error: any) {
      toast.error(`Kunde inte spara: ${error?.message || "Okänt fel"}`);
    } finally { setSaving(false); }
  };

  if (dashboardMode && !editMode) {
    return (
      <a data-cms-toolbar href="/?cms-edit=1" className="fixed bottom-6 right-6 z-[10000] inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-body font-semibold text-primary-foreground shadow-2xl hover:bg-primary/90">
        <Pencil className="h-4 w-4" /> Redigera hela webbplatsen
      </a>
    );
  }

  if (!editMode) return null;

  const close = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("cms-edit");
    window.location.href = url.pathname + url.search + url.hash;
  };

  return (
    <>
      <style>{`
        .cms-editing h1,.cms-editing h2,.cms-editing h3,.cms-editing h4,.cms-editing h5,.cms-editing h6,.cms-editing p,.cms-editing span,.cms-editing a,.cms-editing button,.cms-editing label,.cms-editing li,.cms-editing blockquote,.cms-editing cite,.cms-editing img{cursor:pointer!important}
        .cms-editing h1:hover,.cms-editing h2:hover,.cms-editing h3:hover,.cms-editing h4:hover,.cms-editing h5:hover,.cms-editing h6:hover,.cms-editing p:hover,.cms-editing span:hover,.cms-editing a:hover,.cms-editing button:hover,.cms-editing label:hover,.cms-editing li:hover,.cms-editing blockquote:hover,.cms-editing cite:hover,.cms-editing img:hover{outline:3px solid hsl(var(--primary));outline-offset:3px}
      `}</style>
      <div data-cms-toolbar className="fixed inset-x-0 top-0 z-[10000] flex flex-wrap items-center justify-between gap-3 bg-foreground px-4 py-3 text-background shadow-2xl">
        <div className="flex items-center gap-3"><MousePointerClick className="h-5 w-5" /><div><p className="font-body text-sm font-semibold">Visuell redigering aktiv</p><p className="font-body text-xs opacity-70">Klicka på text, knappar, länkar eller bilder.</p></div></div>
        <div className="flex items-center gap-2 text-xs opacity-80"><Type className="h-4 w-4" /> Text <LinkIcon className="ml-2 h-4 w-4" /> Länkar <ImageIcon className="ml-2 h-4 w-4" /> Bilder</div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={save} disabled={!dirty || saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-body text-sm font-semibold text-primary-foreground disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Sparar..." : dirty ? "Spara och publicera" : "Sparat"}</button>
          <button type="button" onClick={close} className="inline-flex items-center gap-2 rounded-full border border-background/30 px-4 py-2 font-body text-sm"><X className="h-4 w-4" /> Avsluta</button>
        </div>
      </div>
      <div aria-hidden className="h-20" data-cms-panel />
    </>
  );
}

import { useState, useEffect, useId } from "react";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import type { SitePage, ContentBlock } from "@/types/cms";
import BlockEditor from "./BlockEditor";
import { PageBlocks } from "./BlockRenderer";
import { useUpsertPage } from "@/hooks/useSitePages";
import { toast } from "sonner";
import { headingLevel, pageSlug, safeContentUrl, validPageSlug } from "@/lib/cmsContentSafety";

interface PageEditorProps {
  page: Partial<SitePage> | null; // null = new page
  onBack: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}

export default function PageEditor({ page, onBack, onDirtyChange }: PageEditorProps) {
  const fieldId = useId();
  const [slugEdited, setSlugEdited] = useState(Boolean(page?.id || page?.slug));
  const [title, setTitle] = useState(page?.title || "");
  const [slug, setSlug] = useState(page?.slug || "");
  const [metaDesc, setMetaDesc] = useState(page?.meta_description || "");
  const [blocks, setBlocks] = useState<ContentBlock[]>(page?.content || []);
  const [isPublished, setIsPublished] = useState(page?.is_published ?? false);
  const [showInNav, setShowInNav] = useState(page?.show_in_nav ?? true);
  const [navLabel, setNavLabel] = useState(page?.nav_label || "");
  const [navOrder, setNavOrder] = useState(page?.nav_order ?? 0);
  const [showPreview, setShowPreview] = useState(false);

  const upsert = useUpsertPage();

  const dirty = JSON.stringify({ title, slug, metaDesc, blocks, isPublished, showInNav, navLabel, navOrder }) !== JSON.stringify({
    title: page?.title || "", slug: page?.slug || "", metaDesc: page?.meta_description || "",
    blocks: page?.content || [], isPublished: page?.is_published ?? false,
    showInNav: page?.show_in_nav ?? true, navLabel: page?.nav_label || "", navOrder: page?.nav_order ?? 0,
  });

  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const handleBack = () => {
    if (dirty && !window.confirm("Du har osparade ändringar. Vill du lämna sidan?")) return;
    onBack();
  };

  const handleSave = () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Titel och slug krävs");
      return;
    }
    if (!validPageSlug(slug.trim())) {
      toast.error("URL:en får innehålla små bokstäver, siffror och enkla bindestreck, högst 100 tecken.");
      return;
    }
    const unsafeLink = blocks.some(({ type, data }) => {
      const value = type === "cta_button" ? data.url : type === "image" || type === "video" ? data.src : "";
      return value && !safeContentUrl(value, type === "image" || type === "video");
    });
    if (unsafeLink) {
      toast.error("Kontrollera länkarna: använd https://, en lokal sökväg eller en e-post-/telefonlänk för knappar.");
      return;
    }
    if (isPublished && blocks.filter((block) => block.type === "heading" && headingLevel(block.data.level) === 1).length > 1) {
      toast.error("Använd en huvudrubrik (H1) per sida. Övriga rubriker ska vara H2 eller H3.");
      return;
    }
    upsert.mutate(
      {
        ...(page?.id ? { id: page.id } : {}),
        title: title.trim(),
        slug: slug.trim(),
        meta_description: metaDesc || null,
        content: blocks,
        is_published: isPublished,
        show_in_nav: showInNav,
        nav_label: navLabel || null,
        nav_order: navOrder,
      },
      {
        onSuccess: () => {
          toast.success("Sidan sparad!");
          onDirtyChange?.(false);
          onBack();
        },
        onError: (err) => {
          toast.error("Kunde inte spara: " + err.message);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm">
          <ArrowLeft className="w-4 h-4" /> Tillbaka
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            aria-pressed={showPreview}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-body hover:bg-muted transition-colors"
          >
            <Eye className="w-4 h-4" /> {showPreview ? "Redigera" : "Förhandsgranska"}
          </button>
          <button
            onClick={handleSave}
            disabled={upsert.isPending}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-body font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {upsert.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Spara
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="bg-background border border-border rounded-2xl p-8">
          <div className="max-w-3xl mx-auto">
            {!blocks.some((block) => block.type === "heading" && headingLevel(block.data.level) === 1) && (
              <h1 className="text-4xl font-display font-semibold mb-8">{title || "Sidtitel"}</h1>
            )}
            <PageBlocks blocks={blocks} />
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Content editor */}
          <div className="lg:col-span-2">
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </div>

          {/* Sidebar settings */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-display font-semibold text-foreground text-sm">Sidinställningar</h3>
              
              <div>
                <label htmlFor={`${fieldId}-title`} className="text-xs text-muted-foreground font-body block mb-1">Titel</label>
                <input
                  id={`${fieldId}-title`}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slugEdited) setSlug(pageSlug(e.target.value));
                  }}
                  maxLength={200}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body"
                  placeholder="Sidtitel"
                />
              </div>

              <div>
                <label htmlFor={`${fieldId}-slug`} className="text-xs text-muted-foreground font-body block mb-1">Slug (URL)</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">/p/</span>
                  <input
                    id={`${fieldId}-slug`}
                    value={slug}
                    onChange={(e) => { setSlugEdited(true); setSlug(e.target.value.toLowerCase()); }}
                    maxLength={100}
                    aria-describedby={`${fieldId}-slug-help`}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body"
                    placeholder="sidans-url"
                  />
                </div>
                <p id={`${fieldId}-slug-help`} className="text-xs text-muted-foreground mt-1">Små bokstäver, siffror och bindestreck. Sidans adress blir /p/{slug || "sidans-url"}.</p>
              </div>

              <div>
                <label htmlFor={`${fieldId}-meta`} className="text-xs text-muted-foreground font-body block mb-1">Meta-beskrivning (SEO)</label>
                <textarea
                  id={`${fieldId}-meta`}
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body resize-y min-h-[60px]"
                  placeholder="Kort beskrivning för sökmotorer..."
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">{metaDesc.length}/160</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-display font-semibold text-foreground text-sm">Publicering & Navigation</h3>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${fieldId}-published`}
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor={`${fieldId}-published`} className="text-sm text-foreground font-body">Publicerad</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${fieldId}-navigation`}
                  checked={showInNav}
                  onChange={(e) => setShowInNav(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor={`${fieldId}-navigation`} className="text-sm text-foreground font-body">Visa i navigationen</label>
              </div>

              {showInNav && (
                <>
                  <div>
                    <label htmlFor={`${fieldId}-nav-label`} className="text-xs text-muted-foreground font-body block mb-1">Menytext (lämna tom för titel)</label>
                    <input
                      id={`${fieldId}-nav-label`}
                      value={navLabel}
                      onChange={(e) => setNavLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body"
                      placeholder={title || "Menytext"}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${fieldId}-nav-order`} className="text-xs text-muted-foreground font-body block mb-1">Ordning i menyn</label>
                    <input
                      type="number"
                      id={`${fieldId}-nav-order`}
                      value={navOrder}
                      onChange={(e) => setNavOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

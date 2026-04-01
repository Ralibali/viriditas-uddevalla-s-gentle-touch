import { useState, useEffect } from "react";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import type { SitePage, ContentBlock } from "@/types/cms";
import BlockEditor from "./BlockEditor";
import { PageBlocks } from "./BlockRenderer";
import { useUpsertPage } from "@/hooks/useSitePages";
import { toast } from "sonner";

interface PageEditorProps {
  page: Partial<SitePage> | null; // null = new page
  onBack: () => void;
}

export default function PageEditor({ page, onBack }: PageEditorProps) {
  const [title, setTitle] = useState(page?.title || "");
  const [slug, setSlug] = useState(page?.slug || "");
  const [metaDesc, setMetaDesc] = useState(page?.meta_description || "");
  const [blocks, setBlocks] = useState<ContentBlock[]>(page?.content || []);
  const [isPublished, setIsPublished] = useState(page?.is_published ?? true);
  const [showInNav, setShowInNav] = useState(page?.show_in_nav ?? true);
  const [navLabel, setNavLabel] = useState(page?.nav_label || "");
  const [navOrder, setNavOrder] = useState(page?.nav_order ?? 0);
  const [showPreview, setShowPreview] = useState(false);

  const upsert = useUpsertPage();

  const autoSlug = (t: string) => t.toLowerCase().replace(/[åä]/g, "a").replace(/ö/g, "o").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  useEffect(() => {
    if (!page?.id && title && !slug) {
      setSlug(autoSlug(title));
    }
  }, [title]);

  const handleSave = () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Titel och slug krävs");
      return;
    }
    upsert.mutate(
      {
        ...(page?.id ? { id: page.id } : {}),
        title,
        slug,
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
          onBack();
        },
        onError: (err: any) => {
          toast.error("Kunde inte spara: " + err.message);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm">
          <ArrowLeft className="w-4 h-4" /> Tillbaka
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
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
                <label className="text-xs text-muted-foreground font-body block mb-1">Titel</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body"
                  placeholder="Sidtitel"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-body block mb-1">Slug (URL)</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">/</span>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.replace(/[^a-z0-9-]/g, ""))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body"
                    placeholder="sidans-url"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-body block mb-1">Meta-beskrivning (SEO)</label>
                <textarea
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
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded"
                />
                <label className="text-sm text-foreground font-body">Publicerad</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showInNav}
                  onChange={(e) => setShowInNav(e.target.checked)}
                  className="rounded"
                />
                <label className="text-sm text-foreground font-body">Visa i navigationen</label>
              </div>

              {showInNav && (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground font-body block mb-1">Menytext (lämna tom för titel)</label>
                    <input
                      value={navLabel}
                      onChange={(e) => setNavLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body"
                      placeholder={title || "Menytext"}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body block mb-1">Ordning i menyn</label>
                    <input
                      type="number"
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

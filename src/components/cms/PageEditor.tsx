import { useEffect, useId, useState } from "react";
import { ArrowLeft, Eye, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import type { ContentBlock, SitePage } from "@/types/cms";
import { useUpsertPage } from "@/hooks/useSitePages";
import { headingLevel, pageSlug, safeContentUrl, validPageSlug } from "@/lib/cmsContentSafety";
import BlockEditor from "./BlockEditor";
import { PageBlocks } from "./BlockRenderer";

interface PageEditorProps {
  /** null creates a new page. */
  page: Partial<SitePage> | null;
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
  const [showInNav, setShowInNav] = useState(page?.show_in_nav ?? false);
  const [navLabel, setNavLabel] = useState(page?.nav_label || "");
  const [navOrder, setNavOrder] = useState(page?.nav_order ?? 0);
  const [showPreview, setShowPreview] = useState(false);
  const upsert = useUpsertPage();

  const dirty =
    JSON.stringify({ title, slug, metaDesc, blocks, isPublished, showInNav, navLabel, navOrder }) !==
    JSON.stringify({
      title: page?.title || "",
      slug: page?.slug || "",
      metaDesc: page?.meta_description || "",
      blocks: page?.content || [],
      isPublished: page?.is_published ?? false,
      showInNav: page?.show_in_nav ?? false,
      navLabel: page?.nav_label || "",
      navOrder: page?.nav_order ?? 0,
    });

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);

  const handleBack = () => {
    if (dirty && !window.confirm("Du har osparade ändringar. Vill du lämna sidan utan att spara?")) return;
    onBack();
  };

  const handleSave = () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Sidan behöver en titel och en adress.");
      return;
    }
    if (!validPageSlug(slug.trim())) {
      toast.error("Adressen får innehålla små bokstäver, siffror och enkla bindestreck, högst 100 tecken.");
      return;
    }
    const unsafeLink = blocks.some(({ type, data }) => {
      const value = type === "cta_button" ? data.url : type === "image" || type === "video" ? data.src : "";
      return value && !safeContentUrl(value, type === "image" || type === "video");
    });
    if (unsafeLink) {
      toast.error("Kontrollera länkarna: använd https://, en sökväg på webbplatsen eller en e-post- eller telefonlänk.");
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
          toast.success(isPublished ? "Sidan är sparad och publicerad." : "Sidan är sparad som utkast.");
          onDirtyChange?.(false);
          onBack();
        },
        onError: (failure) => toast.error(`Kunde inte spara: ${failure.message}`),
      },
    );
  };

  const hasOwnH1 = blocks.some((block) => block.type === "heading" && headingLevel(block.data.level) === 1);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={handleBack} className="inline-flex min-h-11 items-center gap-2 font-semibold text-moss hover:text-ink">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Alla sidor
        </button>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowPreview((open) => !open)} aria-pressed={showPreview} className="btn btn-quiet min-h-11 px-5 py-2">
            {showPreview ? <Pencil aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
            {showPreview ? "Fortsätt redigera" : "Förhandsgranska"}
          </button>
          <button type="button" onClick={handleSave} disabled={upsert.isPending} className="btn btn-primary min-h-11 px-6 py-2 disabled:opacity-60">
            {upsert.isPending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
            {upsert.isPending ? "Sparar…" : "Spara sidan"}
          </button>
        </div>
      </div>

      <h2 className="mt-6 font-display text-3xl text-ink soft-type">{title.trim() || (page?.id ? "Namnlös sida" : "Ny sida")}</h2>
      <p className="mt-1 text-moss">{isPublished ? "Publicerad" : "Utkast"}{dirty ? ", med osparade ändringar" : ""}</p>

      {showPreview ? (
        <div className="mt-6 rounded-2xl border border-line bg-paper px-5 py-8 sm:px-10 sm:py-12">
          <p className="type-small text-moss">Förhandsgranskning. Så här ser innehållet ut på sidan.</p>
          {!hasOwnH1 && <h1 className="type-h1 mt-6">{title || "Sidtitel"}</h1>}
          <div className="mt-8">
            <PageBlocks blocks={blocks} />
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section aria-labelledby={`${fieldId}-blocks`}>
            <h3 id={`${fieldId}-blocks`} className="font-display text-xl soft-type">
              Innehåll
            </h3>
            <p className="mt-1 type-small text-moss">Sidan byggs av block i den här ordningen. Ändringarna syns på webbplatsen när du sparar.</p>
            <div className="mt-4">
              <BlockEditor blocks={blocks} onChange={setBlocks} />
            </div>
          </section>

          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <section className="space-y-5 rounded-2xl border border-line bg-paper-raised p-5">
              <h3 className="font-display text-xl soft-type">Sidan</h3>
              <div>
                <label htmlFor={`${fieldId}-title`} className="field-label">
                  Titel
                </label>
                <input
                  id={`${fieldId}-title`}
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    if (!slugEdited) setSlug(pageSlug(event.target.value));
                  }}
                  maxLength={200}
                  className="field-input"
                  placeholder="Till exempel Massage vid huvudvärk"
                />
              </div>
              <div>
                <label htmlFor={`${fieldId}-slug`} className="field-label">
                  Adress
                </label>
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-moss">
                    /p/
                  </span>
                  <input
                    id={`${fieldId}-slug`}
                    value={slug}
                    onChange={(event) => {
                      setSlugEdited(true);
                      setSlug(event.target.value.toLowerCase());
                    }}
                    maxLength={100}
                    spellCheck={false}
                    aria-describedby={`${fieldId}-slug-help`}
                    className="field-input"
                    placeholder="massage-vid-huvudvark"
                  />
                </div>
                <p id={`${fieldId}-slug-help`} className="field-hint">
                  Små bokstäver, siffror och bindestreck. Sidan får adressen /p/{slug || "…"}.
                </p>
              </div>
              <div>
                <label htmlFor={`${fieldId}-meta`} className="field-label">
                  Beskrivning för Google
                </label>
                <textarea
                  id={`${fieldId}-meta`}
                  value={metaDesc}
                  onChange={(event) => setMetaDesc(event.target.value)}
                  className="field-input !min-h-[6.5rem]"
                  maxLength={160}
                  aria-describedby={`${fieldId}-meta-help`}
                  placeholder="En eller två meningar om vad sidan handlar om."
                />
                <p id={`${fieldId}-meta-help`} className="field-hint">
                  {metaDesc.length} av 160 tecken. Visas ofta under länken i sökresultatet.
                </p>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-line bg-paper-raised p-5">
              <h3 className="font-display text-xl soft-type">Publicering</h3>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`${fieldId}-published`}
                  checked={isPublished}
                  onChange={(event) => setIsPublished(event.target.checked)}
                  aria-describedby={`${fieldId}-published-help`}
                  className="mt-1 h-5 w-5 shrink-0 accent-primary"
                />
                <div>
                  <label htmlFor={`${fieldId}-published`} className="font-semibold">
                    Publicera sidan
                  </label>
                  <p id={`${fieldId}-published-help`} className="type-small text-moss">
                    Visas i kunskapsbanken och kan hittas av Google.
                  </p>
                </div>
              </div>
              <div>
                <label htmlFor={`${fieldId}-nav-label`} className="field-label">
                  Kort namn (valfritt)
                </label>
                <input
                  id={`${fieldId}-nav-label`}
                  value={navLabel}
                  onChange={(event) => setNavLabel(event.target.value)}
                  aria-describedby={`${fieldId}-nav-label-help`}
                  className="field-input"
                  placeholder={title || "Samma som titeln"}
                />
                <p id={`${fieldId}-nav-label-help`} className="field-hint">
                  Används i sidfoten och i länkraden överst på artikeln.
                </p>
              </div>
              <div className="flex items-start gap-3 border-t border-line pt-4">
                <input
                  type="checkbox"
                  id={`${fieldId}-featured`}
                  checked={showInNav}
                  onChange={(event) => setShowInNav(event.target.checked)}
                  aria-describedby={`${fieldId}-featured-help`}
                  className="mt-1 h-5 w-5 shrink-0 accent-primary"
                />
                <div>
                  <label htmlFor={`${fieldId}-featured`} className="font-semibold">
                    Lyft fram i sidfoten
                  </label>
                  <p id={`${fieldId}-featured-help`} className="type-small text-moss">
                    Framlyfta sidor visas först i sidfotens lista över artiklar.
                  </p>
                </div>
              </div>
              {showInNav && (
                <div>
                  <label htmlFor={`${fieldId}-nav-order`} className="field-label">
                    Ordning
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    id={`${fieldId}-nav-order`}
                    value={navOrder}
                    onChange={(event) => setNavOrder(Number(event.target.value))}
                    aria-describedby={`${fieldId}-nav-order-help`}
                    className="field-input"
                  />
                  <p id={`${fieldId}-nav-order-help`} className="field-hint">
                    Lägre nummer visas först.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

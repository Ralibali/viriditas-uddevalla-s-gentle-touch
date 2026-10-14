import { useState } from "react";
import { ExternalLink, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useDeletePage, useSitePages } from "@/hooks/useSitePages";
import { formatDateTime } from "@/lib/adminTypes";
import type { SitePage } from "@/types/cms";

interface PageListProps {
  onEdit: (page: SitePage) => void;
  onNew: () => void;
}

export default function PageList({ onEdit, onNew }: PageListProps) {
  const { data: pages, isLoading, error, refetch } = useSitePages({ admin: true });
  const deletePage = useDeletePage();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = (page: SitePage) => {
    if (!window.confirm(`Ta bort sidan ”${page.title}”? Det går inte att ångra.`)) return;
    setDeleting(page.id);
    deletePage.mutate(page.id, {
      onSuccess: () => toast.success("Sidan är borttagen."),
      onError: (failure) => toast.error(`Kunde inte ta bort sidan: ${failure.message}`),
      onSettled: () => setDeleting(null),
    });
  };

  if (isLoading) return <p role="status" className="py-12 text-moss">Hämtar sidorna…</p>;
  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-destructive/30 bg-paper-raised p-6">
        <p className="font-semibold text-destructive">Sidorna kunde inte hämtas: {error.message}</p>
        <button type="button" onClick={() => void refetch()} className="link mt-3">
          Försök igen
        </button>
      </div>
    );
  }

  const sorted = [...(pages ?? [])].sort((a, b) => Number(a.is_published) - Number(b.is_published) || b.updated_at.localeCompare(a.updated_at));

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl text-moss">
          Artiklar och egna sidor. Publicerade sidor visas i kunskapsbanken och i sidfoten. Utkast syns bara här.
        </p>
        <button type="button" onClick={onNew} className="btn btn-primary min-h-11 px-5 py-2">
          <Plus aria-hidden="true" className="h-4 w-4" /> Ny sida
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line p-8 text-center">
          <p className="text-moss">Inga sidor ännu. En artikel om något kunderna ofta frågar om hjälper både dem och synligheten i Google.</p>
          <button type="button" onClick={onNew} className="link mt-3">
            Skriv den första artikeln
          </button>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {sorted.map((page) => (
            <li key={page.id} className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-display text-xl text-ink soft-type">{page.title}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${page.is_published ? "bg-sprout text-ink" : "bg-paper-deep text-ink"}`}>
                    {page.is_published ? "Publicerad" : "Utkast"}
                  </span>
                  {page.is_published && page.show_in_nav && <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-moss">Framlyft</span>}
                </p>
                <p className="mt-1 break-words type-small text-moss">
                  /p/{page.slug}, ändrad {formatDateTime(page.updated_at)}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {page.is_published && (
                  <a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-quiet min-h-11 px-4 py-2">
                    Visa <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    <span className="sr-only"> {page.title} (öppnas i ny flik)</span>
                  </a>
                )}
                <button type="button" onClick={() => onEdit(page)} className="btn btn-quiet min-h-11 px-4 py-2">
                  Redigera<span className="sr-only"> {page.title}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(page)}
                  disabled={deleting !== null}
                  className="btn min-h-11 px-4 py-2 text-destructive hover:bg-destructive/5 disabled:opacity-50"
                >
                  {deleting === page.id && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                  Ta bort<span className="sr-only"> {page.title}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

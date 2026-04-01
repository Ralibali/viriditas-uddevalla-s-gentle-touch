import { useState } from "react";
import { Plus, Edit3, Trash2, Globe, GlobeLock, Menu as MenuIcon, Loader2 } from "lucide-react";
import { useSitePages, useDeletePage } from "@/hooks/useSitePages";
import type { SitePage } from "@/types/cms";
import { toast } from "sonner";

interface PageListProps {
  onEdit: (page: SitePage) => void;
  onNew: () => void;
}

export default function PageList({ onEdit, onNew }: PageListProps) {
  const { data: pages, isLoading } = useSitePages();
  const deletePage = useDeletePage();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = (page: SitePage) => {
    if (!confirm(`Vill du verkligen ta bort "${page.title}"?`)) return;
    setDeleting(page.id);
    deletePage.mutate(page.id, {
      onSuccess: () => { toast.success("Sidan borttagen"); setDeleting(null); },
      onError: () => { toast.error("Kunde inte ta bort sidan"); setDeleting(null); },
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground font-body text-center py-12">Laddar sidor...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold text-foreground">Sidor</h2>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-body font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Ny sida
        </button>
      </div>

      {(!pages || pages.length === 0) ? (
        <div className="text-center py-12 text-muted-foreground font-body">
          <p>Inga sidor ännu. Skapa din första!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {page.is_published ? (
                    <Globe className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <GlobeLock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className="font-body font-medium text-foreground truncate">{page.title}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground font-body">/{page.slug}</span>
                  {page.show_in_nav && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body flex items-center gap-1">
                      <MenuIcon className="w-3 h-3" /> I menyn
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onEdit(page)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(page)}
                disabled={deleting === page.id}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
              >
                {deleting === page.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

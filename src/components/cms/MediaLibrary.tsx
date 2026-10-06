import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cmsAdminCall } from "@/lib/cmsAdmin";

interface LibraryImage { path: string; created_at: string; url: string }
interface MediaLibraryProps { onSelect?: (url: string) => void; currentValue?: string }

export default function MediaLibrary({ onSelect, currentValue }: MediaLibraryProps) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);
  const images = useQuery({ queryKey: ["cms-images"], queryFn: () => cmsAdminCall<LibraryImage[]>("list_images"), staleTime: 30000 });

  const remove = async (image: LibraryImage) => {
    if (!window.confirm("Ta bort den här bilden permanent? Bilder som används på webbplatsen kan inte tas bort.")) return;
    setDeleting(image.path);
    try {
      await cmsAdminCall<{ success: boolean }>("delete_image", { path: image.path });
      await queryClient.invalidateQueries({ queryKey: ["cms-images"] });
      toast.success("Bilden är borttagen.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bilden kunde inte tas bort.");
    } finally {
      setDeleting(null);
    }
  };

  return <div className="space-y-3 rounded-xl border border-border bg-background p-4">
    <div><h3 className="font-display font-semibold">Bildbibliotek</h3><p className="mt-1 text-xs text-muted-foreground">Välj en tidigare uppladdad bild eller radera en bild som inte används.</p></div>
    {images.isLoading && <p className="text-sm text-muted-foreground">Laddar bilder…</p>}
    {images.isError && <div role="alert" className="text-sm text-destructive"><p>{images.error instanceof Error ? images.error.message : "Bilderna kunde inte hämtas."}</p><button type="button" onClick={() => void images.refetch()} className="mt-2 underline">Försök igen</button></div>}
    {images.data?.length === 0 && <p className="text-sm text-muted-foreground">Inga uppladdade bilder ännu.</p>}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{images.data?.map(image => <div key={image.path} className="overflow-hidden rounded-lg border border-border">
      {onSelect ? <button type="button" onClick={() => onSelect(image.url)} className="block w-full text-left hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Välj bilden ${image.path.split("/").pop()}`}><img src={image.url} alt="" loading="lazy" className="h-28 w-full object-contain" /><span className="block truncate px-2 py-1.5 text-xs">Välj bild</span></button> : <img src={image.url} alt="Uppladdad bild" loading="lazy" className="h-28 w-full object-contain" />}
      <button type="button" onClick={() => void remove(image)} disabled={deleting !== null || currentValue === image.url} className="flex w-full items-center justify-center gap-1.5 border-t border-border px-2 py-2 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-40" title={currentValue === image.url ? "Bilden är vald i det här fältet." : "Radera oanvänd bild"}>
        {deleting === image.path ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Ta bort
      </button>
    </div>)}</div>
  </div>;
}

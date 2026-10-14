import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cmsAdminCall } from "@/lib/cmsAdmin";

interface LibraryImage {
  path: string;
  created_at: string;
  url: string;
}

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  currentValue?: string;
}

const fileName = (path: string) => path.split("/").pop() || path;

export default function MediaLibrary({ onSelect, currentValue }: MediaLibraryProps) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);
  const images = useQuery({ queryKey: ["cms-images"], queryFn: () => cmsAdminCall<LibraryImage[]>("list_images"), staleTime: 30_000 });

  const remove = async (image: LibraryImage) => {
    if (!window.confirm("Ta bort bilden för gott? Bilder som används på webbplatsen kan inte tas bort.")) return;
    setDeleting(image.path);
    try {
      await cmsAdminCall<{ success: boolean }>("delete_image", { path: image.path });
      await queryClient.invalidateQueries({ queryKey: ["cms-images"] });
      toast.success("Bilden är borttagen.");
    } catch (failure) {
      toast.error(failure instanceof Error ? failure.message : "Bilden kunde inte tas bort.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-line bg-paper p-4 sm:p-5">
      <p className="font-semibold">Bildbiblioteket</p>
      <p className="type-small text-moss">Välj en bild du har laddat upp tidigare. Oanvända bilder kan tas bort.</p>
      {images.isLoading && (
        <p role="status" className="mt-4 text-moss">
          Hämtar bilder…
        </p>
      )}
      {images.isError && (
        <div role="alert" className="mt-4">
          <p className="font-semibold text-destructive">{images.error instanceof Error ? images.error.message : "Bilderna kunde inte hämtas."}</p>
          <button type="button" onClick={() => void images.refetch()} className="link mt-2">
            Försök igen
          </button>
        </div>
      )}
      {images.data?.length === 0 && <p className="mt-4 text-moss">Inga uppladdade bilder ännu.</p>}
      {!!images.data?.length && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.data.map((image) => {
            const selected = currentValue === image.url;
            return (
              <li key={image.path} className={`overflow-hidden rounded-xl border bg-paper-raised ${selected ? "border-primary ring-2 ring-primary/30" : "border-line"}`}>
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect(image.url)}
                    className="group relative block w-full text-left"
                    aria-label={`Välj bilden ${fileName(image.path)}`}
                    aria-pressed={selected}
                  >
                    <img src={image.url} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check aria-hidden="true" className="h-4 w-4" />
                      </span>
                    )}
                    <span className="block truncate px-3 py-2 type-small group-hover:text-primary">{fileName(image.path)}</span>
                  </button>
                ) : (
                  <img src={image.url} alt={fileName(image.path)} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => void remove(image)}
                  disabled={deleting !== null || selected}
                  title={selected ? "Bilden är vald i det här fältet." : undefined}
                  aria-label={`Ta bort bilden ${fileName(image.path)}`}
                  className="flex min-h-10 w-full items-center justify-center gap-1.5 border-t border-line px-2 text-sm font-semibold text-destructive hover:bg-destructive/5 disabled:opacity-40"
                >
                  {deleting === image.path ? <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /> : <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />}
                  Ta bort
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

import { useId, useState } from "react";
import { Loader2, Upload, Images } from "lucide-react";
import { cmsAdminCall } from "@/lib/cmsAdmin";
import { isSafeContentUrl } from "@/lib/siteContentValues";
import MediaLibrary from "./MediaLibrary";
import { useQueryClient } from "@tanstack/react-query";

interface MediaInputProps {
  value: string;
  onChange: (url: string) => void;
  id?: string;
  label?: string;
  disabled?: boolean;
}

export default function MediaInput({ value, onChange, id, label = "Bild", disabled = false }: MediaInputProps) {
  const queryClient = useQueryClient();
  const generatedId = useId();
  const [showLibrary, setShowLibrary] = useState(false);
  const inputId = id || generatedId;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file?: File) => {
    if (!file) return;
    setError(null);
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Välj en JPG-, PNG-, WebP- eller GIF-bild.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Bilden får vara högst 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = () => reject(new Error("Bilden kunde inte läsas."));
        reader.readAsDataURL(file);
      });
      const result = await cmsAdminCall<{ url: string; path: string }>("upload_image", { filename: file.name, mimeType: file.type, base64 });
      if (!result.url || !isSafeContentUrl(result.url, true)) throw new Error("Ingen giltig bildadress returnerades.");
      onChange(result.url);
      await queryClient.invalidateQueries({ queryKey: ["cms-images"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilden kunde inte laddas upp.");
    } finally {
      setUploading(false);
    }
  };

  return <div className="space-y-2">
    <label htmlFor={inputId} className="block text-sm font-medium text-foreground">{label}</label>
    <input id={inputId} value={value} onChange={event => { setError(null); onChange(event.target.value); }} disabled={disabled || uploading} className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground" placeholder="https://… eller /bilder/bild.jpg" aria-describedby={`${inputId}-help ${error ? `${inputId}-error` : ""}`} />
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor={`${inputId}-upload`} className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium ${disabled || uploading ? "pointer-events-none opacity-50" : "hover:bg-muted"}`}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {uploading ? "Laddar upp…" : "Ladda upp bild"}
      </label>
      <button type="button" disabled={disabled || uploading} onClick={() => setShowLibrary(value => !value)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50" aria-expanded={showLibrary}><Images className="h-4 w-4" /> {showLibrary ? "Stäng bibliotek" : "Välj från bibliotek"}</button>
      <input id={`${inputId}-upload`} type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={disabled || uploading} className="sr-only" onChange={event => { void upload(event.target.files?.[0]); event.target.value = ""; }} />
      <p id={`${inputId}-help`} className="text-xs text-muted-foreground">JPG, PNG, WebP eller GIF. Högst 5 MB. Spara sidan efter uppladdning.</p>
    </div>
    {showLibrary && <MediaLibrary currentValue={value} onSelect={url => { onChange(url); setShowLibrary(false); }} />}
    {error && <p id={`${inputId}-error`} role="alert" className="text-sm text-destructive">{error}</p>}
    {value && isSafeContentUrl(value, true) && <img src={value} alt="Förhandsvisning av vald bild" className="max-h-44 rounded-lg border border-border object-contain" loading="lazy" />}
  </div>;
}

import { useId, useState, type ReactNode } from "react";
import { Images, Loader2, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cmsAdminCall } from "@/lib/cmsAdmin";
import { isSafeContentUrl } from "@/lib/siteContentValues";
import MediaLibrary from "./MediaLibrary";

interface MediaInputProps {
  value: string;
  onChange: (url: string) => void;
  id?: string;
  label?: string;
  disabled?: boolean;
  /** Shown beside the label, for example a changed marker. */
  labelAddon?: ReactNode;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function MediaInput({ value, onChange, id, label = "Bild", disabled = false, labelAddon }: MediaInputProps) {
  const queryClient = useQueryClient();
  const generatedId = useId();
  const inputId = id || generatedId;
  const [showLibrary, setShowLibrary] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brokenPreview, setBrokenPreview] = useState<string | null>(null);
  const locked = disabled || uploading;

  const upload = async (file?: File) => {
    if (!file) return;
    setError(null);
    if (!ACCEPTED.includes(file.type)) {
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
      if (!result.url || !isSafeContentUrl(result.url, true)) throw new Error("Ingen giltig bildadress kom tillbaka.");
      onChange(result.url);
      await queryClient.invalidateQueries({ queryKey: ["cms-images"] });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Bilden kunde inte laddas upp.");
    } finally {
      setUploading(false);
    }
  };

  const preview = value && isSafeContentUrl(value, true) ? value : "";

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
        {labelAddon}
      </div>
      <div className="grid gap-4 sm:grid-cols-[8.5rem_1fr]">
        <div className="flex h-28 items-center justify-center overflow-hidden rounded-xl border border-line bg-paper sm:h-full sm:min-h-28">
          {preview && brokenPreview !== preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" loading="lazy" onError={() => setBrokenPreview(preview)} />
          ) : (
            <span className="px-3 text-center type-small text-moss">{preview ? "Bilden kan inte visas här" : "Ingen bild vald"}</span>
          )}
        </div>
        <div className="min-w-0">
          <input
            id={inputId}
            value={value}
            onChange={(event) => {
              setError(null);
              onChange(event.target.value);
            }}
            disabled={locked}
            inputMode="url"
            spellCheck={false}
            className="field-input"
            placeholder="https://… eller /bild.jpg"
            aria-invalid={error ? true : undefined}
            aria-describedby={`${inputId}-help${error ? ` ${inputId}-error` : ""}`}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label
              htmlFor={`${inputId}-upload`}
              className={`btn btn-quiet min-h-11 cursor-pointer px-4 py-2 text-[0.9375rem] ${locked ? "pointer-events-none opacity-50" : ""}`}
            >
              {uploading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Upload aria-hidden="true" className="h-4 w-4" />}
              {uploading ? "Laddar upp…" : "Ladda upp"}
            </label>
            <input
              id={`${inputId}-upload`}
              type="file"
              accept={ACCEPTED.join(",")}
              disabled={locked}
              className="sr-only"
              onChange={(event) => {
                void upload(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={locked}
              onClick={() => setShowLibrary((open) => !open)}
              aria-expanded={showLibrary}
              className="btn btn-quiet min-h-11 px-4 py-2 text-[0.9375rem] disabled:opacity-50"
            >
              <Images aria-hidden="true" className="h-4 w-4" /> {showLibrary ? "Stäng bildbiblioteket" : "Välj i bildbiblioteket"}
            </button>
          </div>
          <p id={`${inputId}-help`} className="field-hint">
            JPG, PNG, WebP eller GIF, högst 5 MB. Uppladdade bilder sparas i bildbiblioteket.
          </p>
          {error && (
            <p id={`${inputId}-error`} role="alert" className="mt-2 font-semibold text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>
      {showLibrary && (
        <MediaLibrary
          currentValue={value}
          onSelect={(url) => {
            onChange(url);
            setShowLibrary(false);
          }}
        />
      )}
    </div>
  );
}

import { useId, useState, type ElementType } from "react";
import { AlignLeft, ChevronDown, ChevronUp, HelpCircle, Image, List, Minus, MousePointerClick, Plus, Quote, Trash2, Type, Video } from "lucide-react";
import type { BlockType, ContentBlock } from "@/types/cms";
import MediaInput from "./MediaInput";

const BLOCK_TYPES: { type: BlockType; label: string; icon: ElementType }[] = [
  { type: "heading", label: "Rubrik", icon: Type },
  { type: "paragraph", label: "Text", icon: AlignLeft },
  { type: "image", label: "Bild", icon: Image },
  { type: "list", label: "Lista", icon: List },
  { type: "quote", label: "Citat", icon: Quote },
  { type: "faq", label: "Frågor och svar", icon: HelpCircle },
  { type: "cta_button", label: "Knapp", icon: MousePointerClick },
  { type: "video", label: "Film", icon: Video },
  { type: "divider", label: "Avdelare", icon: Minus },
];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function defaultData(type: BlockType): ContentBlock["data"] {
  switch (type) {
    case "heading":
      return { text: "", level: 2 };
    case "paragraph":
      return { text: "" };
    case "image":
      return { src: "", alt: "" };
    case "video":
      return { src: "" };
    case "cta_button":
      return { text: "Boka tid", url: "", variant: "default", trackSource: "", external: true };
    case "list":
      return { items: [""] };
    case "quote":
      return { text: "", author: "" };
    case "faq":
      return { items: [{ question: "", answer: "" }] };
    default:
      return {};
  }
}

type FieldKind = "text" | "textarea" | "number" | "select" | "checkbox";

function BlockFields({ block, onChange }: { block: ContentBlock; onChange: (data: ContentBlock["data"]) => void }) {
  const { data } = block;
  const fieldId = useId();

  const field = (label: string, key: string, kind: FieldKind = "text", options?: { value: string; label: string }[], hint?: string) => {
    const id = `${fieldId}-${key}`;
    const hintId = hint ? `${id}-hint` : undefined;
    if (kind === "checkbox") {
      return (
        <div key={key} className="flex items-center gap-3">
          <input id={id} type="checkbox" checked={!!data[key]} onChange={(event) => onChange({ ...data, [key]: event.target.checked })} className="h-5 w-5 accent-primary" />
          <label htmlFor={id} className="font-semibold">
            {label}
          </label>
        </div>
      );
    }
    let control;
    if (kind === "textarea") {
      control = <textarea id={id} aria-describedby={hintId} value={data[key] || ""} onChange={(event) => onChange({ ...data, [key]: event.target.value })} className="field-input" />;
    } else if (kind === "select") {
      control = (
        <select
          id={id}
          aria-describedby={hintId}
          value={String(data[key] ?? "")}
          onChange={(event) => onChange({ ...data, [key]: key === "level" ? Number(event.target.value) : event.target.value })}
          className="field-input"
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else {
      control = (
        <input
          id={id}
          type={kind === "number" ? "number" : "text"}
          inputMode={kind === "number" ? "numeric" : undefined}
          aria-describedby={hintId}
          value={data[key] ?? ""}
          onChange={(event) => onChange({ ...data, [key]: kind === "number" ? (event.target.value === "" ? undefined : Number(event.target.value)) : event.target.value })}
          className="field-input"
        />
      );
    }
    return (
      <div key={key}>
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        {control}
        {hint && (
          <p id={hintId} className="field-hint">
            {hint}
          </p>
        )}
      </div>
    );
  };

  switch (block.type) {
    case "heading":
      return (
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]">
          {field("Rubrik", "text")}
          {field("Nivå", "level", "select", [
            { value: "1", label: "Huvudrubrik (H1)" },
            { value: "2", label: "Rubrik (H2)" },
            { value: "3", label: "Underrubrik (H3)" },
          ])}
        </div>
      );
    case "paragraph":
      return field("Text", "text", "textarea", undefined, "Radbrytningar syns på sidan.");
    case "image":
      return (
        <div className="space-y-4">
          <MediaInput value={data.src || ""} onChange={(src) => onChange({ ...data, src })} label="Bild" />
          {field("Beskrivning av bilden", "alt", "text", undefined, "Läses upp för den som inte ser bilden. Lämna tomt om bilden bara är dekoration.")}
          {field("Bildtext (valfri)", "caption")}
          {field("Största höjd i pixlar (valfri)", "maxHeight", "number")}
        </div>
      );
    case "video":
      return (
        <div className="space-y-4">
          {field("Adress till filmen", "src", "text", undefined, "En https-adress till en mp4-fil eller en sökväg på webbplatsen.")}
          {field("Beskrivning av filmen", "alt")}
        </div>
      );
    case "cta_button":
      return (
        <div className="space-y-4">
          {field("Text på knappen", "text")}
          {field("Länk", "url", "text", undefined, "Lämna tomt för att länka till bokningen.")}
          {field("Utseende", "variant", "select", [
            { value: "default", label: "Grön" },
            { value: "inverted", label: "Ljus med kant" },
          ])}
          {field("Namn i statistiken (valfritt)", "trackSource", "text", undefined, "Klick på knappen räknas under det här namnet.")}
          {field("Öppna i ny flik", "external", "checkbox")}
        </div>
      );
    case "list":
      return (
        <div>
          <label htmlFor={`${fieldId}-items`} className="field-label">
            Punkter
          </label>
          <textarea
            id={`${fieldId}-items`}
            aria-describedby={`${fieldId}-items-hint`}
            value={(data.items || []).join("\n")}
            onChange={(event) => onChange({ ...data, items: event.target.value.split("\n") })}
            className="field-input"
          />
          <p id={`${fieldId}-items-hint`} className="field-hint">
            En punkt per rad.
          </p>
        </div>
      );
    case "quote":
      return (
        <div className="space-y-4">
          {field("Citat", "text", "textarea")}
          {field("Vem sa det? (valfritt)", "author")}
        </div>
      );
    case "divider":
      return <p className="text-moss">En tunn linje mellan två delar av sidan.</p>;
    case "faq": {
      const items = (data.items || []) as { question: string; answer: string }[];
      const update = (index: number, patch: Partial<{ question: string; answer: string }>) =>
        onChange({ ...data, items: items.map((item, position) => (position === index ? { ...item, ...patch } : item)) });
      return (
        <div className="space-y-4">
          {items.map((item, index) => (
            <fieldset key={index} className="space-y-4 rounded-xl border border-line bg-paper p-4">
              <legend className="px-1 type-small font-semibold text-moss">Fråga {index + 1}</legend>
              <div>
                <label htmlFor={`${fieldId}-question-${index}`} className="field-label">
                  Fråga
                </label>
                <input id={`${fieldId}-question-${index}`} value={item.question} onChange={(event) => update(index, { question: event.target.value })} className="field-input" />
              </div>
              <div>
                <label htmlFor={`${fieldId}-answer-${index}`} className="field-label">
                  Svar
                </label>
                <textarea id={`${fieldId}-answer-${index}`} value={item.answer} onChange={(event) => update(index, { answer: event.target.value })} className="field-input !min-h-[6rem]" />
              </div>
              <button
                type="button"
                onClick={() => onChange({ ...data, items: items.filter((_, position) => position !== index) })}
                className="link-quiet text-sm font-semibold text-destructive"
              >
                Ta bort fråga {index + 1}
              </button>
            </fieldset>
          ))}
          <button type="button" onClick={() => onChange({ ...data, items: [...items, { question: "", answer: "" }] })} className="btn btn-quiet min-h-11 px-4 py-2">
            <Plus aria-hidden="true" className="h-4 w-4" /> Lägg till fråga
          </button>
        </div>
      );
    }
    default:
      return null;
  }
}

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);

  const addBlock = (type: BlockType) => {
    const block: ContentBlock = { id: generateId(), type, data: defaultData(type) };
    onChange([...blocks, block]);
    setMenuOpen(false);
    window.setTimeout(() => document.getElementById(`block-${block.id}`)?.querySelector<HTMLElement>("input, textarea, select")?.focus(), 0);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const updated = [...blocks];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onChange(updated);
  };

  return (
    <div>
      {blocks.length === 0 && <p className="rounded-2xl border border-dashed border-line p-8 text-center text-moss">Sidan är tom. Börja med en rubrik eller ett stycke text.</p>}

      <ol className="space-y-4">
        {blocks.map((block, index) => {
          const definition = BLOCK_TYPES.find((candidate) => candidate.type === block.type);
          const Icon = definition?.icon || Type;
          const name = `${definition?.label || "Block"} ${index + 1}`;
          return (
            <li key={block.id} id={`block-${block.id}`} aria-label={name} className="rounded-2xl border border-line bg-paper-raised">
              <div className="flex items-center gap-3 border-b border-line py-1.5 pl-4 pr-1.5">
                <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                <span className="font-semibold">{definition?.label || block.type}</span>
                <span className="ml-auto flex">
                  <button
                    type="button"
                    aria-label={`Flytta ${name} uppåt`}
                    onClick={() => moveBlock(index, -1)}
                    disabled={index === 0}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-moss hover:bg-paper-deep hover:text-ink disabled:opacity-30"
                  >
                    <ChevronUp aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Flytta ${name} nedåt`}
                    onClick={() => moveBlock(index, 1)}
                    disabled={index === blocks.length - 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-moss hover:bg-paper-deep hover:text-ink disabled:opacity-30"
                  >
                    <ChevronDown aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Ta bort ${name}`}
                    onClick={() => onChange(blocks.filter((_, position) => position !== index))}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-destructive hover:bg-destructive/5"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </button>
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <BlockFields block={block} onChange={(data) => onChange(blocks.map((candidate, position) => (position === index ? { ...candidate, data } : candidate)))} />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line font-semibold text-moss transition-colors hover:border-primary hover:text-primary"
        >
          <Plus aria-hidden="true" className="h-4 w-4" /> Lägg till block
        </button>
        {menuOpen && (
          <ul id={menuId} className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BLOCK_TYPES.map((type) => (
              <li key={type.type}>
                <button
                  type="button"
                  onClick={() => addBlock(type.type)}
                  className="flex min-h-12 w-full items-center gap-2.5 rounded-xl border border-line bg-paper-raised px-4 text-left font-semibold hover:border-primary hover:text-primary"
                >
                  <type.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                  {type.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

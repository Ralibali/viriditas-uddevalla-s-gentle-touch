import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Type, AlignLeft, Image, Video, MousePointerClick, List, Quote, Minus } from "lucide-react";
import type { ContentBlock, BlockType } from "@/types/cms";

const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ElementType }[] = [
  { type: "heading", label: "Rubrik", icon: Type },
  { type: "paragraph", label: "Text", icon: AlignLeft },
  { type: "image", label: "Bild", icon: Image },
  { type: "video", label: "Video", icon: Video },
  { type: "cta_button", label: "Knapp (CTA)", icon: MousePointerClick },
  { type: "list", label: "Lista", icon: List },
  { type: "quote", label: "Citat", icon: Quote },
  { type: "divider", label: "Avdelare", icon: Minus },
];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function defaultData(type: BlockType): Record<string, any> {
  switch (type) {
    case "heading": return { text: "Ny rubrik", level: 2, showDivider: false };
    case "paragraph": return { text: "Skriv din text här..." };
    case "image": return { src: "", alt: "" };
    case "video": return { src: "" };
    case "cta_button": return { text: "Boka tid", url: "https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule", variant: "default", trackSource: "", external: true };
    case "list": return { items: ["Punkt 1", "Punkt 2"] };
    case "quote": return { text: "", author: "" };
    case "divider": return {};
    default: return {};
  }
}

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

function BlockFields({ block, onChange }: { block: ContentBlock; onChange: (data: Record<string, any>) => void }) {
  const { type, data } = block;

  const field = (label: string, key: string, type: "text" | "textarea" | "number" | "select" | "checkbox" = "text", options?: { value: string; label: string }[]) => {
    if (type === "textarea") {
      return (
        <div key={key}>
          <label className="text-xs text-muted-foreground font-body block mb-1">{label}</label>
          <textarea
            value={data[key] || ""}
            onChange={(e) => onChange({ ...data, [key]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body resize-y min-h-[80px]"
          />
        </div>
      );
    }
    if (type === "checkbox") {
      return (
        <div key={key} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!data[key]}
            onChange={(e) => onChange({ ...data, [key]: e.target.checked })}
            className="rounded"
          />
          <label className="text-xs text-muted-foreground font-body">{label}</label>
        </div>
      );
    }
    if (type === "select") {
      return (
        <div key={key}>
          <label className="text-xs text-muted-foreground font-body block mb-1">{label}</label>
          <select
            value={data[key] || ""}
            onChange={(e) => onChange({ ...data, [key]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body"
          >
            {options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      );
    }
    if (type === "number") {
      return (
        <div key={key}>
          <label className="text-xs text-muted-foreground font-body block mb-1">{label}</label>
          <input
            type="number"
            value={data[key] || ""}
            onChange={(e) => onChange({ ...data, [key]: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body"
          />
        </div>
      );
    }
    return (
      <div key={key}>
        <label className="text-xs text-muted-foreground font-body block mb-1">{label}</label>
        <input
          type="text"
          value={data[key] || ""}
          onChange={(e) => onChange({ ...data, [key]: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body"
        />
      </div>
    );
  };

  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-2">
          {field("Text", "text")}
          {field("Nivå", "level", "select", [
            { value: "1", label: "H1 – Huvudrubrik" },
            { value: "2", label: "H2 – Underrubrik" },
            { value: "3", label: "H3 – Mindre rubrik" },
          ])}
          {field("Visa dekorativ linje", "showDivider", "checkbox")}
        </div>
      );
    case "paragraph":
      return <div className="space-y-2">{field("Text", "text", "textarea")}</div>;
    case "image":
      return (
        <div className="space-y-2">
          {field("Bild-URL", "src")}
          {field("Alt-text (tillgänglighet)", "alt")}
          {field("Max höjd (px, valfritt)", "maxHeight")}
        </div>
      );
    case "video":
      return (
        <div className="space-y-2">
          {field("Video-URL (mp4)", "src")}
          {field("Max höjd (px, valfritt)", "maxHeight")}
        </div>
      );
    case "cta_button":
      return (
        <div className="space-y-2">
          {field("Knapptext", "text")}
          {field("URL", "url")}
          {field("Stil", "variant", "select", [
            { value: "default", label: "Standard (grön)" },
            { value: "inverted", label: "Inverterad (vit)" },
          ])}
          {field("Spårningskälla (valfritt)", "trackSource")}
          {field("Öppna i ny flik", "external", "checkbox")}
        </div>
      );
    case "list":
      return (
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-body block">Punkter (en per rad)</label>
          <textarea
            value={(data.items || []).join("\n")}
            onChange={(e) => onChange({ ...data, items: e.target.value.split("\n") })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body resize-y min-h-[80px]"
          />
        </div>
      );
    case "quote":
      return (
        <div className="space-y-2">
          {field("Citat", "text", "textarea")}
          {field("Författare", "author")}
        </div>
      );
    case "divider":
      return <p className="text-xs text-muted-foreground font-body">Horisontell avskiljare – inga inställningar.</p>;
    default:
      return null;
  }
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState<number | null>(null);

  const addBlock = (type: BlockType, index: number) => {
    const newBlock: ContentBlock = { id: generateId(), type, data: defaultData(type) };
    const updated = [...blocks];
    updated.splice(index, 0, newBlock);
    onChange(updated);
    setShowAddMenu(null);
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const updated = [...blocks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  const updateBlockData = (index: number, data: Record<string, any>) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], data };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground font-body">
          <p className="mb-4">Sidan är tom. Lägg till ditt första block.</p>
        </div>
      )}

      {blocks.map((block, i) => {
        const blockDef = BLOCK_TYPES.find((b) => b.type === block.type);
        const Icon = blockDef?.icon || Type;
        return (
          <div key={block.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-body font-medium text-foreground flex-1">{blockDef?.label || block.type}</span>
              <button onClick={() => moveBlock(i, -1)} disabled={i === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                <ChevronUp className="w-4 h-4" />
              </button>
              <button onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button onClick={() => removeBlock(i)} className="p-1 text-destructive hover:text-destructive/80">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <BlockFields block={block} onChange={(data) => updateBlockData(i, data)} />
            </div>
          </div>
        );
      })}

      {/* Add block button */}
      <div className="relative">
        <button
          onClick={() => setShowAddMenu(showAddMenu === blocks.length ? null : blocks.length)}
          className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2 font-body text-sm"
        >
          <Plus className="w-4 h-4" /> Lägg till block
        </button>
        {showAddMenu === blocks.length && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 p-2 grid grid-cols-2 gap-1">
            {BLOCK_TYPES.map((bt) => (
              <button
                key={bt.type}
                onClick={() => addBlock(bt.type, blocks.length)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body text-foreground hover:bg-muted transition-colors text-left"
              >
                <bt.icon className="w-4 h-4 text-primary" />
                {bt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

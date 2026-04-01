import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import type { ContentBlock } from "@/types/cms";
import { trackBookingClick } from "@/lib/trackBookingClick";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

export function BlockRenderer({ block }: { block: ContentBlock }) {
  const { type, data } = block;

  switch (type) {
    case "heading": {
      const Tag = (data.level === 1 ? "h1" : data.level === 2 ? "h2" : "h3") as keyof JSX.IntrinsicElements;
      const sizes: Record<number, string> = {
        1: "text-4xl md:text-5xl",
        2: "text-3xl md:text-4xl",
        3: "text-2xl md:text-3xl",
      };
      return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <Tag className={`${sizes[data.level] || sizes[2]} font-display font-semibold text-foreground mb-4 leading-tight`}>
            {data.text}
          </Tag>
          {data.showDivider && <div className="w-20 h-1 bg-primary rounded-full mt-2" />}
        </motion.div>
      );
    }

    case "paragraph":
      return (
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-lg text-muted-foreground leading-relaxed font-body"
        >
          {data.text}
        </motion.p>
      );

    case "image":
      return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <img
            src={data.src}
            alt={data.alt || ""}
            className="rounded-3xl shadow-lg w-full object-cover"
            style={data.maxHeight ? { maxHeight: data.maxHeight } : {}}
            loading="lazy"
          />
        </motion.div>
      );

    case "video":
      return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <video
            autoPlay muted loop playsInline
            className="rounded-3xl shadow-lg w-full object-cover"
            style={data.maxHeight ? { maxHeight: data.maxHeight } : {}}
          >
            <source src={data.src} type="video/mp4" />
          </video>
        </motion.div>
      );

    case "cta_button":
      return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href={data.url || "https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"}
            target={data.external !== false ? "_blank" : undefined}
            rel={data.external !== false ? "noopener noreferrer" : undefined}
            onClick={() => data.trackSource && trackBookingClick(data.trackSource)}
            className={`inline-flex items-center gap-2 px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg transition-shadow ${
              data.variant === "inverted"
                ? "bg-primary-foreground text-primary hover:shadow-xl"
                : "bg-primary text-primary-foreground shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            }`}
          >
            {data.text || "Boka tid"} <Calendar className="w-5 h-5" />
          </motion.a>
        </motion.div>
      );

    case "list":
      return (
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="list-disc list-inside space-y-2 text-foreground font-medium text-lg"
        >
          {(data.items || []).map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </motion.ul>
      );

    case "quote":
      return (
        <motion.blockquote
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="border-l-4 border-primary pl-6 my-8"
        >
          <p className="text-xl font-body italic text-foreground">"{data.text}"</p>
          {data.author && (
            <cite className="text-sm text-muted-foreground mt-2 block not-italic">– {data.author}</cite>
          )}
        </motion.blockquote>
      );

    case "divider":
      return <hr className="border-border my-8" />;

    default:
      return null;
  }
}

export function PageBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

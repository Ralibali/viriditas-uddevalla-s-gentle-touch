import { motion, useReducedMotion } from "framer-motion";
import { Calendar } from "lucide-react";
import type { ContentBlock } from "@/types/cms";
import { trackBookingClick } from "@/lib/trackBookingClick";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { headingLevel, safeContentUrl } from "@/lib/cmsContentSafety";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getGlobalContentValue } from "@/lib/siteContentValues";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function BlockRenderer({ block }: { block: ContentBlock }) {
  const { type, data } = block;
  const reduceMotion = useReducedMotion();
  const { g } = useSiteContent("home");
  const variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : fadeUp;

  switch (type) {
    case "heading": {
      const level = headingLevel(data.level);
      const Tag = `h${level}` as "h1" | "h2" | "h3";
      const sizes: Record<number, string> = {
        1: "text-4xl md:text-5xl",
        2: "text-3xl md:text-4xl",
        3: "text-2xl md:text-3xl",
      };
      return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants}>
          <Tag className={`${sizes[level]} font-display font-semibold text-foreground mb-4 leading-tight`}>
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
          variants={variants}
          className="text-lg text-muted-foreground leading-relaxed font-body"
        >
          {data.text}
        </motion.p>
      );

    case "image":
      return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants}>
          <img
            src={safeContentUrl(data.src, true)}
            alt={data.alt || ""}
            className="rounded-3xl shadow-lg w-full object-cover"
            style={data.maxHeight ? { maxHeight: data.maxHeight } : {}}
            loading="lazy"
          />
        </motion.div>
      );

    case "video":
      return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants}>
          <video
            controls playsInline preload="metadata"
            aria-label={data.alt || "Video från Viriditas"}
            className="rounded-3xl shadow-lg w-full object-cover"
            style={data.maxHeight ? { maxHeight: data.maxHeight } : {}}
          >
            <source src={safeContentUrl(data.src, true)} />
          </video>
        </motion.div>
      );

    case "cta_button":
      return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants}>
          <motion.a
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            href={safeContentUrl(!data.url || data.url === getGlobalContentValue("booking_url") ? g("booking_url") : data.url)}
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
          variants={variants}
          className="list-disc list-inside space-y-2 text-foreground font-medium text-lg"
        >
          {(Array.isArray(data.items) ? data.items : []).map((item: string, i: number) => (
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
          variants={variants}
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

    case "faq": {
      const items = (Array.isArray(data.items) ? data.items : []) as { question: string; answer: string }[];
      return (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={variants}
          className="my-8"
        >
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border">
                <AccordionTrigger className="text-left text-foreground font-body font-medium text-lg hover:no-underline py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body text-base leading-relaxed pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      );
    }

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

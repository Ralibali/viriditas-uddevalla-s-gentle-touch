/** Questions and answers as native disclosures: keyboard and screen reader friendly, and readable without JavaScript. */
export default function Faq({ items, className = "" }: { items: { question: string; answer: string }[]; className?: string }) {
  const visible = items.filter((item) => item.question && item.answer);
  if (!visible.length) return null;
  return (
    <div className={`border-t border-line ${className}`}>
      {visible.map((item) => (
        <details key={item.question} className="faq-item">
          <summary>{item.question}</summary>
          <div>
            <p className="whitespace-pre-line">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

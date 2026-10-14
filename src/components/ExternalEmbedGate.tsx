import { useState, type ReactNode } from "react";

type Props = { service: string; children: ReactNode };

/** Third-party content (like a map) loads only after the visitor asks for it. */
export default function ExternalEmbedGate({ service, children }: Props) {
  const [enabled, setEnabled] = useState(false);
  if (enabled) return <>{children}</>;
  return (
    <div className="flex min-h-[340px] flex-col items-start justify-end gap-4 bg-paper-deep p-6 sm:p-8">
      <p className="max-w-md type-small text-ink/80">
        För att visa kartan ansluter din webbläsare till {service}. Leverantören får då din IP-adress och information om webbläsaren.
      </p>
      <button type="button" onClick={() => setEnabled(true)} className="btn btn-quiet">
        Visa kartan från {service}
      </button>
    </div>
  );
}

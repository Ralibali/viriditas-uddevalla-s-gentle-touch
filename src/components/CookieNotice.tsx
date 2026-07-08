import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "viriditas-cookie-notice-dismissed";

const CookieNotice = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Integritetsnotis"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/95 backdrop-blur-sm shadow-xl shadow-foreground/10 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-muted-foreground font-body leading-relaxed flex-1 m-0">
          Vi använder <span className="font-medium text-foreground">Plausible</span> för anonym
          besöksstatistik – helt utan cookies och utan att spåra dig som individ. Vi säljer aldrig
          dina personuppgifter.
        </p>
        <button
          onClick={dismiss}
          className="inline-flex items-center justify-center gap-2 shrink-0 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-body font-medium hover:opacity-90 transition-opacity"
        >
          Jag förstår
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CookieNotice;

import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";

const MOVE_DATE = new Date("2026-05-01T00:00:00+02:00");
const STORAGE_KEY = "move-banner-dismissed";

const MoveBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (new Date() >= MOVE_DATE) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed top-0 left-0 right-0 z-[60] shadow-sm"
      style={{
        background: "hsl(45 95% 60%)",
        color: "hsl(35 80% 12%)",
        borderBottom: "1px solid hsl(40 80% 40% / 0.4)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center gap-3">
        <Info className="w-4 h-4 flex-shrink-0" aria-hidden />
        <p className="text-sm font-body leading-snug flex-1">
          <span className="font-semibold">Från 1 maj</span> hittar du oss på en ny adress:{" "}
          <span className="font-semibold">Uddevalla Folkets Hus, Göteborgsvägen 11B</span>.
        </p>
        <button
          onClick={() => {
            sessionStorage.setItem(STORAGE_KEY, "1");
            setVisible(false);
          }}
          className="p-1 rounded-full hover:bg-black/10 transition-colors flex-shrink-0"
          aria-label="Stäng meddelande"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MoveBanner;

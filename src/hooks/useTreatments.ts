import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Treatment {
  peach_id: string;
  title: string;
  duration_minutes: number | null;
  price_sek: number | null;
  description: string | null;
  source_url: string;
}

export function useTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("treatments")
        .select("peach_id,title,duration_minutes,price_sek,description,source_url");
      if (!mounted) return;
      if (error) {
        console.error("Failed to load treatments", error);
      } else if (data) {
        setTreatments(data as Treatment[]);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const byPeachId = (id: string) => treatments.find((t) => t.peach_id === id);

  return { treatments, loading, byPeachId };
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  review_date: string;
}

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    staleTime: 10 * 60 * 1000, // 10 min cache
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { selectRows } from "@/lib/backend";

export interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  review_date: string;
  created_at?: string;
  is_featured?: boolean;
  is_hidden?: boolean;
}

/** Reviews imported from Bokadirekt. Featured reviews come first; hidden ones never show. */
export function sortPublicReviews(reviews: Review[]): Review[] {
  return reviews
    .filter((review) => !review.is_hidden)
    .sort((a, b) => Number(!!b.is_featured) - Number(!!a.is_featured) || (b.created_at ?? "").localeCompare(a.created_at ?? ""));
}

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    staleTime: 10 * 60 * 1000,
    // `*` keeps working before and after the moderation columns exist.
    queryFn: async () => sortPublicReviews(await selectRows<Review>("reviews", { select: "*", order: "created_at.desc" })),
  });
}

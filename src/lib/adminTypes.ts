/** Shapes returned by the cms-admin edge function. */

export interface JobRun {
  last_started_at: string | null;
  last_finished_at: string | null;
  last_result: { success?: boolean; count?: number; error?: string; aggregate?: { rating: number | null; count: number | null } } | null;
}

export interface AdminOverview {
  booking_clicks: { last_7_days: number | null; previous_7_days: number | null; last_30_days: number | null } | null;
  messages: { new: number; total: number; gift_cards_new: number } | null;
  reviews: { imported: number; hidden: number; rating: number | null; count: number | null } | null;
  pages: { published: number; drafts: number } | null;
  jobs: Record<string, JobRun> | null;
}

export interface ContactMessage {
  id: string;
  kind: "question" | "gift_card";
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  details: { gift?: string; recipient?: string; greeting?: string; delivery?: "email" | "pickup" };
  status: "new" | "handled";
  page_path: string | null;
  notified: boolean;
  created_at: string;
  handled_at: string | null;
}

export interface AdminReview {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  review_date: string;
  created_at: string;
  is_hidden?: boolean;
  is_featured?: boolean;
}

export interface SyncedTreatment {
  service_ref: string;
  title: string;
  duration_minutes: number | null;
  price_sek: number | null;
  description: string | null;
  last_synced_at: string;
}

const dateTime = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "aldrig";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "okänt datum" : dateTime.format(date);
}

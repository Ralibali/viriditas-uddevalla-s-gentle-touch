import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { cmsAdminCall } from "@/lib/cmsAdmin";
import type { BookingClick } from "./BookingStatisticsCharts";

const BookingStatisticsCharts = lazy(() => import("./BookingStatisticsCharts"));

function useBookingClicks() {
  return useQuery({
    queryKey: ["booking-clicks-dashboard"],
    queryFn: async () => {
      return await cmsAdminCall<BookingClick[]>("get_booking_clicks");
    },
    retry: false,
  });
}

export default function BookingStatistics() {
  const { data, isLoading, error, refetch } = useBookingClicks();
  if (error) return <div role="alert" className="bg-card border border-border rounded-2xl p-6 space-y-3 font-body"><p className="text-destructive">Statistiken kunde inte hämtas: {error.message}</p><button onClick={() => refetch()} className="text-primary underline">Försök igen</button></div>;
  if (isLoading) return <p role="status" className="py-12 text-center text-muted-foreground font-body">Laddar statistik…</p>;
  return <Suspense fallback={<p role="status" className="py-12 text-muted-foreground">Laddar diagram…</p>}><BookingStatisticsCharts clicks={data} isLoading={false} /></Suspense>;
}


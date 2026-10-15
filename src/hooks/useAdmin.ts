import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsAdminCall, cmsRunJob } from "@/lib/cmsAdmin";
import type { AdminOverview, AdminReview, ContactMessage, SyncedTreatment } from "@/lib/adminTypes";

export type AdminTab = "overview" | "messages" | "content" | "pages" | "reviews" | "prices" | "stats" | "settings" | "access";
export type MessageFilter = "new" | "handled" | "all";

export function useOverview() {
  return useQuery({ queryKey: ["cms-overview"], queryFn: () => cmsAdminCall<AdminOverview>("overview"), retry: false, staleTime: 30_000 });
}

export function useMessages(filter: MessageFilter) {
  return useQuery({
    queryKey: ["cms-messages", filter],
    queryFn: () => cmsAdminCall<ContactMessage[]>("list_messages", filter === "all" ? {} : { status: filter }),
    retry: false,
  });
}

export function useMessageActions() {
  const qc = useQueryClient();
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["cms-messages"] });
    void qc.invalidateQueries({ queryKey: ["cms-overview"] });
  };
  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "new" | "handled" }) => cmsAdminCall("update_message", { id, status }),
    onSuccess: refresh,
  });
  const remove = useMutation({ mutationFn: (id: string) => cmsAdminCall("delete_message", { id }), onSuccess: refresh });
  return { update, remove };
}

export function useAdminReviews() {
  return useQuery({ queryKey: ["cms-reviews"], queryFn: () => cmsAdminCall<AdminReview[]>("list_reviews"), retry: false });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (change: { id: string; is_hidden?: boolean; is_featured?: boolean }) => cmsAdminCall("update_review", change),
    onMutate: async (change) => {
      await qc.cancelQueries({ queryKey: ["cms-reviews"] });
      const previous = qc.getQueryData<AdminReview[]>(["cms-reviews"]);
      qc.setQueryData<AdminReview[]>(["cms-reviews"], (rows) => rows?.map((row) => (row.id === change.id ? { ...row, ...change } : row)));
      return { previous };
    },
    onError: (_error, _change, context) => qc.setQueryData(["cms-reviews"], context?.previous),
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ["cms-reviews"] });
      void qc.invalidateQueries({ queryKey: ["reviews"] });
      void qc.invalidateQueries({ queryKey: ["cms-overview"] });
    },
  });
}

export function useSyncedTreatments() {
  return useQuery({ queryKey: ["cms-treatments"], queryFn: () => cmsAdminCall<SyncedTreatment[]>("list_treatments"), retry: false });
}

/** Fetch reviews or treatments from Bokadirekt now, then refresh what depends on them. */
export function useRunJob(job: "scrape-reviews" | "sync-treatments") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => cmsRunJob<{ success: boolean; count?: number }>(job),
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ["cms-overview"] });
      void qc.invalidateQueries({ queryKey: job === "scrape-reviews" ? ["cms-reviews"] : ["cms-treatments"] });
      void qc.invalidateQueries({ queryKey: ["site-settings"] });
      void qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

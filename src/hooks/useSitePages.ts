import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cmsAdminCall } from "@/lib/cmsAdmin";
import type { SitePage, ContentBlock } from "@/types/cms";

export function useSitePages() {
  return useQuery({
    queryKey: ["site-pages"],
    queryFn: async () => {
      // Try admin endpoint first (for dashboard with all pages including unpublished)
      const password = sessionStorage.getItem("dashboard-password");
      if (password) {
        try {
          const data = await cmsAdminCall("list_pages");
          return (data as any[]).map(row => ({
            ...row,
            content: (typeof row.content === 'string' ? JSON.parse(row.content) : row.content) as ContentBlock[],
          })) as SitePage[];
        } catch {
          // fall through to public query
        }
      }
      // Public: only published pages
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .order("nav_order", { ascending: true });
      if (error) throw error;
      return (data as any[]).map(row => ({
        ...row,
        content: (typeof row.content === 'string' ? JSON.parse(row.content) : row.content) as ContentBlock[],
      })) as SitePage[];
    },
  });
}

export function useSitePage(slug: string) {
  return useQuery({
    queryKey: ["site-page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        ...data,
        content: (typeof data.content === 'string' ? JSON.parse(data.content as string) : data.content) as ContentBlock[],
      } as SitePage;
    },
  });
}

export function useUpsertPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (page: Partial<SitePage> & { slug: string; title: string }) => {
      const payload = {
        ...page,
        content: JSON.stringify(page.content || []),
      };
      await cmsAdminCall("upsert_page", payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-pages"] });
      qc.invalidateQueries({ queryKey: ["site-page"] });
    },
  });
}

export function useDeletePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await cmsAdminCall("delete_page", { id });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-pages"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SitePage, ContentBlock } from "@/types/cms";

export function useSitePages() {
  return useQuery({
    queryKey: ["site-pages"],
    queryFn: async () => {
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
        updated_at: new Date().toISOString(),
      };
      
      if (page.id) {
        const { error } = await supabase
          .from("site_pages")
          .update(payload)
          .eq("id", page.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_pages")
          .insert(payload);
        if (error) throw error;
      }
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
      const { error } = await supabase.from("site_pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-pages"] });
    },
  });
}

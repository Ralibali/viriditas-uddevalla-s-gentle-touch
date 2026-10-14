import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { selectRows } from "@/lib/backend";
import { cmsAdminCall } from "@/lib/cmsAdmin";
import type { SitePage, ContentBlock } from "@/types/cms";

export function useSitePages({ admin = false }: { admin?: boolean } = {}) {
  return useQuery({
    queryKey: [admin ? "cms-admin-pages" : "site-pages"],
    staleTime: admin ? 0 : 5 * 60 * 1000,
    queryFn: async () => {
      if (admin) {
        const data = await cmsAdminCall<SitePage[]>("list_pages");
        return data.map(parsePage);
      }
      const rows = await selectRows<SitePage>("site_pages", { select: "*", is_published: "eq.true", order: "nav_order.asc" });
      return rows.map(parsePage);
    },
  });
}

export function useSitePage(slug: string) {
  return useQuery({
    queryKey: ["site-page", slug],
    enabled: !!slug,
    queryFn: async () => {
      const rows = await selectRows<SitePage>("site_pages", { select: "*", slug: `eq.${slug}`, is_published: "eq.true", limit: "1" });
      return rows[0] ? parsePage(rows[0]) : null;
    },
  });
}

export function useUpsertPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (page: Partial<SitePage> & { slug: string; title: string }) => {
      await cmsAdminCall("upsert_page", { ...page, content: JSON.stringify(page.content || []) });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-pages"] });
      qc.invalidateQueries({ queryKey: ["cms-admin-pages"] });
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
      qc.invalidateQueries({ queryKey: ["cms-admin-pages"] });
      qc.invalidateQueries({ queryKey: ["site-page"] });
    },
  });
}

export function parsePage(row: { content: unknown }): SitePage {
  return {
    ...row,
    content: (typeof row.content === "string" ? JSON.parse(row.content) : row.content) as ContentBlock[],
  } as SitePage;
}

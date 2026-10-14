import { useQuery } from "@tanstack/react-query";
import { selectRows } from "@/lib/backend";

type SettingRow = { setting_key: string; setting_value: string | null };

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const rows = await selectRows<SettingRow>("site_settings", { select: "setting_key,setting_value" });
      const map: Record<string, string> = {};
      for (const row of rows) map[row.setting_key] = row.setting_value ?? "";
      return map;
    },
  });
}

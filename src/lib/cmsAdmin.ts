import { supabase } from "@/integrations/supabase/client";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;

export async function cmsAdminCall(action: string, payload: any = {}) {
  const password = sessionStorage.getItem("dashboard-password");
  if (!password) throw new Error("Not authenticated");

  const { data, error } = await supabase.functions.invoke("cms-admin", {
    body: { password, action, payload },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}
